import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private utils: UtilsService,
    private misc: MiscellaneousService,
    private networkRequest: NetworkRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private permissions: PermissionsService,
    private courseswitchservice: CourseSwitchService,
    private http: HttpClient
  ) {
  }

  env = environment;
  userProfile;
  showsidebar = false;
  isMobile = false;

  cartItemCount = 0;

  notificationCount = {};
  notificationList: object;
  max_page: number;
  pages = [];
  currentPage = 0;
  searchTerm;
  searchIcon;
  islocation: boolean = false;
  tag;
  TagData;
  clickedItem;
  errors = null;
  myControl = new FormControl();
  options: string[] = [];
  viewDetailbutton = false;
  filteredOptions: Observable<string[]>;
  isAuthenticated = this.permissions.isauthenticated();
  @ViewChild('closeModals') closeModals: ElementRef;

  selectedItem(item){
    this.clickedItem=item.item;
    // console.log("clickedItem", this.clickedItem, this.options);
    for (let i = 0; i < this.TagData.length; i++) {
      if (this.TagData[i]['title'] == this.clickedItem) {
        this.router.navigate([`/assessment/dashboard/choose-p/${this.TagData[i]['id']}`]);
        this.closeModals.nativeElement.click();
      }
    }
  }
  

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  BASE_URL = environment.BASE_URL;

  examLookup(text) {
    this.options = [];
    this.TagData = null;
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(`${this.BASE_URL}/api/searchexamnav/?text=${text}`, httpOptions)
    .pipe(map(res => {
      this.TagData = res;
      console.log("response", res);
      // @ts-ignore
      res.map((item) => {
        this.options.push(item['title']);
      });
      return this.options;
    }));
  }
  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap( (searchText) =>  this.examLookup(searchText) ),
    
    // catchError(new ErrorInfo().parseObservableResponseError) 
    // map(text => text.length < 1 ? []
    //   : this.options.length>0 ? this.options.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 10) : ['No Exam Found'])
  )
  detectTag(obj: any) {
    this.searchIcon = false;
    let array1 = [];
    // const objdata = {
    //   text: obj.target.value,
    // }
  
    let text = obj.target.value
  
    this.networkRequest.getWithHeaders(`/api/searchexamnav/?text=${text}`).subscribe(
      data => {
        console.log("exams ", data);
        this.searchIcon = false;
        // @ts-ignore
        data.map((item) => {
          array1.push(item['title']);
          this.options.push(item['title']);
        });
        // this.search;
        setTimeout(() => {
          // this.options = array1;
          this.search;
        }, 200);
        // if (this.options.length == 0) {
        //   this.options = ['No Exam Found'];
        // }
        console.log("options", this.options);
        // @ts-ignore
        this.TagData = data;
      },
      error => {
        //"Error section")
        this.errors = error['message'];
        //"error msg", this.errors);
        this.viewDetailbutton = false;
        this.searchIcon = true;
      }
    )
    if (this.options.length == 0 || obj.target.value.length < 2){
      document.getElementById("typeahead-basic").classList.remove("input-field-radius");
      this.viewDetailbutton = false;
      this.searchIcon = true;
    }
    else {
      document.getElementById("typeahead-basic").classList.add("input-field-radius");
      this.viewDetailbutton = true;
      this.searchIcon = false;
    }
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  searchExam() {
    var url = this.router.url.split("?", 1);
    this.router.navigate([url[0]],{
      queryParams: {
        s: this.searchTerm
      }
    });
  }
  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }
  getNotificationsCount() {
    this.networkRequest.getWithHeaders('/api/notifications_count/').subscribe(data => {
      this.notificationCount['count'] = data['notification_count'];
    });
  }

  getNotificationsList(statustype: any, page: any) {
    this.networkRequest.getWithHeaders(`/api/notifications_list/${statustype}/?page=${page}`).subscribe(
      (data:object) => {
        this.notificationList = data;
        if (data['count'] % data['page_size'] === 0) {
          this.max_page = Math.floor(data['count'] / data['page_size']);
        } else {
          this.max_page = Math.floor(data['count'] / data['page_size']) + 1;
        }
        this.pages = ' '.repeat(this.max_page).split('');
    });
  }

  toggleSidebar() {
    this.showsidebar = !this.showsidebar;
    this.misc.showMobileSidebar.next(this.showsidebar);
  }


  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.courseswitchservice.examPageStatus.subscribe(
      data => {
        if (data) {
          this.islocation = true;
        }
        else {
          this.islocation = false;
        }
    });
    this.isMobile = this.utils.isMobile();

    this.misc.showMobileSidebar.subscribe(
      data => {
        this.showsidebar = data;
      }
    );

    // this.cart.getCart().subscribe();
    // this.getNotificationsCount();
    // this.getNotificationsList('unread', 1);
    // if (this.searchTerm) {
    //   this.searchExam();
    // }
    this.getUserProfile();
  }

}
