import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationPage } from './location';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { PipesModule } from '../../app/pipes.module';

@NgModule({
  declarations: [
    LocationPage
  ],
  imports: [
    IonicPageModule.forChild(LocationPage),
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDkIzaOmzxf0hm5Qd9h7YeEMtD5Iz_hpbY'
    })
  ],
  exports: [
    LocationPage
  ]
})
export class LocationPageModule {}