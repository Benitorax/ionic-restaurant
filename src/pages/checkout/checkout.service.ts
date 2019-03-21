import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";
import {URLSearchParams} from '@angular/http';


@Injectable()
export class CheckoutService {

    constructor(private http: Http) {
    }

    chargeStripe(token, currency, amount, stripe_secret_key) {
        let secret_key = stripe_secret_key;
        var headers = new Headers();
        var params = new URLSearchParams();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Bearer ' + secret_key);
        params.append("currency", currency);
        params.append("amount", amount);
        params.append("description", "description");
        params.append("source", token);
        console.log("params-"+JSON.stringify(params));
        
        return new Promise(resolve => {
            this.http.post('https://api.stripe.com/v1/charges', params, {
                headers: headers
            }).map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

}