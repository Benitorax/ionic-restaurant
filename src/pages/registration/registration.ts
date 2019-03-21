import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, LoadingController, Platform, AlertController} from 'ionic-angular';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database'
import {Facebook} from '@ionic-native/facebook';
import * as firebase from 'firebase';
import {GooglePlus} from '@ionic-native/google-plus';
import {TwitterConnect} from '@ionic-native/twitter-connect';

@IonicPage()
@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html',
    providers: [Facebook, GooglePlus, TwitterConnect]
})
export class RegistrationPage implements OnInit {

    registration: FormGroup;
    userDetails: FirebaseObjectObservable<any>;

    constructor(public navCtrl: NavController,
                public fb: FormBuilder,
                public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public facebook: Facebook,
                public googlePlus: GooglePlus,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public twitter: TwitterConnect,
                public platform: Platform) {

    }

    onSubmit() {
        this.af.auth.createUserWithEmailAndPassword(this.registration.value.email, this.registration.value.password)
            .then((success) => {
                this.db.object('/users/' + success.uid).update({
                    name: this.registration.value.name,
                    email: this.registration.value.email,
                    mobileNo: this.registration.value.mobileNo,
                    role: 'User'
                });

                localStorage.setItem('uid', success.uid);
                this.navCtrl.setRoot("HomePage");
            })
            .catch((error) => {
                console.log("Firebase failure: " + JSON.stringify(error));
                this.showAlert(error.message);
            });
    }

    showAlert(message) {
        let alert = this.alertCtrl.create({
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    navLogin() {
        this.navCtrl.setRoot("LoginPage");
    }

    ngOnInit(): any {
        this.buildForm();
    }

//Validation
    buildForm(): void {
        this.registration = new FormGroup({
            'name': new FormControl('', Validators.required),
            'mobileNo': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$")]),
            'password': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(24)])
        });
    }

    doFbLogin() {
        let permissions = new Array();
        permissions = ["public_profile", "email", "user_education_history"];

        this.facebook.login(permissions)
            .then((success) => {
                console.log("facebook Success response->" + JSON.stringify(success));
                this.facebook.api("/me?fields=id,name,email,gender,first_name,last_name", permissions).then((user) => {
                    var provider = firebase.auth.FacebookAuthProvider.credential(success.authResponse.accessToken);
                    firebase.auth().signInWithCredential(provider)
                        .then((response) => {
                            console.log("Firebase -fb success: " + JSON.stringify(response));
                            this.db.object('/users/' + response.uid).update({
                                name: response.displayName,
                                email: response.email,
                                role: 'User'
                            });
                            localStorage.setItem('uid', response.uid);
                            this.navCtrl.setRoot("HomePage");
                        })
                        .catch((error) => {
                            console.log("Error" + JSON.stringify(error));
                        });

                }),
                    (error) => {
                        console.log(JSON.stringify(error));

                    }

            }, error => {
                console.log("FaceBook ERROR : ", JSON.stringify(error));
            })
    }

    googleLogin() {
        this.googlePlus.login({
            'scopes': '',
            'webClientId': '164935859218-0jlgn5jj6l5nml4lrchpmi7pquvihn09.apps.googleusercontent.com',
            'offline': true
        })
            .then((success) => {
                    console.log("you have been successfully logged in by googlePlus!" + JSON.stringify(success));
                    let loading = this.loadingCtrl.create({
                        content: 'Login Please Wait...'
                    });
                    loading.present();
                    var provider = firebase.auth.GoogleAuthProvider.credential(success.idToken);

                    firebase.auth().signInWithCredential(provider)
                        .then((response) => {
                            this.db.object('/users/' + response.uid).update({
                                name: response.displayName,
                                email: response.email,
                                role: 'User'
                            });
                            localStorage.setItem('uid', response.uid);
                            loading.dismiss();
                            this.navCtrl.setRoot("HomePage");
                        })
                        .catch((error) => {
                            console.log("Error" + JSON.stringify(error));
                        });
                },
                (error) => {
                    console.log('Error' + JSON.stringify(error));

                })
    }

    twitterLogin() {
        this.platform.ready().then((res) => {
                if (res == 'cordova') {
                    this.twitter.login().then((result) => {
                        this.twitter.showUser().then((user) => {
                                let loading = this.loadingCtrl.create({
                                    content: 'Login Please Wait...'
                                });
                                loading.present();

                                var provider = firebase.auth.TwitterAuthProvider.credential(result.token, result.secret);

                                firebase.auth().signInWithCredential(provider)
                                    .then((response) => {
                                        this.db.object('/users/' + response.uid).update({
                                            name: response.displayName,
                                            email: response.email,
                                            role: 'User'
                                        });
                                        localStorage.setItem('uid', response.uid);
                                        loading.dismiss();
                                        this.navCtrl.setRoot("HomePage");
                                    })
                                    .catch((error) => {
                                        console.log("Error " + JSON.stringify(error));
                                    });
                            },
                            (onError) => {
                                console.log("User" + JSON.stringify(onError));
                            }
                        )
                    })
                }
            }
        )
    }


}
