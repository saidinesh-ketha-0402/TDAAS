import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prompt2CodeOutputComponent } from './prompt2-code-output.component';

describe('Prompt2CodeOutputComponent', () => {
  let component: Prompt2CodeOutputComponent;
  let fixture: ComponentFixture<Prompt2CodeOutputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Prompt2CodeOutputComponent]
    });
    fixture = TestBed.createComponent(Prompt2CodeOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
