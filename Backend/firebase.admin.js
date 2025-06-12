import { initializeApp, cert } from 'firebase-admin/app';
import serviceAccount from './google-services.json' assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});
