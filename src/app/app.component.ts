import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {OneSignal} from '@ionic-native/onesignal';
import {SocialSharing} from '@ionic-native/social-sharing';

@Component({
  templateUrl: 'app.html',
  selector: 'MyApp',
  providers: [StatusBar, SplashScreen, OneSignal, SocialSharing]
})
export class MyApp {
  Cart: any = [];
  noOfItemsInCart: any;
  noOfItemsInFevrt: any;
  noOfItemsInNews: any;
  noOfItemsInOffer: any;
  userID: any;
  name: any;
  imageUrl:any='assets/img/profile.jpg';

  @ViewChild(Nav) nav: Nav;

  rootPage: string = "HomePage";


  constructor(
              public af: AngularFireAuth,
              public db: AngularFireDatabase,
              public platform: Platform,
              public statusbar: StatusBar,
              public splashscreen: SplashScreen,
              public socialSharing: SocialSharing,
              private oneSignal: OneSignal) {
    
            this.initializeApp();
            //offer
            db.list('/menuItems', {
              query: {
                orderByChild: 'offer',
                equalTo: true
              }
            }).subscribe(queriedItems => {
              this.noOfItemsInOffer = queriedItems.length;
            });
            //news
            db.list('/news').subscribe((res) => {
              this.noOfItemsInNews = res.length;
            })
  }

  ngOnInit(){
      this.userID = localStorage.getItem('uid');
       if (this.userID!=null) {
      this.db.object('/users/' + this.userID).subscribe(res => {
         console.log("user-"+JSON.stringify(res));
        this.name = res.name;
        if(res.image) {
        this.imageUrl=res.image;
      } else {
        this.imageUrl='assets/img/profile.jpg';
      }
       
      });
      this.db.list('/users/' + this.userID + '/favourite').subscribe(res => {
        this.noOfItemsInFevrt = res.length;
      })
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  initializeApp() {
    if (this.platform.ready()) {
      this.platform.ready().then((res) => {
        if (res == 'cordova') {
          this.oneSignal.startInit('ace5d8a2-5018-4523-ab21-cff285d32524', '1058635440960');
          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
          this.oneSignal.handleNotificationReceived().subscribe(() => {
          });
          this.oneSignal.handleNotificationOpened().subscribe(() => {
          });
          this.oneSignal.endInit();
        }
      });
    }
  }

  home() {
    this.nav.setRoot("HomePage");
  }

  yourOrders() {
    this.nav.push("OrdersPage");
  }

  addToCart() {
    this.nav.push("CartPage");
  }

  catagory() {
    this.nav.push("CategoryPage");
  }

  favourite() {
    this.nav.push("FavouritePage");
  }

  offer() {
    this.nav.push("OfferPage");
  }

  news() {
    this.nav.push("NewsPage");
  }

  contact() {
    this.nav.push("ContactPage");
  }

  aboutUs() {
    this.nav.push("AboutUsPage");
  }

  settings() {
    this.nav.push("Settings");
  }

  invite() {
    this.socialSharing.share("share Restaurant App with friends to get credits", null, null, 'https://ionicfirebaseapp.com/#/');
  }

  chat(){
    this.nav.push("ChatPage");
  }

  login() {
    this.nav.setRoot("LoginPage");
  }

  logout() {
    this.af.auth.signOut();
    localStorage.removeItem('uid');
    this.imageUrl='assets/img/profile.jpg';
    this.nav.setRoot("LoginPage");
  }

  isLoggedin() {
    return localStorage.getItem('uid') != null;
  }

  isCart(){
     this.Cart = JSON.parse(localStorage.getItem('Cart'));
     if (this.Cart != null) {
      this.noOfItemsInCart = this.Cart.length;
    } else {
      this.noOfItemsInCart=null;
    }
    return true;
    
  }

  isImage() {
     this.userID = localStorage.getItem('uid');
       if (this.userID!=null) {
      this.db.object('/users/' + this.userID).subscribe(res => {
        this.name = res.name;
        if(res.image) {
        this.imageUrl=res.image;
      } else {
        this.imageUrl='assets/img/profile.jpg';
      } 
    })
 }
 return true;

}


}
