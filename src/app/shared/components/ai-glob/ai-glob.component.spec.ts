import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiGlobComponent } from './ai-glob.component';

describe('AiGlobComponent', () => {
  let component: AiGlobComponent;
  let fixture: ComponentFixture<AiGlobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiGlobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiGlobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
