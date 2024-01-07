export const environment = {
  production: true,

  // LOGIN SETTINGS
  LOGIN_EXPIRY_TIME: 7,


  // CART SETTINGS
  CART_EXPIREY_TIME: 7,
  CART_ITEM_EXPIREY_TIME: 7,


  // MEDIA FILE SETTINGS
  static: 'assets',
  media: '',


  // PAYMENT SETTINGS
  PAYMENT_KEY: 'rzp_test_SSFhdXutdajcVB',


  // USER SETTINGS
  DEFAULT_USER_PROFILE: 'https://aptination.s3.amazonaws.com/static/dev/assets/images/svg/user-img.svg',
  ALLOWED_IMAGE_FORMATS: ['image/png', 'image/jpeg'],
  PHONE_LENGTH: 10,
  OTP_LENGTH: 6,
  COUPON_CODE_LENGTH: [5, 10],
  PHONE_REGEX: /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/,
  NOTIFICATION_LENGTH: 5,


  // NETWORK SETTINGS
  // BASE_URL: 'https://devbackend.aptination.com',
  // BASE_URL: 'https://devbackend.aptination.com',
  // BASE_URL: 'https://aqlouvjnt7.execute-api.ap-south-1.amazonaws.com/development',
  // BASE_URL: 'https://mmp.aptence.com',
  BASE_URL: 'https://backend.makemypath.app',
  // BASE_URL: 'https://backendprod.makemypath.app',

  //  SITE SETTINGS
  COUNTRY_CODE: 'IND',
  COUNTRY_ID: '1',
  DEFAULT_STATE: 8,


  // UI SETTINGS
  MAX_ASSESSMENT_AT_DASHBOARD: 3,
  MAX_ASSESSMENT_AT_HOME: 4,

  // BLOG SETTINGS
  BLOG_SLIDER_COUNT: 2,
  NO_OF_COLUMNS: 4
};
