import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'


@IonicPage()
@Component({
    selector: 'page-order-details',
    templateUrl: 'order-details.html'
})

export class OrderDetailsPage {
    orderId: any;
    index: '';
    orderDetails: any = {
        item: {review: ''}
    };

    constructor(public af: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams) {

        this.orderId = this.navParams.get('orderId');
        this.index = this.navParams.get('index');
        this.af.object('/orders/' + this.orderId + '/cart/' + this.index).subscribe(res => {
            console.log("res-" + JSON.stringify(res));
            this.orderDetails = res;
        })
    }


    buyAgain(key) {
        this.navCtrl.push("ProductDetailsPage", {id: key});
    }

    rate(itemId) {
        this.navCtrl.push("RatingPage", {
            orderId: this.orderId,
            index: this.index,
            itemId: itemId,

        })
    }

}
