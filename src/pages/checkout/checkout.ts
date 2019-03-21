import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal';
import {Stripe} from '@ionic-native/stripe';
import {CheckoutService} from './checkout.service';


const payPalEnvironmentSandbox = 'AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB';
const publishableKey = 'pk_test_mhy46cSOzzKYuB2MuTWuUb34';
const stripe_secret_key = 'sk_test_GsisHcPqciYyG8arVfVe2amE';

@IonicPage()
@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html',
    providers: [PayPal, Stripe, CheckoutService]
})

export class CheckoutPage {
    date: any;
    orderId: any;
    order: any = {};
    userId: any;
    userDetails = {
        email: '',
        name: '',
        mobileNo: '',
        userid: ''
    };
    checkout: FirebaseListObservable<any>;
    userDetail: FirebaseObjectObservable<any>;
    bookings: FirebaseObjectObservable<any>;
    color: any;
    str: any;
    paymentType: string;
    paymentDetails: any = {
        paymentStatus: true
    };
    stripe_card: any = {};

    public paymentTypes: any = [{
        'default': true,
        'type': 'PayPal',
        'value': 'PayPal',
        'logo': 'assets/img/paypal_logo.jpg'
    },
        {'default': false, 'type': 'Stripe', 'value': 'Stripe', 'logo': 'assets/img/stripe.png'},
        {'default': false, 'type': 'COD', 'value': 'COD', 'logo': ''}];

    constructor(public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams,
                public payPal: PayPal,
                public stripe: Stripe,
                private checkoutService: CheckoutService,
                private loadingCtrl: LoadingController,
                public alertCtrl: AlertController) {

        this.order = this.navParams.get("orderDetails");
        console.log("orderdata-" + JSON.stringify(this.order));
        this.str = '#';
        var num = Math.floor(Math.random() * 900000) + 100000;
        this.color = this.str.concat(num);
        this.checkout = db.list('/orders');
    }

    ionViewDidLoad() {
        this.paymentType = 'PayPal';
        if (this.af.auth.currentUser) {
            this.userId = this.af.auth.currentUser.uid;
            this.userDetail = this.db.object('/users/' + this.userId);
            this.userDetail.subscribe((res) => {
                this.userDetails = {
                    email: res.email,
                    name: res.name,
                    mobileNo: res.mobileNo,
                    userid: this.userId
                };

            });
        }
    }

    choosePaymentType(paymentType) {
        this.paymentType = paymentType;
        this.order.paymentType = paymentType;
        this.paymentDetails.paymentType = paymentType;
    }


    onCheckOut(form: NgForm) {
        this.order.orderId = Math.floor(Math.random() * 90000) + 10000;
        this.order.userDetails = this.userDetails;
        this.order.userId = this.userId;
        this.order.createdAt = Date.now();
        this.order.status = "pending";
        this.order.paymentStatus = "pending";
        this.order.statusReading = [{
            title: 'Your order has been accepted.You will get notified the status here.',
            time: Date.now()
        }];
        if (this.paymentType == 'PayPal') {
            const config = {
                PayPalEnvironmentProduction: '',
                PayPalEnvironmentSandbox: payPalEnvironmentSandbox
            }
            this.checkout.push(this.order).then((res) => {
                this.payPal.init(config).then(() => {
                    this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then(() => {
                        let payment = new PayPalPayment(this.order.grandTotal, 'USD', 'Description', 'sale');
                        this.payPal.renderSinglePaymentUI(payment).then((success) => {

                            this.paymentDetails.transactionId = success.response.id;
                            this.db.object('/orders/' + res.key).update({
                                paymentDetails: this.paymentDetails,
                                paymentStatus: "success"
                            }).then(() => {
                                this.navCtrl.setRoot("ThankyouPage");
                            })

                        }, (error) => {
                            console.error(error);
                        });
                    }, (error) => {
                        console.error(error);
                    })
                }, (error) => {
                    console.error(error);
                })
            })

        } else if (this.paymentType == 'Stripe') {
            if(this.order.grandTotal >= 50){
            let loader = this.loadingCtrl.create({
                content: 'please wait..'
            })
            loader.present();
            this.checkout.push(this.order).then((order) => {
                this.stripe.setPublishableKey(publishableKey);
                let card = {
                    number: this.stripe_card.cardNumber,
                    expMonth: this.stripe_card.expiryMonth,
                    expYear: this.stripe_card.expiryYear,
                    cvc: this.stripe_card.cvc
                };
                this.stripe.createCardToken(card)
                    .then(token => {
                        let stripe_token: any = token;
                        if (token) {
                            this.checkoutService.chargeStripe(stripe_token.id, "USD", Math.round(this.order.grandTotal), stripe_secret_key)
                                .then((result) => {
                                    let res: any = result;
                                    this.paymentDetails.transactionId = res.balance_transaction;
                                    loader.dismiss();
                                    this.stripe_card = {};
                                    this.db.object('/orders/' + order.key).update({
                                        paymentDetails: this.paymentDetails,
                                        paymentStatus: "success"
                                    }).then(() => {
                                        loader.dismiss();
                                        this.navCtrl.setRoot("ThankyouPage");
                                    })
                                }, error => {
                                    loader.dismiss();
                                });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        loader.dismiss();
                        this.showAlert(error);
                    });
            }, error => {
                loader.dismiss();
            })
        }
        else{

            this.showAlert('Amount should be greater than $50.');
        }
        } else {
            console.log("order----" + JSON.stringify(this.order));
            this.checkout.push(this.order).then((res) => {
                this.navCtrl.setRoot("ThankyouPage");
            })
        }

    }

    showAlert(message) {
        let alert = this.alertCtrl.create({
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}
