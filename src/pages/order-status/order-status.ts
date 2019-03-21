import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'


@IonicPage()
@Component({
    selector: 'page-order-status',
    templateUrl: 'order-status.html',
})
export class OrderStatusPage {

    orderId: any;
    orderStatus: any = [];

    constructor(public af: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams) {

        this.orderId = this.navParams.get('orderId');
        this.af.list('/orders/' + this.orderId + '/statusReading/').subscribe(res => {
            this.orderStatus = res;
        })
    }

}