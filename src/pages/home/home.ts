import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ImageService } from '../../services/image.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public imageService: ImageService
  ) {

  }

}
