import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ImgCropperModule} from '../../projects/ngx-m-img-cropper/src/lib/img-cropper.module';
import { TestImgCropperComponent } from './test-img-cropper/test-img-cropper.component';
import {MCropParams} from '../../projects/ngx-m-img-cropper/src/lib/m-crop-params';

@NgModule({
  declarations: [
    AppComponent,
    TestImgCropperComponent
  ],
  imports: [
    BrowserModule,
    ImgCropperModule
  ],
  providers: [
    {provide: MCropParams, useValue: {backgroundColor: '#f0f0f0'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
