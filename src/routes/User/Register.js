import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import YouTube from 'react-youtube';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>Strength: Strong</div>,
  pass: <div className={styles.warning}>Strength: powerful</div>,
  poor: <div className={styles.error}>Strength: too short</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '1',
  };

  componentWillReceiveProps(nextProps) {
    const { form, dispatch } = this.props;
    const account = form.getFieldValue('mail');
    if (nextProps.register.status === 'ok') {
      dispatch(
        routerRedux.push({
          pathname: '/user/register-result',
          state: {
            account,
          },
        })
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      const { prefix } = this.state;
      if (!err) {
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('The password entered twice does not match!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: 'Please enter your password!',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      const { visible, confirmDirty } = this.state;
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;

    const opts = {
      height: '300',
      width: '500',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    return (
      <div>

        <div
          style={{width:'500px', margin: 'auto'}}
        >
          <YouTube 
            videoId="2g811Eo7K8U"
            opts={opts}
            onReady={this._onReady}
          />
        </div>
          
        

        <div className={styles.main}>
          <h3 style={{textAlign:'center'}}>Prelaunch Registration</h3>
          
          <Form onSubmit={this.handleSubmit}>
            
            <FormItem>
              {getFieldDecorator('first', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter your first name!',
                  },
                ],
              })(<Input size="large" placeholder="First Name" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('last', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter your last name!',
                  },
                ],
              })(<Input size="large" placeholder="Last Name" />)}
            </FormItem>
            
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the email address!',
                  },
                  {
                    type: 'email',
                    message: 'The email address is in the wrong format!',
                  },
                ],
              })(<Input size="large" placeholder="Email" />)}
            </FormItem>
            

            <FormItem help={help}>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      Please enter at least 6 characters. Please do not use passwords that are easy to guess.
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(<Input size="large" type="password" placeholder="Enter Password" />)}
              </Popover>
            </FormItem>
            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(<Input size="large" type="password" placeholder="Confirm Password" />)}
            </FormItem>
            
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
              <Link className={styles.login} to="/user/login">
                Sign in with an existing account
              </Link>
            </FormItem>
          </Form>
        </div>
      </div>
      
    );
  }
}
