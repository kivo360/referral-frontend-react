import React, { Component, Fragment } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Tabs,
  Avatar,
  List,
	Modal,
	Progress,
	Divider
} from 'antd';
import { routerRedux } from 'dva/router';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area} from 'recharts';


import { getTimeDistance, convertDateTime, occurrence } from '../../utils/utils';
import { getUserEmail } from '../../utils/userinfo';


import styles from './Analysis.less';
import styles2 from './Workplace.less';





@connect(({ chart, login, user }) => ({
  chart,
  login,
  user,
  // loading: loading.effects['chart/fetch'],
  // activitiesLoading: loading.effects['activities/fetchList'],
  
}))
export default class Analysis extends Component {
  
	

  constructor(props){
    super(props);
    
    
    this.state = {
      referralList: [],
      totalCount: 0,
      first: 0,
      second: 0,
      thrid: 0,
			degreeCountList: [],
      currentTabKey: '',
      visible: true,
      prepay: true,
			referralByDate: [],
      rangePickerValue: getTimeDistance('year'),
    };





    const { dispatch } = this.props;
    
    // Should get the email from local storage instead
    const userEmail = getUserEmail();
    if (userEmail === undefined){ 
      dispatch(routerRedux.push('/user/login'))
    }
  }

	

  componentDidMount() {
    const { dispatch } = this.props;
    const userEmail = getUserEmail();
    setTimeout(()=>{
      dispatch({
        type: 'user/latestUsers',
        payload:{
          email: userEmail,
        },
      });
    }, 200)
    
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   // dispatch({
  //   //   type: 'chart/clear',
  //   // });
    
  // };

  componentWillReceiveProps(nextProps){
    // console.log(nextProps);
    const { user } = nextProps;
    if(user){
      this.setReferralStates(user);
    }
  }

	setReferralByDateInState(occuranceObject){
		const refByDateList = [];
		// const currentDate = (new Date().getDate())
		
		const convertedTime = convertDateTime((Date.now()/1000));
		console.log(convertedTime)
		// console.log()
		let isThere = false;
		for (const key of Object.keys(occuranceObject)) {
			if (key === convertedTime){
				isThere = true;
			}
			refByDateList.push({
				name: key,
				referrals: occuranceObject[key].length,
			});
		}


		// Check the convert the latest date into the format we need
		if (!isThere){
			console.log(refByDateList[refByDateList.length-1].referrals)
			refByDateList.push({
				name: convertedTime,
				referrals: refByDateList[refByDateList.length-1].referrals,
			});
		}
		// If the latest day isn't there, take the last referral response date
		this.setState({referralByDate: refByDateList})
	}

  setReferralStates(referrals){
    // Transform all referrals into
    // console.log(referrals);

    const { currentUser } = referrals;
    const { user, referred } = currentUser;

		const refList = [];
		
		// Bundle the referrals into a list. Numbers of users referred by day. 
		// For that, try getting the exact number of referrals in each day

    if (referred) {
      referred.l1.list.forEach(referralPerson => {
				// Convert to day
				const regDate = convertDateTime(referralPerson.created_at);
        refList.push({degree:'1st', date:regDate, ...referralPerson} );
      });
      referred.l2.list.forEach(referralPerson => {
				const regDate = convertDateTime(referralPerson.created_at);
        refList.push({degree:'2nd', date:regDate, ...referralPerson} );
        
      });
      referred.l3.list.forEach(referralPerson => {
				const regDate = convertDateTime(referralPerson.created_at);
        refList.push({degree:'3rd', date:regDate, ...referralPerson} );
			});
			
			// Bundle the number of connections by day here
			// Loop through refList
			const dateList = [];
			refList.forEach(element => {
				dateList.push(element.date);
			});

			const occurences = occurrence(dateList);
			this.setReferralByDateInState(occurences);
			// console.log(occurences);


			// Convert all of them into a massive dictionarty for the user's referrals
			// {day: "day goes here", number: "number goes here"}

				// Get loop through all elements of the array
					// Get the date and store it
					// Loop through rest of the array
					// For each occurence with the given date, increment number
				

      this.setState({
        referralList: refList,
        totalCount: referred.l1.count + referred.l2.count + referred.l3.count,
        first: referred.l1.count,
        second: referred.l2.count,
        thrid: referred.l3.count,
				degreeCountList: [
					{name: '1st Degree', value: referred.l1.count},
					{name: '2nd Degree', value: referred.l2.count},
					{name: '3rd Degree', value: referred.l3.count},
				],
      });
    }

  }

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };


