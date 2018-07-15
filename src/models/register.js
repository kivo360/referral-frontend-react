import { routerRedux } from 'dva/router';
import { registerUser } from '../services/user';
import { setAuthority } from '../utils/authority';
import { setUserEmail } from '../utils/userinfo';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';


export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    
    *submit({ payload }, { call, put }) {
      const params = getPageQuery();
      const { ref } = params;

      const response = yield call(registerUser, {
        referrer: ref,
        ...payload,
      });
      console.log(response);
      if (response.status === 200 || response.status === 202) {
        yield put({
          type: 'registerHandle',
          payload: response,
        });

        setUserEmail(response.data.email);
        yield put(routerRedux.push('/dashboard/analysis'));
        
      }
      // console.log(params);
      // console.log(payload);
      // console.log(response);
      
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
