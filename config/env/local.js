'use strict';
const p = require('../../package.json');
const version = p.version;
module.exports = {
  JWTSETTINGS: {
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    jwtAlgorithm: process.env.JWT_ALGORITHM,
    accessTokenExpire: '86400s', // 60 Min
    refreshTokenExpire: '3600s', // 60 Min
    // THIS IS USED TO SET THE EXPIRY TIME OF ACCESS AND REFRESH TOKEN IN DATABASE, VALUE MUST BE EQUIVALENT OF ABOVE TWO, IN SECONDS.
    accessToken_DB_expTime: '3600', // SHOULD ALWAYS BE IN SECONDS
    refreshToken_DB_expireTime: '3600', // SHOULD ALWAYS BE IN SECONDS
    redisSettings: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },

  },
  api_version: "1.0.0",
  api_developer: "",
  boots_enviorment: "1",
  boots_api_version: "",
  constants: {
    API_VERSION: "Api." + version,
    API_DEVELOPER: "Complx",
    API_FOLDER: "v1",
    PAGE_LIMIT: "3",
    SITE_NAME: '',
    SITE_URL: '',
    COMPLX_ADMIN_FRONTEND_URL: 'http://localhost:4200/',
    EMAIL_HEADER_FROM: process.env.EMAIL_HEADER_FROM,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: '',
    CONTACT_US_EMAIL: '',
    NEW_MEMBER_INVITE_EMAIL: "",
    IMAGE_PATH: ``,
    PROFILE_IMAGE_PATH: 'public/images/',
    MESSAGE_SERVICE_BASE_URL: 'http://localhost:7000/',

    //HTTP CODES
    HTTP_RESPONSE_OK: 200,
    HTTP_RESPONSE_OK_NO_CONTENT: 204,
    HTTP_RESPONSE_BAD_REQUEST: 400,
    HTTP_RESPONSE_UNAUTHORIZED: 401,
    HTTP_RESPONSE_FORBIDDEN: 403,
    HTTP_RESPONSE_NOT_FOUND: 404,
    HTTP_RESPONSE_METHOD_NOT_ALLOWED: 405,
    HTTP_RESPONSE_NOT_ACCEPTABLE: 406,
    HTTP_RESPONSE_UPGRADE_REQUIRED: 426,
    HTTP_RESPONSE_TEMPORARY_REDIRECT: 307,
    HTTP_RESPONSE_SOME_ERROR_OCCURRED : 500,
    LOG_API_BASE_URL: 'http://localhost:3300/',
    TRANSACTION_API_BASE_URL: 'http://localhost:3500/',
    ORDER_API_BASE_URL: process.env.order_api_base_url,
    LOG_ALL_ACTIVITY:0, //1=>Yes,0=>No
  },

  crypto: {
    EncKey: process.env.ENCKEY,
		IntVector: process.env.INT_VECTOR
  },

  //LOGIN USER TYPE DATA
  LOGIN_USER_TYPE: {
    1: "COMPLX_ADMIN",
    2: "PROP_MGR",
    3: "APP_USER"
  },

  FILE_SIZE_LIMIT: {
    PROFILE_PIC: 1000000, //valie is in BYTES, 1 MegaBytes = 1000000 Bytes
    VEHICLE_PIC: 1000000 //valie is in BYTES, 1 MegaBytes = 1000000 Bytes
  },

  TMP_FILE_PATH: {
    VEHILCE: "./uploads/"
  },

  // MAX TIME LIMIT
  TIME_LIMIT: {
    FORGOT_PASS_LINK_EXP: 1200, // 20MINS
    RESEND_OTP: 600 // 10MINS
  },
  

  IDENTIFIER_URLs: {
    SUBSCRIPTION: "complx-admin/subscriptionLink?identifier=",
  },

  MAIL_ROUTES: {
    VERIFICATION_CODE_MAIL: 'mail/sendMail',
    INVITATION_RESIDENT: 'mail/sendMail',
    FORGOT_PWD_PATH: 'mail/sendMail'
  },

  MAIL_TEMPLATES: {
    VERIFICATION_CODE_TEMPLATE: 'verificationCode',
    INVITATION_RESIDENT_TEMPLATE: 'sendInvitationResident',
    FORGOT_PWD: 'forgotPwdApp',
  },

  primary_auth: {
    CS_BEARER_TOKEN: process.env.CS_BEARER_TOKEN
  },

  ERROR_LOG_PATH: {
    LOG: process.env.LOG_FILE_PATH
  },
  
  /*For AWS config variable*/
  sitefromEmail: '',
  S3_BUCKET_URL: '',
  S3_ACCESSKEYID: process.env.AWS_S3_ACCESS_KEY,
  S3_SECRETKEY:  process.env.AWS_S3_SECRET_KEY,
  S3_BUCKET_NAME:  process.env.AWS_S3_BUCKET,
  S3_FILE_PATH:  process.env.AWS_S3_BASE_URL,
  /*End*/

  /**********************LOGGER CONFIGURATION***************** */
  PARENTS_APPLICATION_NAME: "Complx_api_V1",
  LOGGER_SETTINGS: {
    logger_generate_level: 2, //0=>NOTHING, 1=>ERROR ONLY, 2=>INFO AND ERROR BOTH
    logger_enable_write: true, //ENABLE LOGGER TO WRITE
    logger_error_write_all: true,
    generate_sql_query_log: true,
    logger_enable_application_name: '', //APPLICATION NAME IF WANT TO GENERATE LOGGER ONLY FOR THAT APPLICATION
    logger_enable_module_name: '', //MODULE NAME IF WANT TO GENERATE ONLY PARTICULAR MODULE'S LOGGER EXAMPLE: /var/www/html/project_folder/app/api/admin/v1/controller.js
  },
  /*********************************************************** */

  CS_Details : {
    login_url : "https://stage-ws1.complx.com/cs/login",
    bearer_token : process.env.CS_BEARER_TOKEN
  },

  REQUEST_TYPE : {
    1 : "CS_LOGIN_DETAILS",
    2 : "LOGIN_INVITATION",
    3 : "FORGOT_PWD"
  },

  WS_ENDPOINT: "wss://localhost:4002/customer/",

 //DATE FORMAT
  DATE_FORMAT : {
    1 : "MM-DD-YYYY HH:mm:ss",
    2 : "MM-DD-YYYY",
    3 : "MMM DD, YYYY",
    4 : "MMM DD, YYYY HH:mm:ss"
  },
  miles_per_hour: 26,
  boost_amp: 40,
  total_amp: 100

};
