import axios from 'axios';
import {BackendConfiguration} from '@config';

const apiClient = axios.create({
  baseURL: BackendConfiguration.FCM_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'key=' + BackendConfiguration.FIREBASE_API_KEY,
  },
  timeout: 30000,
});

function sendNotification(body) {
  var postData = {
    notification: body.notification,
    data: body.data,
    registration_ids: body.registration_ids,
  };
  apiClient.post(BackendConfiguration.FCM_BASE_URL, postData);
}

export const FirebaseServices = {
  sendNotification,
};
