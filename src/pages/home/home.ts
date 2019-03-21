import {Component} from '@angular/core';
import {IonicPage, NavController, LoadingController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'


@IonicPage()

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 2000,
        pager: false
    };
    Cart: any = [];
    noOfItems: any;

    public ComingData: Array<any> = [];
    public Categories: Array<any> = [];
    comingData: FirebaseListObservable<any>;
    categories: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController,
                public af: AngularFireDatabase, public loadingCtrl: LoadingController) {
        this.Cart = JSON.parse(localStorage.getItem('Cart'));
        let loader = this.loadingCtrl.create({
            content: "Please wait...",
        });
        loader.present().then(() => {
            if (localStorage.getItem('Cart') != null) {
                this.noOfItems = this.Cart.length;
            }
            this.comingData = af.list('/coming');
            this.categories = af.list('/categories');
            this.comingData.subscribe((data) => {
                this.ComingData = data;
            });
            this.categories.subscribe((data) => {
                loader.dismiss();
                this.Categories = data;
            })
        })

    }

    navigate(id) {
        this.navCtrl.push("ProductListPage", {id: id});
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

}
