import {Component, OnInit} from '@angular/core';
import {ImgRotateService} from '../../projects/ngx-m-img-cropper/src/lib/img-rotate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'ngx-m-img-crop-demo';
  src = 'assets/1.jpg';
  constructor(private rotate: ImgRotateService) { }
  ngOnInit() {
  }
  rot(type: number) {
    this.rotate.getImg(this.src, type).then(ss => {
      console.log(11);
      this.src = ss;
    });
  }
  selectFile(event): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file); // base64编码
    reader.onload = () => {
      const src = reader.result;
      console.log(1);
      this.rotate.getImg(src.toString(), 1).then(ss => {
        console.log(11);
        this.src = ss;
      });
    };
  }
}
