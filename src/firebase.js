// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCw6lD_ZtNx_okd4Qj3UI03r50cWFpCd5c',
  authDomain: 'backronym-generator-9b538.firebaseapp.com',
  projectId: 'backronym-generator-9b538',
  storageBucket: 'backronym-generator-9b538.appspot.com',
  messagingSenderId: '360896794296',
  appId: '1:360896794296:web:3b297e463ea6a9a2beee4d',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);

export default firebase;
