import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController, LoadingController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';
import {TranslateService} from 'ng2-translate';
import firebase from 'firebase';


@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class Settings {
    user: any = {}
    url: any = 'assets/img/profile.jpg';
    value: any;
    options = [
        {
            "language": "ENGLISH",
            "value": "en"
        },
        {
            "language": "FRENCH",
            "value": "fr"
        }
    ];
    public file: any = {};
    public storageRef = firebase.storage();

    constructor(public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public navCtrl: NavController,
                public translate: TranslateService) {

        this.value = "en"
        this.translate.setDefaultLang('en');
        if (this.af.auth.currentUser) {
            this.db.object('/users/' + this.af.auth.currentUser.uid).subscribe(res => {
                this.user = res;
                this.user.image = res.image;

                if (this.user.image != null) {
                    this.url = res.image;
                } else {
                    this.url = "assets/img/profile.jpg";
                }
            })
        }
    }

    readUrl(event) {
        this.file = (<HTMLInputElement>document.getElementById('file')).files[0];
        let metadata = {
            contentType: 'image/*'
        };
        let that = this;
        let loader = this.loadingCtrl.create({
            content: 'please wait..'
        })
        loader.present();
        this.storageRef.ref().child('profile/' + this.file.name).put(this.file, metadata)
            .then(res => {
                this.storageRef.ref().child('profile/' + this.file.name).getDownloadURL()
                    .then(function (url) {
                        that.user.image = url;
                        that.url = url;
                        loader.dismiss();
                        console.log("storage file url-" + that.url);
                    }).catch(error => {
                    console.log("FireBase Error" + JSON.stringify(error));
                    loader.dismiss();
                });
            });

    }

    changeLanguage() {
        console.log("language is -" + this.value);
        if (this.value == 'fr') {
            this.translate.use('fr');
        }
        else {
            this.translate.use('en');
        }
    }

    onSubmit(user: NgForm) {

        if (this.af.auth.currentUser) {
            this.db.object('/users/' + this.af.auth.currentUser.uid).update({
                name: this.user.name,
                image: this.user.image,
                email: this.user.email,
                mobileNo: this.user.mobileNo
            }).then(() => {
                this.createToaster("user information updated successfully", 3000);
            })
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

