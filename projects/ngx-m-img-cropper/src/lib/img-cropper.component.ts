import {Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {ImgCropperService} from './img-cropper.service';
import {ImgRotateService} from './img-rotate.service';
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
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD20lEQVRoQ+1ZQXLaMBR9nwQnZNN0F9iUbjqwam4QOEHpCUJOUHICyAmgJ2hygpAThJygzgq3XZRuIDNd1GwgwcDvyDYNGGxLBjowEy3tL+m9/6WvryfCljfacvx4ISAieMSZNCycEOgY4GPxjUA5N7o6g00CWiC0LB7d/NZ+6KuKfOQIHHL6MGHtnYKpRERpRUAmA5dDDK+WJTNDIDnIVonYbMeNCz9ADvBEmYAigENF4HPmDG4MMTqPSmSGQGqQZWcGvmxrxpl3ttTwXQHjnS+rAO4dm4FaP96/MKllqjjFh8AsCeH1A2u/CpDw+jqbbmF4phKNAAIOiV788fzAStwCsDfnf2imhWFelkQIARuuCKnEWucugDqDdCaezTKMtJ2hGAUivJFwgjQJGQKB8zH4jmLjWnv3e10CmJ1yYxYqAJ2G2EuRiEyAGb9oZ1SSBe4FK4jQgGpE+BBARO/F+/mgjR2RAN/34o851YyxCGjqKVMBUdmPBAOfO1qz5PdfmQAztzp7xluZ5SJrczTIFGMgkZ4XtjFx/iFuNBb9VCbgDLL4nJAFrBoJcdh1NCO/QgLrIZF8ytb99oRfFCJGYOKL1UbCzVA6QK+83mbGTWevWfB+X5IAMAafPWjG5TLLZ7pv0KbuxfuvvYnDW8zVJuWwLCCVM0BmTKdsSfxZaBsbffSm7cjltAyYqDb+e4Gv2poxU49tJoFBtkRAdW4fgO86mjG5KNm/N5LAkZXJxZhEAeltZltrvp7+uJkE7HqJfi5agm2tOYN5IwkI4M+Xq1kaLwSiZhaVfs6BtsVLyH8Tc7etGTOXq43cA8ltT6PJQaZBoJP5ZbcFB9nWlxJLFXMqmWIdtm72+bpIBZEqp9cBSmXM5FP2mghzNb8YQ+pC453M0UH3r12l2QRxLUg3VQHrtQ1aOkK68RZxk/6BaTQ5yNxOyeRun9XewsSgK7vUT3sl6DQEEKrXyEYjZWXKYKr42fut/dAIhBCAkFdoZ3y+pLBV9VvzAqAQz/pa/1ha2PJ6wf9AebYUkgfFuNbe/XYj43X34l4OV7q5a2GUCxN5A/eAK6s3AHovAc4EuM5gnYkm4q4Yn/FP3OWC7GtOkJildKFRJCHBM8xEzvOhe2B6GpdETUJRDkMX8p/vLYyKYctGKQLTxk6VyEIanxOelkQOIeL24/2KqmCsXE67j3wVAj4tC9rONOC7IUYlFa9HjsDcOTFAkUFFyVeXqe7Oa46FUS0qcKU9EOZp+7HCIlHDpIWyR/aT1CRzcZcBHUwmgfVxDA0/qTxsnkX/lZdQlEnW2eeFwDq9KzP2X4Ho+EDFCQp1AAAAAElFTkSuQmCC"
             style="color: white;border: none;width: 50px;height: 30px;position: absolute;top: 10px;left: 100px" (click)="rot(1)">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEO0lEQVRoQ+1ZS1IjRxB9KdENeDPaOALYWLOYiWY1zAncPoHFCQZOYDgB4gRmTmBxgtGcAPkEhpU67MXIG4kILyxtsNCn0lGtD/2r6lKrNDYR1E7RVZnvZWZlVqYIz3zRM8ePFwL/tQeteGCPvWppyu/AdCQJsaAjEFeI0JK/BaMzxfTuL/ePW9uECxMIQU/wAUw1ACHwvMXMHRA1mfjzvROE5NZdKxMIgY9xAdDJOsoZ3GLCpY5IhauVPnX6Oj3GBKSw3fHuBQFn6wBPng2JODi9p6AT/Sb1fTPevREOHye/RfcZEZhZnT6ZhkoBgn1BfLzwxgJ8qK80Pe5u/d5Uycwl8O3ozZGDrRsAlXxgfMdAH0x9EDoAh3eDQN/nnwUE+HToDJvS8gtjMfCx57aVXtcSmIP/Ta+crwXQkop18XoweVtjUfYJfALQK41MGfNLYzH4154b+Ct7YB42ErzC8nwtHNR18ZmlNAyP0c4ZSN4lLZHl8a7bVho680MsBlMoeCCAs3s3aJiEhWrPzLvlBkDv8uQI4h9U2SqTwMHIk4I/pDIG488JTWq2CtIss+008+4IA+c9t32VRTRFYB46X9KbeTDG1LcFXso3TRDM+NzbbsuCmVopAvsj74ZA6UuTk87ywiD53RS8PCcreG87eJ1LYG/s+SUmmcISi6+7brBW5c0oUtLLBql5dlI4/DorYcQ8oIp91eFVrb7YvzfyToipToTvjGUoIiBGYP/R+0JE1bhQu9aPypb3DWP4JcBnJl9HSFXQlgSURcty7OssHiUEoBatE6qCtiSwPzo8I+DnpAJdETF2f8GN0qhb2PLB8InY77pB6s4sCRw8enUQXUR15ZXxgrisHot4wGulC8rm4t8WCz0B5svudlC3pWwTcl4IbMKqq8h8usQZD7hndYmzshCA267bfr+KRb723icPTN7WIMqy740t288I2wSXBOZNzN8pAuDTdZsX26Cj8hJvocMmEX6MFTPNU3aTwExlxwkonhNyWvB/9UKMwCyMdjrJZls2FP+4w/d5UzJTq9ncl9GRZT/qAG503eDUpnIbsjKb+v3Hw07W21zXXBcFYzL/1MnOnkooUqoUxMBVz22fFwUcPTdvYT8J8HnRO6YcGKn6gzmA27yhq45geNcmOz+BaflQLJootKNFVY/8BI4bwsGl6XQuAlzOOlPNSRESWgLGg6f5HxdUEi0hB7sApjwdlKkczkBnPS/8zHFNzFU8eHCG1VWyXe50WsrP98T6N4ILTv2MCEh4chRSAv2yPtQsCXz34Az9VSy/kGJMICQx9nxi1PNmmeYkeQDG1YM7vCoCXupZicACWKHBVIpVsfF8UkwhAgsh8k8LiJIcusZmOGoP8B0YTeGiYZq58ry5FoFkUSKmI2KugFBloEo8/59Y/t3koGULdFSvNQJ5ltrU9xcCm7Ksqdx/AcocAE/hz90lAAAAAElFTkSuQmCC"
             style="border: none;width: 50px;height: 30px;position: absolute;top: 10px;right: 100px" (click)="rot(2)">
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
    <div #mydiv1 [style.display]="isShow?'block':'none'" style="position: fixed;z-index: 101; top: 0; left: 0; right: 0; bottom: 0;">
      <canvas #yasuo></canvas>
    </div>
  `,
  styles: []
})
export class ImgCropperComponent implements OnInit {
  leftIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD20lEQVRoQ+1ZQXLaMBR9nwQnZNN0F9iUbjqwam4QOEHpCUJOUHICyAmgJ2hygpAThJygzgq3XZRuIDNd1GwgwcDvyDYNGGxLBjowEy3tL+m9/6WvryfCljfacvx4ISAieMSZNCycEOgY4GPxjUA5N7o6g00CWiC0LB7d/NZ+6KuKfOQIHHL6MGHtnYKpRERpRUAmA5dDDK+WJTNDIDnIVonYbMeNCz9ADvBEmYAigENF4HPmDG4MMTqPSmSGQGqQZWcGvmxrxpl3ttTwXQHjnS+rAO4dm4FaP96/MKllqjjFh8AsCeH1A2u/CpDw+jqbbmF4phKNAAIOiV788fzAStwCsDfnf2imhWFelkQIARuuCKnEWucugDqDdCaezTKMtJ2hGAUivJFwgjQJGQKB8zH4jmLjWnv3e10CmJ1yYxYqAJ2G2EuRiEyAGb9oZ1SSBe4FK4jQgGpE+BBARO/F+/mgjR2RAN/34o851YyxCGjqKVMBUdmPBAOfO1qz5PdfmQAztzp7xluZ5SJrczTIFGMgkZ4XtjFx/iFuNBb9VCbgDLL4nJAFrBoJcdh1NCO/QgLrIZF8ytb99oRfFCJGYOKL1UbCzVA6QK+83mbGTWevWfB+X5IAMAafPWjG5TLLZ7pv0KbuxfuvvYnDW8zVJuWwLCCVM0BmTKdsSfxZaBsbffSm7cjltAyYqDb+e4Gv2poxU49tJoFBtkRAdW4fgO86mjG5KNm/N5LAkZXJxZhEAeltZltrvp7+uJkE7HqJfi5agm2tOYN5IwkI4M+Xq1kaLwSiZhaVfs6BtsVLyH8Tc7etGTOXq43cA8ltT6PJQaZBoJP5ZbcFB9nWlxJLFXMqmWIdtm72+bpIBZEqp9cBSmXM5FP2mghzNb8YQ+pC453M0UH3r12l2QRxLUg3VQHrtQ1aOkK68RZxk/6BaTQ5yNxOyeRun9XewsSgK7vUT3sl6DQEEKrXyEYjZWXKYKr42fut/dAIhBCAkFdoZ3y+pLBV9VvzAqAQz/pa/1ha2PJ6wf9AebYUkgfFuNbe/XYj43X34l4OV7q5a2GUCxN5A/eAK6s3AHovAc4EuM5gnYkm4q4Yn/FP3OWC7GtOkJildKFRJCHBM8xEzvOhe2B6GpdETUJRDkMX8p/vLYyKYctGKQLTxk6VyEIanxOelkQOIeL24/2KqmCsXE67j3wVAj4tC9rONOC7IUYlFa9HjsDcOTFAkUFFyVeXqe7Oa46FUS0qcKU9EOZp+7HCIlHDpIWyR/aT1CRzcZcBHUwmgfVxDA0/qTxsnkX/lZdQlEnW2eeFwDq9KzP2X4Ho+EDFCQp1AAAAAElFTkSuQmCC`;
  private cropParams = new MCropParams();
  isShow = false;
  @ViewChild('mydiv', {static: true})
  mydiv: ElementRef;
  @ViewChild('drawCanvas', {static: true})
  drawCanvas: ElementRef;
  @ViewChild('selFile', {static: true})
  selFile: ElementRef;
  @ViewChild('tbox', {static: true})
  tbox: ElementRef;
  @ViewChild('croppedImg', {static: true})
  private croppedImg: ElementRef<HTMLImageElement>;
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
  constructor(private imgCropperService: ImgCropperService, private rotate: ImgRotateService,
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
      console.log(e);
      console.log(this.croppedImg.nativeElement.naturalWidth);
      console.log(this.croppedImg.nativeElement.naturalHeight);
      this.sourceImgWidth = this.croppedImg.nativeElement.naturalWidth;
      this.sourceImgHeight = this.croppedImg.nativeElement.naturalHeight;
      this.resetCroppedImg();
      this.isShow = true;
      if (location.hash.indexOf(this.cropParams.id) === -1) {
        location.hash = location.hash + this.cropParams.id;
      }
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
  rot(type: number) {
    this.rotate.getImg(this.croppedImg.nativeElement.src.toString(), type).then(ss => {
      this.croppedImg.nativeElement.src = ss;
      // this.croppedImg.nativeElement.setAttribute('width', '');
      // this.croppedImg.nativeElement.setAttribute('height', '');
      // this.croppedImgHeight = null;
      // this.croppedImgWidth = null;
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
      this.croppedImg.nativeElement.src = reader.result.toString();
    };
    this.selFile.nativeElement.value = '';
  }
  use(): void {
    console.log(1);
    const tboxTargetRatio = this.tboxWidth / this.targetWidth;
    const drawc = this.drawCanvas.nativeElement;
    drawc.width = this.targetWidth;
    drawc.height = this.targetHeight;
    const dctx = drawc.getContext('2d');
    console.log(2);
    const cropx1 = Math.max(this.croppedImgLeft, this.tboxLeft);
    const cropy1 = Math.max(this.croppedImgTop, this.tboxTop);
    const cropx2 = Math.min(this.croppedImgLeft + this.croppedImgWidth, this.croppedImgLeft + this.croppedImgWidth);
    const cropy2 = Math.min(this.croppedImgTop + this.croppedImgHeight, this.tboxTop + this.tboxHeight);
    const cropw = cropx2 - cropx1;
    const croph = cropy2 - cropy1;
    console.log(3);
    const cropimgx = cropx1 - this.croppedImgLeft;
    const cropimgy = cropy1 - this.croppedImgTop;
    const myscale = this.croppedImgWidth / this.sourceImgWidth;
    dctx.rect(0, 0, this.targetWidth, this.targetHeight);
    dctx.fillStyle = this.cropParams.backgroundColor; // 'rgba(255,255,255,0)'
    dctx.fill();
    console.log(4);
    dctx.drawImage(this.croppedImg.nativeElement,
      cropimgx / myscale, cropimgy / myscale, cropw / myscale, croph / myscale,
      (cropx1 - this.tboxLeft) / tboxTargetRatio, (cropy1 - this.tboxTop) / tboxTargetRatio,
      (cropx2 - cropx1) / tboxTargetRatio, (cropy2 - cropy1) / tboxTargetRatio);
    const dataUrl = dctx.canvas.toDataURL('image/png');
    console.log(5);
    this.imgCropperService.sendImgData(dataUrl);
    this.croppedImg.nativeElement.src = '#';
    console.log(6);
    this.close();
    console.log(7);
  }
  close(): void {
    history.back();
  }

}
