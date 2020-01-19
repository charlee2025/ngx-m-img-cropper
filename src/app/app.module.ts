import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestImgCropperComponent } from './test-img-cropper/test-img-cropper.component';
import {ImgCropperModule} from '../../projects/ngx-m-img-cropper/src/lib/img-cropper.module';
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
    {provide: MCropParams, useValue: {backgroundColor: 'rgba(255,255,255,0)'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
