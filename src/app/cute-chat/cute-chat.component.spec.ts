import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuteChatComponent } from './cute-chat.component';

describe('CuteChatComponent', () => {
  let component: CuteChatComponent;
  let fixture: ComponentFixture<CuteChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuteChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuteChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
