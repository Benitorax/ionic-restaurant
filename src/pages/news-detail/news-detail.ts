import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database'


@IonicPage()
@Component({
    selector: 'page-news-detail',
    templateUrl: 'news-detail.html'
})
export class NewsDetailPage {
    id: any;
    newsDetails: any = {};

    constructor(public af: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
        this.id = this.navParams.get('id');
        af.object('/news/' + this.id).subscribe(res => {
            this.newsDetails = res;
        })
    }


}
