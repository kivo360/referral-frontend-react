import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin } from '../services/api';
import { loginUser } from '../services/user';
import { setAuthority } from '../utils/authority';
import { setUserEmail, logoutUser } from '../utils/userinfo';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    email: undefined,
    hash: undefined,
  },
  
  effects: {
    *loginNew({ payload }, { call, put }){
      const response = yield call(loginUser, payload);
      yield put({
        type: 'defaultLoginStatus',
        payload: {
          currentAuthority: 'user',
          ...response.data,
        },
      });
      if(response.status === 200 || response.status === 202) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put( routerRedux.push('/dashboard/analysis') );
      }
    },
    
    // Login 2 (payload, {call, put})
      // get response from server
      // Change the login status
      // Make sure to set the user's email in the payload as well 
      // If the status number is either 200 or 202 continue to the main page
      // reloadAuthorized
      // Fuck it, just reload


    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.startsWith('/#')) {
        //       redirect = redirect.substr(2);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        yield put(routerRedux.push('/dashboard/analysis'));
      }
    },
    *logout(_, { put }) {
      // Remove the authority and reload
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      logoutUser();
      // Push the user to the login page
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        email: payload.email,
      };
    },
    defaultLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setUserEmail(payload.email);
      return {
        ...state,
        status: true,
        // type: payload.type,
        email: payload.email,
        hash: payload.referral_hash,
      };
    },
  },
};
