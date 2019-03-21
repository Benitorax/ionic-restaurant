import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'
import {EmailComposer} from '@ionic-native/email-composer';

@IonicPage()
@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
    providers: [EmailComposer]
})
export class ContactPage {
    user: any = {};

    constructor(public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams,
                public emailComposer: EmailComposer) {

    }


    onSend(user: NgForm) {
        console.log("user " + JSON.stringify(this.user));
        if (this.af.auth.currentUser) {
            this.user.userId = this.af.auth.currentUser.uid;
            this.db.list('/contact').push(this.user).then((res) => {
                this.user = {};
            });
        }
        let email = {
            to: 'san10694@gmail.com',
            subject: this.user.name,
            body: this.user.message,
            isHtml: true
        };
        this.emailComposer.open(email, function () {
            console.log('email view dismissed');
        });
        this.user = '';


    }

}
