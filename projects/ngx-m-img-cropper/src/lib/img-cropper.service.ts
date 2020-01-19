import { Injectable } from '@angular/core';
import {ImgCropConfig} from './img-crop-config';
import {Observable, Observer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgCropperService {
  private imgCropConfigObserver: Observer<ImgCropConfig>;
  private imgCropConfig: Observable<ImgCropConfig> = new Observable(observer => {
    this.imgCropConfigObserver = observer;
  });
  private resultResolve: (value?: string | PromiseLike<string>) => void;
  private resultReject: (reason?: any) => void;
  constructor() { }

  /**
   * 订阅截图配置项
   * @param fun 配置
   */
  subscriptConfig(fun: (config: ImgCropConfig) => void): void {
    this.imgCropConfig.subscribe(fun);
  }
  /**
   * 发送截图的data uri
   * @param data 数据
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
