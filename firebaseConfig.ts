import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDl_uc9EpVWuRQKDZWxbh2E-FAUIDYK-Fw',
  projectId: 'indoornav-8a728',
  appId: '1:230207499647:web:80c83af693d022533c7e4a'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
