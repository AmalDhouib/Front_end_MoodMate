import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoareComponent } from './whoare.component';

describe('WhoareComponent', () => {
  let component: WhoareComponent;
  let fixture: ComponentFixture<WhoareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
