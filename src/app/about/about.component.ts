import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';

interface CardItem {
  title: string;
  description: string;
  video: string;
  colspan: number;
  rowspan: number;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AboutComponent implements AfterViewInit {
  @ViewChildren('videoElem') videos!: QueryList<ElementRef<HTMLVideoElement>>;

  cards: CardItem[] = [
    {
      title: 'Explore your relationship',
      description: 'A friend, a partner, or a mentor.',
      video: '/image/friend.mp4',
      colspan: 4,
      rowspan: 3,
    },
    {
      title: 'Chat about everything',
      description: 'Talk and grow smarter together.',
      video: '/image/chat.mp4',
      colspan: 2,
      rowspan: 2,
    },
    {
      title: 'Discover the Universe',
      description: 'Explore stars, galaxies and dreams.',
      video: '/image/discover.mp4',
      colspan: 4,
      rowspan: 2,
    },
    {
      title: 'Mental Health & Calm',
      description: 'Relax with calm meditation scenes.',
      video: '/image/calm.mp4',
      colspan: 2,
      rowspan: 3,
    },
    {
      title: 'Dream Worlds',
      description:
        'Escape daily stress with ManshotBot’s soothing voice and thoughtful support.',
      video: '/image/stress.mp4',
      colspan: 4,
      rowspan: 2,
    },
    {
      title: 'Travel Journeys',
      description:
        'Discover new horizons and fresh ideas with ManshotBot by your side.',
      video: '/image/ideas.mp4',
      colspan: 2,
      rowspan: 2,
    },
  ];

  ngAfterViewInit() {
    this.videos.forEach((videoEl: ElementRef<HTMLVideoElement>) => {
      if (videoEl?.nativeElement?.pause) {
        videoEl.nativeElement.pause();
      }
    });
  }

  playVideo(index: number) {
    const video = this.videos.toArray()[index].nativeElement;
    if (video?.play) {
      video.play();
    }
  }

  pauseVideo(index: number) {
    const video = this.videos.toArray()[index].nativeElement;
    if (video?.pause) {
      video.pause();
    }
  }
}
