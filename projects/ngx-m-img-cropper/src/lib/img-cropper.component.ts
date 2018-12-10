import {Component, ElementRef, Inject, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImgCropperService} from './img-cropper.service';
import {ActivatedRoute, Router} from '@angular/router';
import {tryCatch} from 'rxjs/internal-compatibility';
import {MCropParams} from './m-crop-params';
import {isUndefined} from 'util';
declare  var Hammer: any;
@Component({
  selector: 'm-img-cropper',
  template: `
    <div #mydiv
         [style.display]="isShow?'block':'none'"
         [style.width]="winWidth + 'px'"
         [style.height]="winHeight + 'px'"
         style="position: fixed;z-index: 1000; top: 0; left: 0; right: 0; bottom: 0;background-color: black;">
      <canvas #drawCanvas style="display: none"></canvas>
      <input type="file" #selFile (change)="selectFile($event)" style="display: none;" accept="image/*">
      <header style="width: 100%;height: 50px;background-color: darkslategray;position: absolute;z-index: 100;top: 0; left: 0;">
        <button (click)="close()"
                style="background-color: transparent;color: white;border: none;width: 50px;height: 30px;position: absolute;top: 10px;">
          &lt;返回
        </button>
        <button (click)="use()"
                style="background-color: forestgreen;color: white;border: none;width: 50px;height: 30px;position: absolute;top: 10px;right: 10px">
          使用
        </button>
      </header>
      <img #croppedImg src="#" [style.width]="croppedImgWidth + 'px'" [style.height]="croppedImgHeight + 'px'"
           [style.top]="croppedImgTop + 'px'" [style.left]="croppedImgLeft + 'px'" style="display: block;position: absolute;"/>
      <div #tbox [style.width]="tboxWidth + 'px'" [style.height]="tboxHeight + 'px'"
           [style.top]="tboxTop + 'px'" [style.left]="tboxLeft + 'px'" style="outline: white solid 1px;position: absolute;"></div>
    </div>
  `,
  styles: []
})
export class ImgCropperComponent implements OnInit {
  private cropParams = new MCropParams();
  isShow = false;
  @ViewChild('mydiv')
  mydiv: ElementRef;
  @ViewChild('drawCanvas')
  drawCanvas: ElementRef;
  @ViewChild('selFile')
  selFile: ElementRef;
  @ViewChild('tbox')
  tbox: ElementRef;
  @ViewChild('croppedImg')
  private croppedImg: ElementRef;
  private targetWidth: number;
  private targetHeight: number;
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  private sourceImgWidth: number;
  private sourceImgHeight: number;
  tboxWidth = 0;
  tboxHeight = 0;
  tboxLeft = 0;
  tboxTop = 0;
  croppedImgWidth: number;
  croppedImgHeight: number;
  croppedImgTop: number;
  croppedImgLeft: number;
  croppedImgCurrWidth: number;
  croppedImgCurrHeight: number;
  croppedImgCurrLeft: number;
  croppedImgCurrTop: number;
  constructor(private imgCropperService: ImgCropperService,
              private injector: Injector) {
    const cropParams = injector.get(MCropParams, {});
    for (const key in cropParams) {
      if (!isUndefined(cropParams[key])) {
        this.cropParams[key] = cropParams[key];
      }
    }
    console.log(this.cropParams);
  }

