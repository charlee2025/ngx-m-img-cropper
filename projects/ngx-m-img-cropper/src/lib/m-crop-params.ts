import {isUndefined} from 'util';
export class MCropParams {
  id = '#1314520';
  xMargin = 40;
  yMargin = 20;
  maxWidth = 600;
  minWidth = 300;
  constructor (config?: {id?: string, xMargin?: number, yMargin?: number, maxWidth?: number, minWidth?: number}) {
    if (config) {
      this.id = isUndefined(config.id) ? this.id : config.id;
      this.xMargin = isUndefined(config.xMargin) ? this.xMargin : config.xMargin;
      this.xMargin = isUndefined(config.xMargin) ? this.xMargin : config.xMargin;
      this.yMargin = isUndefined(config.yMargin) ? this.yMargin : config.yMargin;
      this.maxWidth = isUndefined(config.maxWidth) ? this.maxWidth : config.maxWidth;
      this.minWidth = isUndefined(config.minWidth) ? this.minWidth : config.minWidth;
    }
  }
}
