# ngx-m-img-cropper - Angular Mobile Image Crop

## Demo
[Live Demo](https://lichangfeng.github.io/ngx-m-img-cropper/)
![avatar](https://lichangfeng.github.io/ngx-m-img-cropper/assets/demo_qrcode.png)

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 8 or higher, tested with 8.0.3)
* [hammerjs](http://hammerjs.github.io/) (*requires* 2.0.8 or higher)

## Installation

```shell
npm i hammerjs
npm i ngx-m-img-cropper
```

import hammerjs in main.ts
```
import 'hammerjs';
```

Once installed you need to import the main module:
```js
import {ImgCropperModule} from 'ngx-m-img-cropper';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [ImgCropperModule, ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
the cropped image 's background color is green, you can change it by provide a MCropParams
```js
 providers: [
    {provide: MCropParams, useValue: {backgroundColor: '#f0f0f0'}}, ...
  ]
```

add the m-img-cropper componet to your app.component.html
```js
<m-img-cropper></m-img-cropper>
```

## Usage

use it like this:
```js
import { Component, OnInit } from '@angular/core';
import {ImgCropperService} from 'ngx-m-img-cropper';

@Component({
  selector: '...',
  templateUrl: '...',
  styleUrls: ['...']
})
export class Mine1Component implements OnInit {

  imgsrc = 'assets/header.jpg';
  constructor(private imgCropperService: ImgCropperService) { }

  ngOnInit() {
  }
  click(): void {
    this.imgCropperService.getCropImgData({width: 400, height: 300})
      .then(data => {
        this.imgsrc = data;
      });
  }
```


## License

MIT License (MIT)

end
