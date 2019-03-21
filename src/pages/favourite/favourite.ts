import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'


@IonicPage()
@Component({
    selector: 'page-favourite',
    templateUrl: 'favourite.html'
})
export class FavouritePage {
    favouriteItems: any[] = [];


    constructor(public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public navCtrl: NavController,
                public toastCtrl: ToastController) {

        if (this.af.auth.currentUser) {
            this.db.list('/users/' + this.af.auth.currentUser.uid + '/favourite/').subscribe(res => {
                this.favouriteItems = res;
            })
        }

    }

    isFavourite(): boolean {
        if (this.favouriteItems.length == 0) {
            return false;
        }
        else {
            return true;
        }
    }

    buyNow(key) {
        this.navCtrl.push("ProductDetailsPage", {id: key});
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

    removeFromFavourites(key) {
        if (this.af.auth.currentUser) {
            //console.log('uid' + res.auth.uid);
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
