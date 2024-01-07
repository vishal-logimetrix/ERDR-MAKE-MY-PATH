import { Injectable } from '@angular/core';
import { NetworkRequestService } from './network-request.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstituteOrganizationService {
  private instituteOrganizationProfile: BehaviorSubject<object> = new BehaviorSubject({});
  instituteOrganizationProfileData = this.instituteOrganizationProfile.asObservable();

  constructor(
    private networkRequest: NetworkRequestService,
  ) { }

  getInstituteOrganizationProfile() {
    return new Observable(observer => {
      this.networkRequest.getWithHeaders('/api/institute_profile').subscribe(
        data => {
          console.log("getInstituteOrganizationProfile ", data);
          observer.next(data);
        },
        error => {
          console.log(error)
        }
      );
    });
  }

  loadInstituteOrganizationProfileData(data) {
    this.instituteOrganizationProfile.next(data);
  }

  getStandard() {
    return new Observable(observer => {
      this.networkRequest.getWithHeaders('/api/institute_standard_get_create').subscribe(
        data => {
          observer.next(data);
        },
        error => {
          console.log(error)
        }
      );
    });
  }


  createStandard(data) {
    return new Observable(observer => {
      this.networkRequest.postWithHeader('/api/institute_standard_get_create', data).subscribe(
        data => {
          observer.next(data);
        },
        error => {
          console.log(error)
        }
      );
    });
  }

}
