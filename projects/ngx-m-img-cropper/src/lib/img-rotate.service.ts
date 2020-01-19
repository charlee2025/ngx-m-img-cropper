import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgRotateService {
  subject = new Subject<{src: string, type: number}>();
  private resultResolve: (value?: string | PromiseLike<string>) => void;
  private resultReject: (reason?: any) => void;
  constructor() { }
  getCropImgData(params: {src: string, type: number}): Promise<string> {
    this.subject.next(params);
    const result: Promise<string> = new Promise<string>((resolve, reject) => {
      this.resultReject = reject;
      this.resultResolve = resolve;
    });
    return result;
  }
  sendImgData(data: string): void {
    this.resultResolve(data);
  }
  getImg(src: string, type: number): Promise<string> {
    console.log(2);
    const result: Promise<string> = new Promise<string>((resolve, reject) => {
      console.log(3);
      this.resultReject = reject;
      this.resultResolve = resolve;
    });
    console.log(4);
    const img = new Image();
    img.src = src;
    console.log(5);
    img.onload = () => {
      console.log(6);
      const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
      canvas.width = img.height;
      canvas.height = img.width;
      const dctx = canvas.getContext('2d');
      dctx.rect(0, 0, img.width, img.height);
      dctx.fillStyle = 'rgba(255,255,255,0)'; // this.cropParams.backgroundColor;
      dctx.fill();
      console.log(7);
      console.log(8);
      const r = type === 1 ? -Math.PI / 2 : Math.PI / 2;
      dctx.rotate(r);
      const t1 = type === 1 ? -img.width : 0;
      const t2 = type === 1 ? 0 : -img.height;
      dctx.translate(t1, t2);
      dctx.drawImage(img,
        0, 0, img.width, img.height,
        0, 0, img.width, img.height);
      const dataUrl = dctx.canvas.toDataURL('image/png');
      console.log(9);
      this.resultResolve(dataUrl);
    };
    return result;
  }
}
