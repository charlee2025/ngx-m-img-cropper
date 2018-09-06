import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestImgCropperComponent } from './test-img-cropper.component';

describe('TestImgCropperComponent', () => {
  let component: TestImgCropperComponent;
  let fixture: ComponentFixture<TestImgCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestImgCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestImgCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
