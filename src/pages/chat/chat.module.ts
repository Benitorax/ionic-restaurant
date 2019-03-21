import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import {MomentModule} from 'angular2-moment';

@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    MomentModule
  ],
  exports: [
    ChatPage
  ]
})
export class ChatPageModule {}
