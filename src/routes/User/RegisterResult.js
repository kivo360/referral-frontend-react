import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from 'components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <a href="">
      <Button size="large" type="primary">
        View mailbox
      </Button>
    </a>
    <Link to="/">
      <Button size="large">Back to home</Button>
    </Link>
  </div>
);

export default ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        Your account：
        {location.state ? location.state.account : 'AntDesign@example.com'} 注册成功
      </div>
    }
    description="The activation email has been sent to your email address and is valid for 24 hours. Please log in to the email in time and click on the link in the email to activate the account."
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
