import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Content} from 'ionic-angular/index';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';


@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {
    @ViewChild(Content) content: Content;
    userId: any;
    messageList: Array<any>;
    messageObserable: FirebaseListObservable<any>;
    chatMessage = {
        message: '',
        sendBy: 'User',
        createdAt: Date.now()
    }
    userDisplayPic: string = 'assets/img/profile.jpg';
    sevenDaysBack: any;
    imageUrl: string;

    constructor(public af: AngularFireAuth,
                public db: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams) {
    }


    ionViewDidLoad() {
        let date = new Date();
        let midnight = date.setUTCHours(0, 0, 0, 0);
        this.sevenDaysBack = midnight - 7 * 24 * 60 * 60 * 1000;

        if (this.af.auth.currentUser) {
            this.userId = this.af.auth.currentUser.uid;
            this.db.object('/users/' + this.userId).subscribe(res => {
                console.log("user-" + JSON.stringify(res));
                if (res.image) {
                    this.userDisplayPic = res.image;
                    this.imageUrl = res.image;
                } else {
                    this.userDisplayPic = 'assets/img/profile.jpg';
                }
            });
            this.messageObserable = this.db.list('/messages/' + this.userId);
            this.messageObserable.subscribe(res => {
                this.scrollToBottom();
                if (res.length == 0) {
                    this.db.object('/users/' + this.userId).subscribe(result => {
                        this.db.object('/messages/' + this.userId).update({
                            name: result.name,
                            email: result.email,
                            imageUrl: this.imageUrl
                        })
                    })
                }
                this.messageList = []
                this.messageList = res;
                console.log("list-" + JSON.stringify(res));

            })
        }
        else {
            this.navCtrl.push("HomePage");
        }
    }

    sendMessage(form: NgForm) {
        this.messageObserable.push(this.chatMessage).then(res => {
            this.chatMessage = {
                message: '',
                sendBy: 'User',
                createdAt: Date.now()
            }
            //this.scrollToBottom();
        })
    }

    scrollToBottom() {
        setTimeout(() => {
            this.content.scrollToBottom();
        })
    }

}
