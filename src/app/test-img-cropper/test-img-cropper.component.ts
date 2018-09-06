import { Component, OnInit } from '@angular/core';
import {ImgCropperService} from '../../../projects/ngx-m-img-cropper/src/lib/img-cropper.service';
import {MCropParams} from '../../../projects/ngx-m-img-cropper/src/lib/m-crop-params';

@Component({
  selector: 'app-test-img-cropper',
  templateUrl: './test-img-cropper.component.html',
  styleUrls: ['./test-img-cropper.component.css']
})
export class TestImgCropperComponent implements OnInit {
  imgsrc = 'assets/header.jpg';
  constructor(private imgCropperService: ImgCropperService) { }

  ngOnInit() {
    const config: MCropParams = new MCropParams();
    console.log(config.xMargin);
  }
  click(): void {
    console.log('click');
    this.imgCropperService.getCropImgData({width: 400, height: 300})
      .then(data => {
        this.imgsrc = data;
      });
  }

}
