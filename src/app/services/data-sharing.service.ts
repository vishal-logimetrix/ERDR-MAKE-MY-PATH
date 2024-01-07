import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  constructor() { }

  packageList: any;
  myPackageList: any;

  getAssessment() {
    return this.packageList
  }

  setPackage(pkgList) {
    this.packageList = pkgList
  }

  getMyPackageList() {
    return this.myPackageList;
  }

  setMyPackages(myPkgList) {
    this.myPackageList = myPkgList
  }
}
