// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  fcmUrl: 'https://fcm.googleapis.com/fcm/send',
  fcmServerKey: "AAAAURC0hy0:APA91bGQCmkM8XEQZrjlvuA_r0GMjCybIdaab4uuZw89FY75il_fHAI6Oc2bgKeOdxeVcV4ZblHW0t5H6D2orgFyscEywaLqpq8VXJoBybPhRLY_ChZ4vnZb-mDassqQBhmFAHiOMEgY",

  firebaseConfig : {
    apiKey: "AIzaSyB9EBagjUVg77dRKcEY_dpWvZSyzsy7CF0",
    authDomain: "pps-segundo-parcial.firebaseapp.com",
    projectId: "pps-segundo-parcial",
    storageBucket: "pps-segundo-parcial.appspot.com",
    messagingSenderId: "348172617517",
    appId: "1:348172617517:web:430009befb20394687f5a4"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
