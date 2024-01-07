import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstantsService } from 'src/app/core/services/constants.service';
import { LoginService } from 'src/app/core/services/login.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';

@Component({
  selector: 'app-temp-login',
  templateUrl: './temp-login.component.html',
  styleUrls: ['./temp-login.component.scss']
})
export class TempLoginComponent implements OnInit {

  constructor(
    private authservice: AuthService,
    private loginservice: LoginService,
    private consts: ConstantsService,
    private toastr: ToastrService,
    private permissionsvc: PermissionsService,
    private router: Router,
    private misc: MiscellaneousService
  ) { }

  username: string;
  password: string;
  togglePassword: boolean = false;
  successMsg;
  loaderActive: boolean = false;
  errors = null;
  isAuthenticated = this.permissionsvc.isauthenticated();

  login() {
    this.loaderActive = true;
    const username = this.username;
    const password = this.password;

    if (username && password) {
      const user = {
        user: {
          email: username,
          password: password
        }
      };

      this.authservice.login(JSON.stringify(user), '/api/users/login/')
        .subscribe(
          user => {
            console.log("user", user);
            if (user['user']) {
              this.loaderActive = false;
              console.log("success login");
              this.toastr.success('Logged in successfully!', 'Loading..!', {
                timeOut: 4000,
              });
              this.loginservice.processLogin(user).subscribe(() => {
                this.misc.showLoader();
              });
            } else {
              this.errors = ['Account Does Not Exist'];
              this.toastr.error(this.errors, 'Error!', {
                timeOut: 5000,
              });
            }
          },
          error => {
            // console.log("errorsection", error);
            this.loaderActive = false;
            this.successMsg = '';
            this.errors = error['message'];
            this.toastr.error(this.errors, 'Error!', {
              timeOut: 5000,
            });
          });
    }
  }

  ngOnInit(): void {
    this.username = null;
    this.password = null;
    if (this.isAuthenticated) {
      this.router.navigate(['/']);
    } 
  }

}
