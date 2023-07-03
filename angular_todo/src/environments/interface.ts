export interface Environment {
  production: boolean;
  firebaseConfig: {
    storageBucket: string;
    apiKey: string;
    messagingSenderId: string;
    databaseURL:string;
    appId: string;
    projectId: string;
    authDomain: string
  }
}
