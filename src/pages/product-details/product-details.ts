import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database'
import {CartService} from '../../pages/cart.service';


@IonicPage()
@Component({
    selector: 'page-product-details',
    templateUrl: 'product-details.html'
})
export class ProductDetailsPage {

    FireVisible = false;
    id: any;
    count: any = 1;
    resFevrt: any = {};

    public menuItems: any = {};
    public cart = {
        itemId: String,
        extraOptions: [],
        price: {
            name: "",
            value: Number,
            currency: ''
        },
        title: '',
        thumb: String,
        itemQunatity: this.count
    };
    Cart: any = [];
    noOfItems: any;


    public selectedItems: Array<any> = [];

    menuItem: FirebaseObjectObservable<any>;

    constructor(public navCtrl: NavController,
                public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public navParams: NavParams,
                public cartService: CartService,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController) {

        this.Cart = JSON.parse(localStorage.getItem('Cart'));
        if (localStorage.getItem('Cart') != null) {
            this.noOfItems = this.Cart.length;
        }
        this.id = this.navParams.get('id');
        this.menuItem = db.object('/menuItems/' + this.id)

        this.menuItem.subscribe((data) => {
            this.menuItems = data;
            this.cart.title = data.title;
            this.cart.itemId = data.$key;
            this.cart.thumb = data.thumb;

            if (this.af.auth.currentUser) {
                this.db.object('/users/' + this.af.auth.currentUser.uid + '/favourite/' + this.id).subscribe(res => {
                    this.resFevrt = res;
                })
            }
        })
    }

    addQuantity() {
        if (this.count < 10) {
            this.count = this.count + 1;
            this.cart.itemQunatity = this.count;
        }
    }

    removeQuantity() {
        if (this.count > 1) {
            this.count = this.count - 1
            this.cart.itemQunatity = this.count;
        }
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

    home() {
        this.navCtrl.push("HomePage");
    }

    sizeOptions(price) {
        this.cart.price = price;
    }


    checkOptions(extraOption) {
        if (this.cart.extraOptions.length != 0) {
            for (var i = 0; i <= this.cart.extraOptions.length - 1; i++) {
                if (this.cart.extraOptions[i].name == extraOption.name) {
                    this.cart.extraOptions.splice(i, 1);
                    break;
                }
                else {
                    this.cart.extraOptions.push(extraOption);
                    break;
                }
            }
        }
        else {
            this.cart.extraOptions.push(extraOption);
        }
    }


    addToCart() {
        console.log("item.cart" + JSON.stringify(this.cart.price));
        if (this.cart.price.name == "") {
            console.log('if');
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Size and Price!',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            console.log('else');
            this.cartService.OnsaveLS(this.cart);
            this.navCtrl.push("CartPage");
        }
    }

    visible = false;


    addToFevrt(key) {
        console.log('uid' + key);
        if (this.af.auth.currentUser) {
            console.log('uid' + key);
            this.db.object('/users/' + this.af.auth.currentUser.uid + '/favourite/' + key).update({
                thumb: this.menuItems.thumb,
                title: this.menuItems.title,
                description: this.menuItems.description

            }).then(res => {
                this.createToaster('added to favourites', '3000');
            });
        }
        else {
            this.createToaster('please login ', '3000');
        }
    }

    removeFevrt(key) {
        console.log('uid---' + key);
        if (this.af.auth.currentUser) {
            console.log('uid' + this.af.auth.currentUser.uid);
            this.db.object('/users/' + this.af.auth.currentUser.uid + '/favourite/' + key).remove();
            this.createToaster('removed from favourites', '3000');
        }


    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }


}
