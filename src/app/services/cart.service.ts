import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { Subject, Observable } from 'rxjs';

import { MiscellaneousService } from './miscellaneous.service';
import { PermissionsService } from '../core/services/permissions.service';
import { NetworkRequestService } from './network-request.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private permissions: PermissionsService,
    private cookie: CookieService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
  ) { }

  Cart: any;
  LocalCart: any;

  CartChange: Subject<Array<Object>> = new Subject<Array<Object>>();

  /**
    *  Add Assessment to Cart for purchase
    *  1. If Authenticated items will be added directly to server
    *  2. If Not Authenticated Items will be added to Local cart
    */
  addToCart(pkg) {

    return new Promise((resolve, reject) => {

      if (this.permissions.isauthenticated()) {

        const cartId = this.cookie.get('cid');

        this.misc.showLoader('short');
        this.networkRequest.postWithHeader(JSON.stringify({ package_id: pkg.id, }),
          `/api/carts/${cartId}/add_to_cart/`)
          .subscribe(
            data => {
              this.misc.hideLoader();
              this.generateCartItems(data['items']);
              resolve(this.Cart);
            },
            error => {
              this.misc.hideLoader();
              reject({ message: 'Add to cart failed' });
            }
          );
      } else {

        // Make Price 0 if assessment is free then save to local
        this.saveToLocalCart(pkg).then(() => {
          resolve();
        });
      }
    });
  }


  removeFromCart(packageId) {

    /***
     *  Remove Assessment from Cart
     *  1. If Authenticated items will be removed from server cart
     *  2. If Not Authenticated Items will removed from local cart
     */

    if (this.permissions.isauthenticated()) {

      const cartId = this.cookie.get('cid');

      this.misc.showLoader('short');

      this.networkRequest.postWithHeader(JSON.stringify({ package_id: packageId }),
        `/api/carts/${cartId}/remove_from_cart/`)
        .subscribe(

          data => {

            this.misc.hideLoader();
            this.generateCartItems(data['items']);

          },
          error => {

            this.misc.hideLoader();

            if (error['error']['detail'] === 'Not found.') {
              location.reload();
            }
          }
        );

    } else {

      this.removeFromLocalCart(packageId);

    }
  }


  getCart() {

    /***
     * Updates Cart on page Load
     * 1. If user is authenticated then update cart by syncing local and server cart
     * 2. If not authenticated then update cart with local cart
     */
    return new Observable(
      observer => {
        if (this.permissions.isauthenticated()) {
          this.syncCart().subscribe(
            data => {
              observer.next(true);
            }
          );
        } else if (!this.permissions.isauthenticated()) {
          this.updateCart(this.getLocalCart());
          observer.next(true);
        }
      }
    );
  }


  syncCart() {

    /***
     * Syncs Local and server cart
     * 1. Generate updated cart items from the server response
     */

    return new Observable(
      observer => {
        const packageDetails = [];
        const cartId = this.cookie.get('cid');

        try {
          this.getLocalCart().forEach(item => {
            packageDetails.push(item.id);
          });
        } finally {

          this.misc.showLoader('short');

          this.networkRequest.postWithHeader(JSON.stringify({ 'packages': packageDetails }),
            `/api/carts/${cartId}/sync_cart/`)
            .subscribe(
              data => {

                this.misc.hideLoader();

                localStorage.removeItem('_ct');
                this.generateCartItems(data['items']);
                observer.next('synced');
              },
              error => {
                this.misc.hideLoader();
              }
            );
        }
      }
    );
  }


  generateCartItems(items) {
    /***
     * 1. Generate updated cart items from the server response in proper format
     */

    const pkgList = [];
    items.forEach(pkg => {
      pkg = JSON.parse(pkg);
      pkgList.push({
        id: pkg.id,
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        free: pkg.free === 'True' ? true : false
      });
    });

    this.updateCart(pkgList);
  }


  updateCart(items) {

    /***
     * Update User Cart using Rxjs Subjects
     */
    this.Cart = items;
    this.CartChange.next(this.Cart);
  }


  removeFromLocalCart(itemId) {

    /**
     * Remove item from local cart
     */

    let localAssessment: any = this.getLocalCart()

    const itemIndex = localAssessment.findIndex((item) => item.id === itemId)
    localAssessment.splice(itemIndex, 1)

    localStorage.setItem('_ct', JSON.stringify(localAssessment))
    this.updateCart(localAssessment)
  }


  saveToLocalCart(item: any): Promise<any> {

    return new Promise((resolve, reject) => {
      delete item['mockpaper'];
      delete item['assessmentpaper'];
      delete item['substd'];
      /**
       * Save item to local cart
       */

      this.LocalCart = this.getLocalCart();

      const isAlreadyAdded = this.LocalCart.find((cartItem) => {
        return cartItem['id'] === item.id;
      });

      if (!isAlreadyAdded) {
        this.LocalCart.push(item);
      }
      try {
        localStorage.removeItem('_ct');
        localStorage.setItem('_ct', JSON.stringify(this.LocalCart));
        resolve(this.LocalCart);
      } catch {
        reject({ message: 'Add to cart failed' });
      }

    });
  }


  getLocalCart() {

    /** 
     * Returns local cart
     */

    if (localStorage.getItem('_ct')) {
      return JSON.parse(localStorage.getItem('_ct'))
    }
    return []
  }
}

