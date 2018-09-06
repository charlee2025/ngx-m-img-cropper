import { Injectable } from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {ImgCropConfig} from './img-crop-config';

@Injectable({
  providedIn: 'root'
})
export class ImgCropperService {
  private imgCropConfigObserver: Observer<ImgCropConfig>;
  private imgCropConfig: Observable<ImgCropConfig> = Observable.create(observer => {
    this.imgCropConfigObserver = observer;
  });
  private resultResolve: Function;
  private resultReject: Function;
  constructor() { }

  /**
   * 订阅截图配置项
   * @param fun
   */
  subscriptConfig(fun: (config: ImgCropConfig) => void): void {
    this.imgCropConfig.subscribe(fun);
  }
  /**
   * 发送截图的data uri
   * @param data
   */
  sendImgData(data: string): void {
    this.resultResolve(data);
  }

  /**
   * 取消截图
   */
  cancel(): void {
    this.resultReject('操作取消');
  }

  /**
   * 获取截图
   * @param config 配置
   */
  getCropImgData(config?: ImgCropConfig): Promise<string> {
    if (!config) {
      config = new ImgCropConfig();
    }
    this.imgCropConfigObserver.next(config);
    const result: Promise<string> = new Promise<string>((resolve, reject) => {
      this.resultReject = reject;
      this.resultResolve = resolve;
    });
    return result;
  }
}
