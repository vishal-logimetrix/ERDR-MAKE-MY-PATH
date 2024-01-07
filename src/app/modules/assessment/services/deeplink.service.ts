import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeeplinkService {

  constructor() { }

  deeplink() {
    let ua = navigator.userAgent.toLowerCase();
    let isAndroid = ua.indexOf("android") > -1; // android check
    let isIphone = ua.indexOf("iphone") > -1; // ios check
    if (isIphone == true) {
     let app = { 
       launchApp: function() {
        setTimeout(function() {
          window.location.href = "https://itunes.apple.com/us/app/aptence/id1408667112";
        }, 25);
        window.location.href = "bundlename://linkname"; //which page to open(now from mobile, check its authorization)
       },
       openWebApp: function() {
        window.location.href = "https://itunes.apple.com/us/app/aptence/id1408667112";
       }
   };
   app.launchApp();
  } else if (isAndroid== true) {
     let app = { 
       launchApp: function() {
         window.location.replace("bundlename://com.aptence"); //which page to open(now from mobile, check its authorization)
         setTimeout(this.openWebApp, 500);
       },
       openWebApp: function() {
         window.location.href =  "https://play.google.com/store/apps/details?id=com.aptence";
       }
   };
   app.launchApp();
  }else{
   //navigate to website url
   var whatsAppUrl = `https://api.whatsapp.com/send?text=https://makemypath.app/ | %0D%0A%0D%0A*Link To Home Page*`;
   var a = document.createElement('a');
   a.href = whatsAppUrl;
   a.target = '_blank';
   a.click();
  }
  }
}
