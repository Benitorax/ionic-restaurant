import {Injectable} from '@angular/core';
import 'rxjs/Rx';
@Injectable()
export class CartService {
    Cart: any[] = [];
    itemCart: any = {};
    itemInCart = [];

    constructor() {
        this.Cart = JSON.parse(localStorage.getItem('Cart'));
    }

    OnsaveLS(item: any) {
        this.Cart = JSON.parse(localStorage.getItem('Cart'));
        let ExtotalPrice : number = 0;
        let totalPrice :number = 0;
        this.itemInCart = [];
        if (this.Cart == null) {
            for (let i = 0; i <= item.extraOptions.length - 1; i++) {
                ExtotalPrice = ExtotalPrice + item.extraOptions[i].value;
            }
            if(item.price.specialPrice){
                totalPrice = ExtotalPrice + item.price.specialPrice;
            }else{
                totalPrice = ExtotalPrice + item.price.value;
            }
            this.itemCart.itemTotalPrice = totalPrice * item.itemQunatity;
            this.itemCart.item = item;
            this.itemInCart.push(this.itemCart);
            localStorage.setItem('Cart', JSON.stringify(this.itemInCart));
        }
        else {
            for (let i = 0; i <= this.Cart.length - 1; i++) {
                if (this.Cart[i].item.itemId == item.itemId) {
                    this.Cart.splice(i, 1);
                }
            }
            for (let k = 0; k <= item.extraOptions.length - 1; k++) {
                ExtotalPrice = ExtotalPrice + item.extraOptions[k].value;
            }
             if(item.price.specialPrice){
                totalPrice = ExtotalPrice + item.price.specialPrice;
            }else{
                totalPrice = ExtotalPrice + item.price.value;
            }
            this.itemCart.itemTotalPrice = totalPrice * item.itemQunatity;
            this.itemCart.item = item;
            this.Cart.push(this.itemCart);
            localStorage.setItem('Cart', JSON.stringify(this.Cart));
        }
    }
}