import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'


@IonicPage()
@Component({
    selector: 'page-news',
    templateUrl: 'news.html'
})
export class NewsPage {
    newsData: any[] = [];

    constructor(public af: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
        af.list('/news').subscribe((res) => {
            this.newsData = res;
        })
    }


    newsDetail(key) {
        this.navCtrl.push("NewsDetailPage", {
            id: key
        });
    }

    isNews(): boolean {
        return this.newsData.length == 0 ? false : true;

    }


}
