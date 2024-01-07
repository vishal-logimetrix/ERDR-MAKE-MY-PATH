import {Component, OnInit, AfterViewInit, ViewChild, TemplateRef, OnDestroy} from '@angular/core';

import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {BootstrapService} from '../../../../services/bootstrap.service';
import {environment} from '../../../../../environments/environment';
import {NetworkRequestService} from '../../../../services/network-request.service';
import {PermissionsService} from '../../../../core/services/permissions.service';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';
import {LoginService} from '../../../../core/services/login.service';
import {MiscellaneousService} from '../../../../services/miscellaneous.service';
import {Subscription} from 'rxjs';
import {CartService} from '../../../../services/cart.service';
import {UtilsService} from '../../../../core/services/utils.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private router: Router,
    private auth: AuthService,
    private permissions: PermissionsService,
    private modalService: BsModalService,
    private bt: BootstrapService,
    private login: LoginService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private  utils: UtilsService,
    private cart: CartService
  ) {
    this.cartSubscription = this.cart.CartChange.subscribe(
      cartItems => {
        this.cartItemCount = cartItems.length;
      }
    );
  }

  env = environment;

  @ViewChild('loginModal', {static: true}) loginModalRef: TemplateRef<any>;
  @ViewChild('registerModal', {static: true}) registerModalRef: TemplateRef<any>;
  @ViewChild('otpModal', {static: true}) otpModalRef: TemplateRef<any>;
  @ViewChild('forgotPasswordModal', {static: true}) forgotPasswordModalRef: TemplateRef<any>;
  @ViewChild('changePasswordModal', {static: false}) changePasswordModalRef: TemplateRef<any>;

  modalRef: BsModalRef;
  modalData: any;
  isCollapsed = true;

  isAuthenticated = this.permissions.isauthenticated();
  isAdmin = this.permissions.isStaff();
  isStudent = this.permissions.isStudent();
  isInstituteStaff = this.permissions.isInstituteStaff();
  isOrganizationStaff = this.permissions.isOrganizationStaff();

  isMobile = false;

  resourceObj: any;
  cartItemCount: any;

  viewName: any;
  cartSubscription: Subscription;


  openLogin() {
    this.bt.openModal('login');
  }


  logout() {
    this.auth.logout();
  }


  viewMyAssessment() {
    if (this.permissions.isauthenticated()) {
      this.router.navigateByUrl('/assessment/dashboard/my-assessment');
    } else {
      this.login.setLoginRedirect('/assessment/dashboard/my-assessment');
      this.openLogin();
    }
  }

  scrollTo(viewName) {
    this.misc.scrollToView.next(viewName);
  }


  ngAfterViewInit() {

    // Handle Bootstrap Modals
    this.bt.modalState.subscribe(state => {
      try {
        this.modalRef.hide();
      } catch (e) {
      }
      if (state['state']) {
        if (state['modal'] === 'login') {
          this.modalRef = this.modalService.show(this.loginModalRef, this.bt.config);
        } else if (state['modal'] === 'register') {
          this.modalRef = this.modalService.show(this.registerModalRef, this.bt.config);
        } else if (state['modal'] === 'otp') {
          this.modalRef = this.modalService.show(this.otpModalRef, this.bt.config);
        } else if (state['modal'] === 'forgotPassword') {
          this.modalRef = this.modalService.show(this.forgotPasswordModalRef, this.bt.config);
        } else if (state['modal'] === 'changePassword') {
          this.modalRef = this.modalService.show(this.changePasswordModalRef, this.bt.config);
        }
      }

      this.modalData = state['data'];
    });
  }


  ngOnInit() {

    // Get View name to show or hide
    this.misc.showMenuSubject.subscribe(data => {
      this.viewName = data;
    });

    // Disable Some menues on route change
    this.router.events.subscribe(() => {
      this.viewName = '';
    });


    this.isMobile = this.utils.isMobile();

    this.isAuthenticated = this.permissions.isauthenticated();
    this.isAdmin = this.permissions.isStaff();
    this.isStudent = this.permissions.isStudent();
    this.isInstituteStaff = this.permissions.isInstituteStaff();
    this.isOrganizationStaff = this.permissions.isOrganizationStaff();

  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

}
