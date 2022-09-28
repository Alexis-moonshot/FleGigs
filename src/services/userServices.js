import axios from 'axios';
import {BackendConfiguration} from '@config';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const apiClient = axios.create({
  baseURL: BackendConfiguration.API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 30000,
});

const apiClient_json = axios.create({
  baseURL: BackendConfiguration.API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

function register(body) {
  const params = new URLSearchParams();
  params.append('first_name', body.first_name);
  params.append('last_name', body.last_name);
  params.append('email', body.email);
  params.append('password', body.password);
  params.append('customer_id', '');
  params.append('location', '');
  params.append('latitude', '0.0');
  params.append('longitude', '0.0');

  return apiClient.post('/registration', params);
}

function updateProfile(body, token) {
  const params = new URLSearchParams();
  params.append('first_name', body.first_name);
  params.append('last_name', body.last_name);
  params.append('location', body.location);
  params.append('latitude', body.latitude);
  params.append('longitude', body.longitude);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/updatecustomerprofile', params);
}

function updateProfileImage(body, token) {
  var postData = {
    file_name: body.file_name,
    profile_id: 2,
  };

  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/profileimageupdate', postData);
}

function login(body) {
  const params = new URLSearchParams();
  params.append('email', body.email);
  params.append('password', body.password);
  params.append('profile_id', '2');

  return apiClient.post('/login', params);
}

function contactSupport(body, token) {
  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/support', body);
}

function logout() {
  return apiClient.post('/logout');
}

function changePassword(body, token) {
  const params = new URLSearchParams();
  params.append('password', body.password);
  params.append('old_password', body.old_password);
  params.append('confirm_password', body.confirm_password);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/changepassword', params);
}

function forgotPassword(body) {
  return apiClient_json.post('/new_forgotpassword', body);
}

function getDashboardData(token) {
  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/customer_dashboard');
}

function getNotificationData(token) {
  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/getnotificationlist');
}

function getJobList(token) {
  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/jobdetails');
}

function getJobDetail(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/jobdetails', params);
}

function getJobRatingDetails(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/rating_tip_details', params);
}

function getProfileData(token) {
  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/viewcustomerdetails');
}

function postJob(body, token) {
  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/jobpost', body);
}

function cancelJob(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/jobcancelled', params);
}

function startJob(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/jobstartedbycustomer', params);
}

function endJob(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/jobendbycustomer', params);
}

function helperArrived(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);
  params.append('helper_id', body.helper_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/helperonsite', params);
}

function rateHelper(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);
  params.append('helper_id', body.helper_id);
  params.append('rating', body.rating);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/helper_rating', params);
}

function payToEscrow(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/escrow_payment', params);
}

function saveFcmTokenToDatabase(body, token) {
  const params = new URLSearchParams();
  params.append('device_token', body.fcmToken);
  params.append('device_type', Platform.OS);
  params.append('device_id', DeviceInfo.getUniqueId());

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/savedevicetoken', params);
}

function getFcmTokensForGroupChat(body, token) {
  const params = new URLSearchParams();
  params.append('job_id', body.job_id);

  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/get_usertoken_forgroupchat', params);
}

function getSavedCard(token) {
  apiClient.defaults.headers.common.token = token;
  return apiClient.post('/getCustomerCards');
}

function saveCard(body, token) {
  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/addSourceToCustomer', body);
}

function deleteCard(body, token) {
  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/deleteSourceToCustomer', body);
}

function setPrimaryCard(body, token) {
  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/updateCustomerDefaultSource', body);
}

function payTipToHelper(body, token) {
  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/pay_tip_for_helper', body);
}

function blockUser(body, token) {
  apiClient_json.defaults.headers.common.token = token;
  return apiClient_json.post('/block_helper', body);
}

export const UserServices = {
  register,
  updateProfile,
  updateProfileImage,
  login,
  contactSupport,
  logout,
  changePassword,
  forgotPassword,
  getDashboardData,
  getNotificationData,
  getJobList,
  getJobDetail,
  getJobRatingDetails,
  getProfileData,
  postJob,
  cancelJob,
  startJob,
  endJob,
  helperArrived,
  rateHelper,
  payToEscrow,
  saveFcmTokenToDatabase,
  getFcmTokensForGroupChat,
  blockUser,

  // Payment
  getSavedCard,
  saveCard,
  deleteCard,
  setPrimaryCard,
  payTipToHelper,
};
