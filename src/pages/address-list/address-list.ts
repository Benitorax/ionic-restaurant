import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

declare let google: any;


@IonicPage()
@Component({
    selector: 'page-address-list',
    templateUrl: 'address-list.html',
})
export class AddressListPage {


    grandTotal: any;
    subTotal: any;
    address: any = {};
    addressList: any = [];
    payTotal: any;
    couponDiscount: any;
    deductedPrice: any;
    cart: Array<any>;
    orderDetails: any = {};

    constructor(public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController) {


        this.orderDetails.grandTotal = this.navParams.get('grandTotal');
        this.orderDetails.couponDiscount = this.navParams.get('couponDiscount');
        this.orderDetails.subTotal = this.navParams.get('subTotal');
        this.orderDetails.deductedPrice = this.navParams.get('deductedPrice');
        this.orderDetails.tax = this.navParams.get('totalVat');
        if (this.orderDetails.grandTotal == undefined) {
            this.navCtrl.push("CartPage");
        }
        if (this.af.auth.currentUser) {
            this.db.list('/users/' + this.af.auth.currentUser.uid + '/address').subscribe(res => {
                this.addressList = res;
            });
        }
        this.orderDetails.cart = JSON.parse(localStorage.getItem('Cart'));
    }

// Add Address
    addAddress() {
        this.navCtrl.push("AddAddressPage", {
            id: 0
        });
    }


//Selected Address
    selectAddress(key, address) {
        this.orderDetails.shippingAddress = address;

    }


    checkOut() {
        if (this.orderDetails.shippingAddress) {
            this.navCtrl.push("CheckoutPage", {
                orderDetails: this.orderDetails
            });
        }
        else {
            this.showAlert();
        }
    }

    showAlert() {
        let alert = this.alertCtrl.create({
            title: 'Sorry!',
            subTitle: 'Select Your Address First!',
            buttons: ['OK']
        });
        alert.present();
    }


}
