import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { T } from 'antd/lib/upload/utils';

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
// Set the url to sanic
const defaultUrl = "https://referral.funguaservices.com";

function checkStatus(response) {
  // console.log(response);
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `Request error ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}


function printResponse(response){
  console.log(response);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {

  const checkUrlDepth = url.includes(defaultUrl);
  const urlDetails = {};
  if (checkUrlDepth === false){
    urlDetails.server = defaultUrl+url;
  }
  else{
    urlDetails.server = url;
  }
  const defaultOptions = {
    credentials: 'omit',
  };
  const newOptions = { ...defaultOptions, ...options };
  newOptions.headers = {
    'Access-Control-Allow-Origin': "*",
    ...newOptions.headers,
  };


  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': "*",
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': "*",
        ...newOptions.headers,
      };
    }
    newOptions.mode = "no-cors";
    
  }

  return fetch(urlDetails.server, newOptions)
    .then(printResponse)
    .then(checkStatus)
    .then(response => {
      console.log(response);
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      // console.dir(e.name);
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
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
