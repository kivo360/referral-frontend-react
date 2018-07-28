import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { getUserEmail, getUserPaymentInfo, getUserModal, setUserModal, setUserPaymentInfo } from '../../utils/userinfo';

const { Tab, UserName, Password, Submit } = Login;




// Connect here is used to load the state of the available model
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
  submittingNew: loading.effects['login/loginNew'],
}))
export default class LoginPage extends Component {

  constructor(props){
    super(props);


    this.state = {
      type: 'account',
      autoLogin: true,
    };

    const { dispatch } = this.props;

    const userEmail = getUserEmail();
    if (userEmail !== undefined){ 
        dispatch(routerRedux.push('/dashboard/analysis'))
    }
  }

  

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { dispatch } = this.props;
    // console.log(e)
    if (!err) {
      dispatch({
        type: 'login/loginNew',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        {/* Determine which kind of login needs to happen */}
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="Account Password">
            {/* Show error code is the status is error. Set status using filter function in util */}
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('Incorrect account or password')}
            <UserName name="email" placeholder="Email" />
            <Password name="password" placeholder="Password" />
          </Tab>
          {/* Check if the user is logged in */}
          {/* <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              Remember Me
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              Forget Password
            </a>
          </div> */}
          <Link className={styles.login} to="/user/register">
            Haven't Sighed Up Yet? Sign up here
          </Link>
          <Submit loading={submitting}>Login</Submit>
        </Login>
      </div>
    );
  }
}
