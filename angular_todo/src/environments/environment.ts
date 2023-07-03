// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import {Environment} from "./interface";
import {getAuth} from "@firebase/auth";
import {initializeApp} from "firebase/app";

export const environment: Environment = {
  production: false,
  firebaseConfig: {
    apiKey: "",                                // paste your apiKey here
    authDomain: "",                            // paste your authDomain here
    projectId: "",                             // paste your projectId here
    storageBucket: "",                         // paste your storageBucket here
    messagingSenderId: "",                     // paste your messagingSenderId here
    databaseURL: "",                           // paste your databaseURL here
    appId: ""                                  // paste your appId here
  }
};

const app = initializeApp(environment.firebaseConfig, {});
export const auth = getAuth(app) ;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import "zone.js/plugins/zone-error";  // Included with Angular CLI.
