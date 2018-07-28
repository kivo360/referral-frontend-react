import { routerRedux } from 'dva/router';
import { registerUser } from '../services/user';
import { setAuthority } from '../utils/authority';
import { setUserEmail } from '../utils/userinfo';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';
const publicIp = require('public-ip');


export default {
  namespace: 'register',

  state: {
    status: undefined,
    submitting: false,
  },

  effects: {
    
    *submit({ payload }, { call, put }) {
      const params = getPageQuery();
      const { ref } = params;
      console.log("Ticking 2.5");
      const IP = yield publicIp.v4();
      // console.log(IP);
      console.log("Ticking 3");
      const response = yield call(registerUser, {
        referrer: ref,
        ip: IP,
        ...payload,
      });
      // console.log(response);
      try {
        if (response.status === 200 || response.status === 202) {
          console.log("Ticking 4");
          yield put({
            type: 'registerHandle',
            payload: {status: 'ok'},
          });
  
          setUserEmail(response.data.email);
          yield put(routerRedux.push('/dashboard/analysis'));
          return;
        }
        else{
          console.log("Ticking 5");
          yield put({
            type: 'registerHandle',
            payload: {status: 'error'},
          });
          return;
        }
        return;
      } catch (error) {
        yield put({
          type: 'registerHandle',
          payload: {status: 'error'},
        });
        // yield put(routerRedux.push('/user/register'));
      }
      
      
      
      // console.log(params);
      // console.log(payload);
      // console.log(response);
      
    },
  },

  reducers: {
    registerSubmit(state, { payload }) {
      //  = false;
      if(payload.status === 'ok'){
        setAuthority('user');
        reloadAuthorized();
      }
      
      return {
        ...state,
        status: payload.status,
      };
    },
    registerHandle(state, { payload }) {
      //  = false;
      if(payload.status === 'ok'){
        setAuthority('user');
        reloadAuthorized();
      }
      
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