  ngOnInit() {
    if (location.hash.endsWith(this.cropParams.id)) {
      history.back();
      /*const newHash = location.hash.substr(0, location.hash.length - this.cropParams.id.length - 1);
      if (newHash.length === 0) {
        delete location.hash;
      } else {
        location.hash = newHash;
      }*/
    }
    window.addEventListener('resize', e => {
      this.winWidth = window.innerWidth;
      this.winHeight = window.innerHeight;
      this.resetTbox();
      this.resetCroppedImg();
    });
    this.imgCropperService.subscriptConfig(config => {
      this.targetHeight = config.height;
      this.targetWidth = config.width;
      this.resetTbox();
      this.selFile.nativeElement.click();
    });
    this.croppedImg.nativeElement.addEventListener('load', e => {
      this.sourceImgWidth = this.croppedImg.nativeElement.width;
      this.sourceImgHeight = this.croppedImg.nativeElement.height;
      this.resetCroppedImg();
      this.isShow = true;
      location.hash = location.hash + this.cropParams.id;
    });
    this.mydiv.nativeElement.addEventListener('touchmove', e => {
      e.stopPropagation();
      e.preventDefault();
    });
    const hammer = new Hammer(this.tbox.nativeElement);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('pinch').set({ enable: true });
    hammer.get('rotate').set({ enable: true });
    hammer.on('panstart', e => {
      console.log('panstart');
      this.croppedImgCurrLeft = this.croppedImgLeft;
      this.croppedImgCurrTop = this.croppedImgTop;
    });
    hammer.on('panmove', e => {
      console.log('panmove');
      this.croppedImgLeft = this.croppedImgCurrLeft + e.deltaX;
      this.croppedImgTop = this.croppedImgCurrTop + e.deltaY;
    });
    hammer.on('panend', e => {
      console.log('panend');
      this.croppedImgCurrLeft = this.croppedImgLeft;
      this.croppedImgCurrTop = this.croppedImgTop;
    });
    hammer.on('pinchstart', e => {
      console.log('pinchstart');
      this.croppedImgCurrWidth = this.croppedImgWidth;
      this.croppedImgCurrHeight = this.croppedImgHeight;
      this.croppedImgCurrLeft = this.croppedImgLeft;
      this.croppedImgCurrTop = this.croppedImgTop;
    });
    hammer.on('pinchmove', e => {
      console.log('pinchmove');
      const leftWidth = e.center.x - this.croppedImgCurrLeft;
      const topHeight = e.center.y - this.croppedImgCurrTop;
      this.croppedImgLeft = this.croppedImgCurrLeft - leftWidth * (e.scale - 1);
      this.croppedImgTop = this.croppedImgCurrTop - topHeight * (e.scale - 1);
      this.croppedImgWidth = this.croppedImgCurrWidth * e.scale;
      this.croppedImgHeight = this.croppedImgCurrHeight * e.scale;
    });
    hammer.on('pinchend', e => {
      console.log('pinchend');
      this.croppedImgCurrWidth = this.croppedImgWidth;
      this.croppedImgCurrHeight = this.croppedImgHeight;
    });
    window.addEventListener('hashchange', () => {
      if (this.isShow && !location.hash.endsWith(this.cropParams.id)) {
        this.isShow = false;
      }
    });
  }
  resetTbox(): void {
    const widthHeightRatio = this.targetWidth / this.targetHeight;
    let width = this.winWidth - this.cropParams.xMargin * 2;
    let height = this.winHeight - 50 - this.cropParams.yMargin * 2;
    width = Math.min(width, height * widthHeightRatio, this.cropParams.maxWidth);
    width = Math.min(width, Math.max(this.targetWidth, this.cropParams.minWidth));
    height = width / widthHeightRatio;
    this.tboxWidth = width;
    this.tboxHeight = height;
    this.tboxLeft = (this.winWidth - width) / 2;
    this.tboxTop = (this.winHeight - 50 - height) / 2 + 50;
  }
  resetCroppedImg(): void {
    const widthHeightRatio = this.sourceImgWidth / this.sourceImgHeight;
    if (widthHeightRatio > this.tboxWidth / this.tboxHeight) {
      this.croppedImgHeight = this.tboxHeight;
      this.croppedImgWidth = this.croppedImgHeight * widthHeightRatio;
    } else {
      this.croppedImgWidth = this.tboxWidth;
      this.croppedImgHeight = this.croppedImgWidth / widthHeightRatio;
    }
    this.croppedImgLeft = this.tboxLeft - (this.croppedImgWidth - this.tboxWidth) / 2;
    this.croppedImgTop = this.tboxTop - (this.croppedImgHeight - this.tboxHeight) / 2;
  }
  selectFile(event): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file); // base64编码
    reader.onload = () => {
      this.croppedImg.nativeElement.src = reader.result;
    };
    this.selFile.nativeElement['value'] = '';
  }
  use(): void {
    const tboxTargetRatio = this.tboxWidth / this.targetWidth;
    const drawc = this.drawCanvas.nativeElement;
    drawc.width = this.targetWidth;
    drawc.height = this.targetHeight;
    const dctx = drawc.getContext('2d');
    const cropx1 = Math.max(this.croppedImgLeft, this.tboxLeft);
    const cropy1 = Math.max(this.croppedImgTop, this.tboxTop);
    const cropx2 = Math.min(this.croppedImgLeft + this.croppedImgWidth, this.croppedImgLeft + this.croppedImgWidth);
    const cropy2 = Math.min(this.croppedImgTop + this.croppedImgHeight, this.tboxTop + this.tboxHeight);
    const cropw = cropx2 - cropx1;
    const croph = cropy2 - cropy1;
    const cropimgx = cropx1 - this.croppedImgLeft;
    const cropimgy = cropy1 - this.croppedImgTop;
    const myscale = this.croppedImgWidth / this.sourceImgWidth;
    dctx.rect(0, 0, this.targetWidth, this.targetHeight);
    dctx.fillStyle = this.cropParams.backgroundColor;
    dctx.fill();
    dctx.drawImage(this.croppedImg.nativeElement,
      cropimgx / myscale, cropimgy / myscale, cropw / myscale, croph / myscale,
      (cropx1 - this.tboxLeft) / tboxTargetRatio, (cropy1 - this.tboxTop) / tboxTargetRatio, (cropx2 - cropx1) / tboxTargetRatio, (cropy2 - cropy1) / tboxTargetRatio);
    const dataUrl = dctx.canvas.toDataURL('image/jpeg');
    this.imgCropperService.sendImgData(dataUrl);
    this.croppedImg.nativeElement.src = '#';
      this.close();
  }
  close(): void {
    history.back();
  }

}
