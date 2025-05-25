import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

interface ChatResponse {
  response: string;
  emotion?: string;
  emoji?: string;
  conversation_id?: string;
}

interface ChatMessage {
  sender: string;
  text: string;
}

interface ConversationMeta {
  conversation_id: string;
  latest: string;
}

interface WeeklyEmotion {
  date: string;
  emotion: string;
  emoji: string;
}

@Component({
  selector: 'app-cute-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './cute-chat.component.html',
  styleUrls: ['./cute-chat.component.css'],
})
export class CuteChatComponent implements OnInit {
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  message = '';
  chatHistory: ChatMessage[] = [];
  conversations: ConversationMeta[] = [];
  weeklyEmotions: WeeklyEmotion[] = [];
  userId = '';
  activeConversationId: string | null = null;

  recognition: any;
  isListening = false;
  sidebarVisible = false;
  isSpeaking = false;
  isTyping = false;
  utterance: SpeechSynthesisUtterance | null = null;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const urlUserId = new URLSearchParams(window.location.search).get(
        'user_id'
      );
      if (urlUserId) {
        this.userId = urlUserId;
        localStorage.setItem('user_id', this.userId);
      } else {
        this.userId = localStorage.getItem('user_id') || '';
      }
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadConversationList();
    this.loadWeeklyEmotions();
    this.initializeSpeechRecognition();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const isMobile = window.innerWidth <= 768;
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.floating-toggle');

    if (
      isMobile &&
      sidebar &&
      toggle &&
      this.sidebarVisible &&
      !sidebar.contains(event.target as Node) &&
      !toggle.contains(event.target as Node)
    ) {
      this.sidebarVisible = false;
    }
  }

  cleanBotText(text: string): string {
    if (!text) return '';
    const withoutStars = text.replace(/\*\*/g, '');
    return withoutStars.replace(/\n/g, '<br>');
  }

  sendMessage() {
    if (!this.message.trim()) return;

    const question = this.message;
    this.chatHistory.push({ sender: 'user', text: question });
    this.message = '';
    this.isTyping = true;

    this.http
      .post<ChatResponse>('http://127.0.0.1:5000/chat', {
        question,
        user_id: this.userId,
        conversation_id: this.activeConversationId,
      })
      .subscribe({
        next: (res) => {
          const botMessage = res.emoji
            ? `${res.emoji} ${res.response}`
            : res.response;
          this.chatHistory.push({ sender: 'bot', text: botMessage });
          this.isTyping = false;

          if (!this.activeConversationId) {
            this.activeConversationId = res.conversation_id || null;
            this.loadConversationList();
          }

          this.scrollToBottom();
        },
        error: () => {
          this.chatHistory.push({ sender: 'bot', text: 'Connection error 😞' });
          this.isTyping = false;
        },
      });
  }

  loadConversationList() {
    this.http
      .get<ConversationMeta[]>(
        `http://127.0.0.1:5000/conversations/${this.userId}`
      )
      .subscribe({
        next: (convs) => (this.conversations = convs),
        error: () => console.error('Error loading conversations'),
      });
  }

  loadConversation(conversation_id: string) {
    this.http
      .get<any[]>(
        `http://127.0.0.1:5000/conversation/${conversation_id}?user_id=${this.userId}`
      )
      .subscribe({
        next: (messages) => {
          this.chatHistory = messages.map((msg) => ({
            sender: msg.sender,
            text: msg.text,
          }));
          this.activeConversationId = conversation_id;
          this.scrollToBottom();
        },
        error: () => console.error('Error loading conversation'),
      });
  }

  loadWeeklyEmotions() {
    this.http
      .get<WeeklyEmotion[]>(
        `http://127.0.0.1:5000/weekly-emotions/${this.userId}`
      )
      .subscribe({
        next: (data) => (this.weeklyEmotions = data),
        error: () => console.error('Error loading emotions'),
      });
  }

  startNewConversation() {
    this.chatHistory = [];
    this.activeConversationId = null;
    this.loadConversationList();
    this.chatHistory.push({
      sender: 'bot',
      text: 'Welcome to your new conversation! How can I help you today?',
    });
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      const chat = document.getElementById('chat-messages');
      if (chat) chat.scrollTop = chat.scrollHeight;
    }, 100);
  }

  adjustTextarea(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = Math.min(target.scrollHeight, 200) + 'px';
  }

  initializeSpeechRecognition() {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        this.message = transcript.trim();
        this.sendMessage();
      });
    };

    this.recognition.onerror = () =>
      this.zone.run(() => (this.isListening = false));
    this.recognition.onend = () =>
      this.zone.run(() => (this.isListening = false));
  }

  startListening() {
    if (!this.recognition) this.initializeSpeechRecognition();
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  playAudio(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    if (this.isSpeaking) {
      synth.cancel();
      this.isSpeaking = false;
      return;
    }

    if (!text) return;

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'en-US';

    const voices = synth.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang === 'en-US' || v.lang.startsWith('en')
    );
    if (englishVoice) this.utterance.voice = englishVoice;

    this.utterance.onend = () => {
      this.zone.run(() => (this.isSpeaking = false));
    };

    this.isSpeaking = true;
    synth.speak(this.utterance);
  }

  goToChart() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/chart']);
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
