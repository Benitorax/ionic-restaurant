import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';


@IonicPage()
@Component({
    selector: 'page-product-list',
    templateUrl: 'product-list.html'
})
export class ProductListPage {
    id: any;
    public menuItems: Array<any> = [];
    public selectedItems: Array<any> = [];
    menuItem: FirebaseListObservable<any>;
    Cart: any = [];
    noOfItems: any;
    items: any = [];


    constructor(public navCtrl: NavController,
                public af: AngularFireDatabase,
                public navParams: NavParams,
                public loadingCtrl: LoadingController) {

        this.Cart = JSON.parse(localStorage.getItem('Cart'));
        if (localStorage.getItem('Cart') != null) {
            this.noOfItems = this.Cart.length;
        }
        let loader = this.loadingCtrl.create({
            content: "Please wait...",
        });
        loader.present().then(() => {

            this.id = this.navParams.get('id');
            if (this.id == undefined) {
                this.navCtrl.push("HomePage")
            }
            this.menuItem = af.list('/menuItems')

            this.menuItem.subscribe((data) => {
                this.menuItems = data;
                loader.dismiss();
                for (var i = 0; i <= this.menuItems.length - 1; i++) {
                    if (this.menuItems[i].category == this.id) {
                        this.selectedItems.push(this.menuItems[i]);
                        this.items = this.selectedItems;
                        for (var j = 0; j < this.items.length; j++) {
                            var sum = 0;
                            if (this.items[j].reviews) {
                                for (var k = 0; k < this.items[j].reviews.length; k++) {
                                    sum = sum + this.items[j].reviews[k].rating;
                                }
                                let avg = sum / this.items[j].reviews.length;
                                this.items[j].reviewData = avg;
                            }
                        }
                    }
                }
            })
        })
    }

    initializeItems() {
        this.items = this.selectedItems;
    }


    getItems(ev: any) {
        this.initializeItems();
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.items = this.items.filter((data) => {
                return (data.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }


    navigate(item) {
        // console.log("id---"+item)
        this.navCtrl.push("ProductDetailsPage", {id: item});
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

}
