import firebase from 'firebase/app' ;
import 'firebase/auth' ;
import 'firebase/firestore' ;

var firebaseConfig = {
    apiKey: "XXXXXX",
    authDomain: "XXXXXX",
    projectId: "XXXXXX",
    storageBucket: "XXXXXX",
    messagingSenderId: "XXXXXX",
    appId: "XXXXXX",
    measurementId: "XXXXXX"
} ;

firebase.initializeApp(firebaseConfig) ;

export const auth = firebase.auth() ;
export const db = firebase.firestore() ;