  onToken = (token) => {
    console.log(token);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }


  dismissPrepay = (e) => {
    this.setState({
      prepay: false,
    })
  }


  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }


	
  
  // collectUserInformation (){
  //   console.log("Need to pull information for user here");
  // }


  renderActivities() {
    const {referralList} = this.state;

    return referralList.map(item => {
      return (
        <List.Item key={item.email}>
          <List.Item.Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={
              <span>
                <a className={styles.username} style={{marginRight:10}}>{item.email}</a>
                &nbsp;
                {/* <span className={styles.event}>{events}</span> */}
              </span>
            }
            description={
              <span className={styles.datetime} title="Whats going on here?">
                <div> 
                  <span>User Pre-Signed {new Date((item.created_at * 1000)).toDateString()}</span>
                  <span><h4>{item.degree} Degree Referral</h4></span>
                </div>
              </span>
            }
          />
        </List.Item>
      );
    });

  }



  render() {
    const { currentTabKey } = this.state;
    const { chart, loading } = this.props;
    const {
      offlineData,
      offlineChartData,
    } = chart;


    const currentData = [
      {name: 'Original Time', uv: 4000, referrals: 1, amt: 2400},
      {name: 'Current Time', uv: 3000, referrals: 1, amt: 2210},
    ];


    const data01 = [{name: 'Group A', value: 2400}, {name: 'Group B', value: 4567},
                  {name: 'Group C', value: 1398}, {name: 'Group D', value: 9800},
                  {name: 'Group E', value: 3908}, {name: 'Group F', value: 4800}];
		const data = [
				{
					title: 'Prize #1',
				},
				{
					title: 'Prize #2',
				},
				{
					title: 'Prize #3',
				},
				{
					title: 'Prize #4',
				},
				{
					title: 'Prize #5',
				},
				{
					title: 'Prize #6',
				},
		];
    const dataColors = ['#47ad5e', '#b97bd8', '#229954', '#56d8c4', '#28b463', '#3dcc90', '#FFD700', '#ADFF2F', '#00FF7F', '#20B2AA', '#66CDAA', '#6495ED', '#40E0D0' ];

    const {
      activitiesLoading,
      // chart: { radarData },
    } = this.props;

    const gridStyle = {
      width: '33%',
      textAlign: 'center',
      cursor: 'pointer',
      minHeight: '25vh',
    };


    const listStyle = {
      listStyleType:'none',
    }
    // Get some sort of data here
    // Convert user information into timeseries
    return (
      <Fragment >
          <Modal
            title="Funguana's Prelaunch Program"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="50%"
          >	
            <h2>Keep Track Of Your Referrals</h2>
            <Divider />
            <p>Here you can:</p>
						<ol>
							<li>Get your referral code</li>
							<li>Check on your referral stats</li>
							<li>See if you achieved prizes</li>
						</ol>
						
						<h2>How prizes work</h2>
						<p>You can get prizes for getting people to enter their email in this prelaunch program.</p>
						<p>The prizes work in multiple levels:</p>
						<ol>
							<li>Friends you recommend (1st Tier)</li>
							<li>Friends of your friends (2nd Tier)</li>
							<li>Friends of your friend's friends (3rd Tier)</li>
						</ol>
						<p>Check out the prizes at the bottom of the page. It will include the list of prizes (weighed towards 3rd tier), and the prizes you've won so far</p>
						<h4>Buy your first month in advance. That way you'll have extra benefits like discounts.</h4>
          </Modal>

          {/* Show if the user hasn't purchased anything yet or if the user hasn't disabled it */}
					<Card 
						title="Check Out These Prelaunch Deals"
						extra={<a href="#">I Don't Want The Benefit</a>}
					> 
              <StripeCheckout
                name="Funguana" // the pop-in header title
                description="Prebook your bot" // the pop-in header subtitle
                image="https://funguana.com/wp-content/uploads/2018/03/logo.png" // the pop-in header image (default none)
                ComponentClass="div"
                panelLabel="Pay" // prepended to the amount in the bottom pay button
                amount={2499} // cents
                currency="USD"
                stripeKey="pk_live_oZtsGfDBpdVEr6OyyEAZtv9a"
                // locale="en"
                email="kevin@funguana.com"
                // Note: Enabling either address option will give the user the ability to
                // fill out both. Addresses are sent as a second parameter in the token callback.
                // shippingAddress
                // billingAddress={false}
                // Note: enabling both zipCode checks and billing or shipping address will
                // cause zipCheck to be pulled from billing address (set to shipping if none provided).
                zipCode={false}
                alipay // accept Alipay (default false)
                bitcoin // accept Bitcoins (default false)
                allowRememberMe // "Remember Me" option (default true)
                token={this.onToken} // submit callback
                reconfigureOnUpdate={false}
                triggerEvent="onClick"
              
              >
              
                <Card.Grid style={gridStyle}>
                  <h4>Deal Name</h4>
                  <h1>$24.99</h1>
                  <p>Reason 1</p>
                  <p>Reason 2</p>
                  <p>Reason 3</p>

                </Card.Grid>
              </StripeCheckout>
              <StripeCheckout
                name="Funguana" // the pop-in header title
                description="Prebook your bot" // the pop-in header subtitle
                image="https://funguana.com/wp-content/uploads/2018/03/logo.png" // the pop-in header image (default none)
                ComponentClass="div"
                panelLabel="Pay" // prepended to the amount in the bottom pay button
                amount={2999} // cents
                currency="USD"
                stripeKey="pk_live_oZtsGfDBpdVEr6OyyEAZtv9a"
                // locale="en"
                email="kevin@funguana.com"
                // Note: Enabling either address option will give the user the ability to
                // fill out both. Addresses are sent as a second parameter in the token callback.
                // shippingAddress
                // billingAddress={false}
                // Note: enabling both zipCode checks and billing or shipping address will
                // cause zipCheck to be pulled from billing address (set to shipping if none provided).
                zipCode={false}
                alipay // accept Alipay (default false)
                bitcoin // accept Bitcoins (default false)
                allowRememberMe // "Remember Me" option (default true)
                token={this.onToken} // submit callback
                reconfigureOnUpdate={false}
                triggerEvent="onClick"
              
              >
              <Card.Grid style={gridStyle}>
                <h4>Deal Name</h4>
                <h1>$29.99</h1>
                <p>Reason 1</p>
                <p>Reason 2</p>
                <p>Reason 3</p>

              </Card.Grid>
            </StripeCheckout>


            <StripeCheckout
                name="Funguana" // the pop-in header title
                description="Prebook your bot" // the pop-in header subtitle
                image="https://funguana.com/wp-content/uploads/2018/03/logo.png" // the pop-in header image (default none)
                ComponentClass="div"
                panelLabel="Pay" // prepended to the amount in the bottom pay button
                amount={3499} // cents
                currency="USD"
                stripeKey="pk_live_oZtsGfDBpdVEr6OyyEAZtv9a"
                // locale="en"
                email="kevin@funguana.com"
                // Note: Enabling either address option will give the user the ability to
                // fill out both. Addresses are sent as a second parameter in the token callback.
                // shippingAddress
                // billingAddress={false}
                // Note: enabling both zipCode checks and billing or shipping address will
                // cause zipCheck to be pulled from billing address (set to shipping if none provided).
                zipCode={false}
                alipay // accept Alipay (default false)
                bitcoin // accept Bitcoins (default false)
                allowRememberMe // "Remember Me" option (default true)
                token={this.onToken} // submit callback
                reconfigureOnUpdate={false}
                triggerEvent="onClick"
              
              >
              <Card.Grid style={gridStyle}>
                <h4>Deal Name</h4>
                <h1>$34.99</h1>
                <p>Reason 1</p>
                <p>Reason 2</p>
                <p>Reason 3</p>
              </Card.Grid>
            </StripeCheckout>
          </Card>,


        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered={false}
          title="Referrals Over Time"
          bodyStyle={{ padding: '0 0 32px 0' , height: "27rem" }}
          style={{ marginTop: 32}}
          
        >
            <ResponsiveContainer>

              <AreaChart 
                data={this.state.referralByDate}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="referrals" stroke="#8884d8" activeDot={{r: 8}}/>
      
              </AreaChart>
            </ResponsiveContainer>
          
        </Card>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 0, minHeight: "30rem" }}
              bordered={false}
              className={styles.activeCard}
              title="Your Referrals"
              loading={activitiesLoading}
              style={{ marginTop: 32, marginBottom: 32}}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles2.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 20 , height: "30rem"}}
              bordered={false}
              className={styles.activeCard}
              title="Where your referrals are coming from"
              loading={activitiesLoading}
              style={{ marginTop: 32, marginBottom: 32}}

            > 
              <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{textAlign:"center"}}>
                <h4>Total</h4>
                <p>{this.state.totalCount}</p>
              </Col>
              <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{textAlign:"center"}}>
                <h4>1st</h4>
                <p>{this.state.first}</p>
              </Col>
              <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{textAlign:"center"}}>
                <h4>2nd</h4>
                <p>{this.state.second}</p>
              </Col>
              <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{textAlign:"center"}}>
                <h4>3rd</h4>
                <p>{this.state.thrid}</p>
              </Col>
              
              <Divider>Chart</Divider>
              <div style={{height:"80%"}}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      isAnimationActive={false} 
                      data={this.state.degreeCountList} 
                      outerRadius="60%"
                      fill="#8884d8" label >
                      {data01.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={dataColors[Math.floor(Math.random()*dataColors.length)]} />
                      ))}

                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* 
                
              */}
              {/* <List loading={activitiesLoading} size="large">
                <div className={styles2.activitiesList}>{this.renderActivities()}</div>
              </List> */}
            </Card>
          </Col>
        </Row>

				<Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 25, minHeight: "50vh" }}
              bordered={false}
              className={styles.activeCard}
              title="List Of Prizes"
              loading={activitiesLoading}
              style={{ marginTop: 32, marginBottom: 32}}
            >
              <List
								grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 3, xl: 3, xxl: 2 }}
								dataSource={data}
								renderItem={item => (
									<List.Item>
										<Card title={item.title}>
											Card content
											<Divider>Progress</Divider>
											<Col xl={16} lg={16} md={16} sm={16} xs={16}>
												Nulla fugiat mollit fugiat aliqua dolore Lorem proident duis et amet ad nostrud.
											</Col>
											<Col xl={6} lg={6} md={6} sm={6} xs={6}>
												Incididunt proident tempor aliquip enim dolor cupidatat velit dolor esse do incididunt non.
											</Col>
											{/* <p>By just ... you'll have ...</p> */}
										</Card>
									</List.Item>
								)}
							/>
							

            </Card>
          </Col>
          
          {/* </Col> */}
        </Row>
      </Fragment>
    );
  }
}
