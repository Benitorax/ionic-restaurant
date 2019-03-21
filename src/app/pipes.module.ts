import {NgModule} from '@angular/core';
import {AppPipe} from './app.pipe';
import {TranslateModule} from 'ng2-translate/ng2-translate';






@NgModule({
    declarations: [
     AppPipe
    ],
    imports: [
      TranslateModule
  ],
 
  exports: [TranslateModule,AppPipe],
    
})
export class PipesModule {  }