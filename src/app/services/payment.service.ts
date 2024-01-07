import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, observable } from 'rxjs';

import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { environment } from 'src/environments/environment';
import { LoginService } from '../core/services/login.service';
import { NetworkRequestService } from './network-request.service';


declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private login: LoginService
  ) {
  }

  env = environment;


  order: any;
  payment = {
    assessmentPurchased: false,
    item: null,
  };

  paymentSuccess: Subject<boolean> = new Subject<boolean>();


  /**
   * Save Orders to server and then call make payment
   * Redirect to My Assessment after payment success
   */
  intializePayment(amount = 0, coupon = '') {

    this.saveOrder().subscribe(
      data => {
        this.payment.item = data['order'];

        // If Not Free Assessment
        if (data['order']['total'] !== '0.00') {
          this.makePayment(data['order'], amount, coupon);
        } else {

          // Free Assessment
          this.payment.assessmentPurchased = true;
          this.nextSteps();
        }
      }
    );

    this.paymentSuccess.subscribe(
      data => {
        this.payment.assessmentPurchased = true;
        this.nextSteps();
      }
    );
  }


  saveOrder() {

    /**
     * Save All the order to server
     */
    this.misc.showLoader('short');
    return new Observable(observer => {
      this.networkRequest.postWithHeader('', '/api/orders/').subscribe(
        data => {
          observer.next({ order: data });
          this.misc.hideLoader();
        },
        error => {
          this.misc.hideLoader();
        }
      );
    });
  }


  makePayment(order, amount, coupon = '') {
    /** Intialize Razor Pay payment */
    const options = {
      'key': this.env.PAYMENT_KEY,
      'amount': (amount * 100), // 2000 paise = INR 20
      'name': 'APTINATION',
      //   "description": `${order.title ? order.title + ' - ' : ''} ${order.assessment}`,
      'handler': this.postPaymentProcess.bind(this),
      'prefill': {
        'name': 'Assessment',
        'email': `${order.customer ? order.customer.email : ''}`
      },
      'notes': {
        'address': 'Hello World',
        'order_id': order['id'],
        'couponcode': coupon,
      },
      'theme': {
        'color': '#49a1d1'
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }


  postPaymentProcess(response) {

    /**
     * Send Razor pay payment id
     */

    if (response.razorpay_payment_id) {
      this.misc.showLoader('short');
      this.networkRequest.postWithHeader(JSON.stringify({ 'payment_id': response.razorpay_payment_id }), '/api/order_payment/').subscribe(
        data => {
          if (data['status'] = true) {
            this.paymentSuccess.next(true);
          }
        },
        error => {
          this.misc.hideLoader();
        }
      );
    }
  }

  nextSteps() {
    this.login.extraSteps().subscribe({
      complete: () => {
        this.ngZone.run(() => this.router.navigateByUrl('/assessment/dashboard/my-assessment').then(() => {
          this.misc.hideLoader();
        }));
      }
    });
  }
}
