import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: "AIzaSyDuDae6RVKgXyyARHAsvvi_swHkgTM5yxU",
  authDomain: "lunch-picker-3ed9b.firebaseapp.com",
  databaseURL: "https://lunch-picker-3ed9b.firebaseio.com",
  projectId: "lunch-picker-3ed9b",
  storageBucket: "lunch-picker-3ed9b.appspot.com",
  messagingSenderId: "217988674338"
};
firebase.initializeApp(config);

export default firebase