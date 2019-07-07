import request from '../utils/request';
import axios from 'axios';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { stat } from 'fs';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'The data was deleted successfully.',
  400: 'The request was made with an error and the server did not perform any new or modified data operations.',
  401: 'User does not have permission (token, username, password is incorrect).',
  403: 'User does not have permission (token, username, password is incorrect).',
  404: 'The request is made for a record that does not exist and the server does not operate.',
  406: 'The request is for a record that does not exist and the server is not running.',
  410: 'The requested resource is permanently deleted and will not be retrieved.',
  422: 'A validation error occurred when creating an object.',
  500: 'An error occurred on the server. Please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable and the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.',
};

// const protocol = window.location.protocol;
// const slashes = protocol.concat("//");
// const host = slashes.concat(window.location.host);
const host = 'http://localhost:9000';
// const ref = host.concat("/#/user/register?ref=")
// const rh = ref.concat(user.referral_hash)

const instance = axios.create({
  baseURL: host,
  timeout: 20000,
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
    put: {
      'Content-Type': 'application/json',
    },
    delete: {
      'Content-Type': 'application/json',
    },
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS, HEAD',
  },
});

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // console.log(response);
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `Request error ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

export async function query() {
  return request('/api/users');
}

/**
 * These are the main API endpoints we'll be using
 */

// Get the user information here
export async function queryCurrent(params) {
  return instance
    .post('/user/info', params)
    .then(checkStatus)
    .then(response => {
      console.log(response);
      return response.data;
    })
    .catch(err => {
      notification.error({
        message: err.response.status,
        description: err.response.data.msg,
      });

      const { dispatch } = store;
      const status = err.response.status;

      if (status === 400 || status === 401) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}

// Login here
export async function loginUser(params) {
  return (
    instance
      .post('/user/login', params)
      .then(checkStatus)
      // .then(response => {
      //   console.log(response);
      //   if (response.status === 204) {
      //     return response.text();
      //   }
      //   return response.data;
      // })
      .then(response => {
        console.log(response);
        return response.data;
      })
      .catch(err => {
        notification.error({
          message: err.response.status,
          description: err.response.data.msg,
        });

        const { dispatch } = store;
        const status = err.response.status;
        console.log(status);
        return;
        // if (status === 400 || status === 401 ) {
        //   dispatch(routerRedux.push('/exception/403'));
        //   return;
        // }
        // if (status === 403) {
        //   dispatch(routerRedux.push('/exception/403'));
        //   return;
        // }
        // if (status <= 504 && status >= 500) {
        //   dispatch(routerRedux.push('/exception/500'));
        //   return;
        // }
        // if (status >= 404 && status < 422) {
        //   dispatch(routerRedux.push('/exception/404'));
        // }

        // localStorage.setItem("loggedin_user", referralObject.username);
      })
  );
}

// Register here
export async function registerUser(params) {
  // publicIp

  return instance
    .post('/user/register', params)
    .then(checkStatus)
    .then(response => {
      // console.log(Gresponse);
      return response.data;
    })
    .catch(err => {
      // console.log(err);
      // console.log(err.message)
      // console.log(err.name)
      // console.log(err.response);
      notification.error({
        message: err.response.status,
        description: err.response.data.msg,
      });

      const { dispatch } = store;
      const status = err.response.status;
      console.log(status);
      return;
      // if (status === 400 || status === 401 ) {
      //   dispatch(routerRedux.push('/exception/403'));
      //   return;
      // }
      // if (status === 403) {
      //   dispatch(routerRedux.push('/exception/403'));
      //   return;
      // }
      // if (status <= 504 && status >= 500) {
      //   dispatch(routerRedux.push('/exception/500'));
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   dispatch(routerRedux.push('/exception/404'));
      // }
    });
}
