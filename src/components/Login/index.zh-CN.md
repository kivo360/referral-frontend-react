---
title: Login
subtitle: 登录
cols: 1
order: 15
---

Support a variety of login mode switching, built-in several common login controls, flexible combination, and support with custom controls.
## API

### Login

Parameter | Instructions | Type | Defaults
----|------|-----|------
defaultActiveKey | Default activation tab Panel key | String | -
onTabChange | Callback when switching tabs | (key) => void | -
onSubmit | Click on the callback when submitting | (err, values) => void | -

### Login.Tab

Parameter | Instructions | Type | Defaults
----|------|-----|------
key | Corresponding tab key | String | -
tab | Tab header display text | ReactNode | -

### Login.UserName

Parameter | Instructions | Type | Defaults
----|------|-----|------
name | Control tag, submit data is also used as this key | String | -
rules | Verification rule, same Form getFieldDecorator(id, options) in [option.rules the rule of](getFieldDecorator(id, options)) | object[] | -

In addition to the above attributes，Login.UserName Also support antd.Input All properties, and comes with a default base configuration, including `placeholder` `size` `prefix` Etc., these basic configurations can be overwritten.

### Login.Password、Login.Mobile with Login.UserName

### Login.Captcha

Parameter | Instructions | Type | Defaults
----|------|-----|------
onGetCaptcha | Click to get the checksum of the check code | () => void | -

In addition to the above attributes，Login.Captcha Supported attributes and Login.UserName the same.

### Login.Submit

**Stand by** `antd.Button` Click to get the checksum of the check code
