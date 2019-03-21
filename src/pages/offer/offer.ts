import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, Slides} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'


@IonicPage()
@Component({
    selector: 'page-offer',
    templateUrl: 'offer.html'
})
export class OfferPage {
    @ViewChild(Slides) slides: Slides;
    offerData: Array<any>;

    constructor(public af: AngularFireDatabase, public navCtrl: NavController) {
        const queryObservable = af.list('/menuItems', {
            query: {
                orderByChild: 'offer',
                equalTo: true
            }
        });
        queryObservable.subscribe(queriedItems => {
            this.offerData = queriedItems;
        });
    }

    gotoNextSlide() {
        this.slides.slideNext();
    }

    gotoPrevSlide() {
        this.slides.slidePrev();
    }

    addToCart(key) {
        this.navCtrl.push("ProductDetailsPage", {id: key});
    }

}
