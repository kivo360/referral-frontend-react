import React, { Component, Fragment } from 'react';
// import StripeCheckout from 'react-stripe-checkout';
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
	message,
	Divider,
	Alert,
	Button,
	Popover,
} from 'antd';
import { routerRedux } from 'dva/router';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area} from 'recharts';
import Introductions from './InstructionStep/Introduction';

import { getTimeDistance, convertDateTime, occurrence } from '../../utils/utils';
import { getUserEmail, getUserPaymentInfo, getUserModal, setUserModal, setUserPaymentInfo } from '../../utils/userinfo';
import {CopyToClipboard} from 'react-copy-to-clipboard';


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
	  	visible: false,
	  	prepay: false,
	  	prizes: [],
		referralByDate: [],
	  	rangePickerValue: getTimeDistance('year'),
	};


	console.log(getUserPaymentInfo());
	console.log(getUserModal())
	if (getUserModal() === undefined){
		this.state.visible = true;
	}
	const { dispatch } = this.props;
	
	// Should get the email from local storage instead
	const userEmail = getUserEmail();
	if (userEmail === undefined){ 
	  	dispatch(routerRedux.push('/user/register'))
	}

	// const { dispatch } = this.props;
	// const userEmail = getUserEmail();
	setTimeout(()=>{
		dispatch({
			type: 'user/latestUsers',
			payload:{
			email: userEmail,
			},
		});
	}, 200)
	
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

  async componentWillReceiveProps(nextProps){
	// console.log(nextProps);
	const { user } = nextProps;
	if(user){
		const referralCounts = await this.setReferralStates(user);
		this.setPrizeOptions(user, referralCounts);
	}
	
  }

  setPrizeOptions(prizes, refCounts) {
	// console.log(prizes);
	// console.log(refCounts);
	const { currentUser } = prizes;
	const { options } = currentUser;
	
	const prizeList = [];

	
	options.first.forEach((prize) => {
		let overPrize = false;
		if (refCounts.r1 >= prize.number ) {
			overPrize=true;
		}
		prizeList.push({degree: "1st", over:overPrize, ...prize});
	});
	options.second.forEach((prize) => {
		let overPrize = false;
		if (refCounts.r2 >= prize.number ) {
			overPrize=true;
		}
		// prizeList.push({degree: "1st", over:overPrize, ...prize});
		prizeList.push({degree: "2nd", over:overPrize,...prize});
	});
	options.third.forEach((prize) => {
		let overPrize = false;
		if (refCounts.r2 >= prize.number ) {
			overPrize=true;
		}
		prizeList.push({degree: "3rd", over:overPrize, ...prize});
	});
	
	this.setState({prizes: prizeList});
  }

	setReferralByDateInState(occuranceObject){
	const refByDateList = [];
	
	const convertedTime = convertDateTime((Date.now()/1000));
	
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

	const greaterthanzero = (refByDateList > 0);
		// Check the convert the latest date into the format we need
		if (!isThere && greaterthanzero){
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
	// console.log(user['referral_hash']);
	const protocol = window.location.protocol;
	const slashes = protocol.concat("//");
	const host = slashes.concat(window.location.host);
	const ref = host.concat("/#/user/register?ref=")
	const rh = ref.concat(user.referral_hash)
	
	console.log(rh);
	// console.log(window.location.host+"/ref="+user['referral_hash']);
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
			refHash: rh,
	  	});
		return {
			r1: referred.l1.count,
			r2: referred.l2.count,
			r3: referred.l3.count,
		}
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
		this.setState({
			visible: false,
		});
	}

  handlePrepayOk = (e) => {
	this.setState({
	  prepay: false,
	});
  }

  handlePrepayCancel = (e) => {
	this.setState({
	  prepay: false,
	});
  }

  handleCancel = (e) => {
	this.setState({
	  visible: false,
	});
	// Set that the modal was closed before
	setUserModal(true);

  }


  dismissPrepay = (e) => {
	this.setState({
	  prepay: false,
	})
  }

  openPayment = () => {
	this.setState({
	  prepay: true,
	});
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


  renderActivities() {
	const {referralList} = this.state;
	if (referralList.length === 0){
		return (
			<div style={{height:"27rem"}}>
				<p style={{textAlign: 'center', padding:'7rem'}}> No Referral invites yet ...</p>
			</div>        
		)
	} 
	return referralList.map(item => {
	  return (
		<List.Item key={item.email}>
			<List.Item.Meta
				avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
				title={
				<span>
					<a className={styles.username} style={{marginRight:10}}>{item.email}</a>
					&nbsp;
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

  renderPopover(number, degree){
	return (
	  <div>
		<p>You need to have at least <strong>{number}</strong> referrals for this in the <strong> {degree} </strong> level</p>
	  </div>
	);
  }



  render() {
	const { currentTabKey, prepay, visible, totalCount, first, second, thrid } = this.state;
	const { chart, loading } = this.props;
	const {
	  offlineData,
	  offlineChartData,
	} = chart;


	const degrees = {
		'1st': first, 
		'2nd': second,
		'3rd': thrid,
	}

	const data01 = [{name: 'Group A', value: 2400}, {name: 'Group B', value: 4567},
				  {name: 'Group C', value: 1398}, {name: 'Group D', value: 9800},
				  {name: 'Group E', value: 3908}, {name: 'Group F', value: 4800}];

	const dataColors = ['#47ad5e', '#b97bd8', '#229954', '#56d8c4', '#28b463', '#3dcc90', '#FFD700', '#ADFF2F', '#00FF7F', '#20B2AA', '#66CDAA', '#6495ED', '#40E0D0' ];

	const {
	  activitiesLoading,
	  // chart: { radarData },
	} = this.props;



	const benefitStyleSuccess = {
	  width: '33%',
	  textAlign: 'center',
	  borderBottom: "5px solid #2aaf3c",
	  minHeight: '10vh',
	};

	// Get some sort of data here
	// Convert user information into timeseries
	return (
	  <Fragment >
		  <Modal
			title="Funguana's Prelaunch Program"
			visible={visible}
			onOk={this.handleOk}
			onCancel={this.handleCancel}
			width="60%"
			maskClosable={false}
			footer={null}
			closable={false}
		  >	
			<Introductions close={this.handleCancel} />
		  </Modal>


			{/*
			<Modal
			title="Buy your first month early"
			visible={prepay}
			onOk={this.handlePrepayOk}
			onCancel={this.handlePrepayCancel}
			width="60%"
			maskClosable={true}
			footer={null}
		  >	
			 <div style={{padding:'1.5rem'}} >
			  <Card
				bordered={false}
				className={styles.activeCard}
			  >
				<Row gutter={16}>
				  <Col xl={8}  lg={24} md={24} sm={24} xs={24} style={{padding:'0.4rem'}}>
					<Card.Grid className={styles.prepurchaseGrid}>
					  <h5 style={{textAlign:"center"}}>Package Name</h5>
					  <h2 style={{textAlign:"center"}}>$25.00</h2>
					  <p  style= {{textAlign:"center"}}>This is the description of the package you get</p>
					  <p  style= {{textAlign:"center"}}>Incentive 1</p>
					  <p  style= {{textAlign:"center"}}>Incentive 2</p>
					  <p  style= {{textAlign:"center"}}>Incentive 3</p>
					  <p  style= {{textAlign:"center"}}>Incentive 4</p>
					  <Button>Buy</Button>
					</Card.Grid>
				  </Col>
				  <Col xl={8}  lg={24} md={24} sm={24} xs={24} style={{padding:'0.4rem'}}>
					<Card.Grid className={styles.prepurchaseGrid}>
					  <h5 style={{textAlign:"center"}}>Package Name</h5>
					  <h2 style={{textAlign:"center"}}>$40.00</h2>
					  <p  style= {{textAlign:"center"}}>This is the description of the package you get</p>
					  <p  style= {{textAlign:"center"}}>Incentive 1</p>
					  <p  style= {{textAlign:"center"}}>Incentive 2</p>
					  <p  style= {{textAlign:"center"}}>Incentive 3</p>
					  <p  style= {{textAlign:"center"}}>Incentive 4</p>
					  <Button>Buy</Button>
					</Card.Grid>
				  </Col>

				  <Col xl={8}  lg={24} md={24} sm={24} xs={24} style={{padding:'0.4rem'}}>
					<Card.Grid className={styles.prepurchaseGrid}>
					  <h5 style={{textAlign:"center"}}>Package Name</h5>
					  <h2 style={{textAlign:"center"}}>$50.00</h2>
					  <p  style= {{textAlign:"center"}}>This is the description of the package you get</p>
					  <p  style= {{textAlign:"center"}}>Incentive 1</p>
					  <p  style= {{textAlign:"center"}}>Incentive 2</p>
					  <p  style= {{textAlign:"center"}}>Incentive 3</p>
					  <p  style= {{textAlign:"center"}}>Incentive 4</p>
					  <Button>Buy</Button>
					</Card.Grid>
				  </Col>
				  
				  
				  
				</Row>
				
			  </Card>
			  
			</ div>
			
		  </Modal> */}

		  {/* <Alert 
			message="Buy Early Access" 
			description="You can buy both early access and a lifetime discount if you buy your first month early" 
			type="success" 
			closeText="I'm in!" 
			showIcon 
			afterClose={this.openPayment}
		  /> */}

		
		<div style={{textAlign: 'right', paddingTop:'1.2rem'}}>
			<CopyToClipboard text={this.state.refHash} onCopy={() => message.success("Copied referral link! Make them invite referrals!")}>
				<span><a>{this.state.refHash}</a></span>
			</CopyToClipboard>
		</div>
		<Card
		  loading={loading}
		  className={styles.offlineCard}
		  bordered={false}
		  title="Referrals Over Time"
		  bodyStyle={{ padding: '0 0 32px 0' , height: "27rem" }}
		  style={{ marginTop: 32}}
		  
		>
		  {(this.state.referralByDate.length) > 0 ? (
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
		  ): (
			<p style={{textAlign:'center', padding: '8rem'}}> No Refers Yet ... Don't Give Up!</p>
		  )}
			
		  
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
				<p>{totalCount}</p>
			  </Col>
			  <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{textAlign:"center"}}>
				<h4>1st</h4>
				<p>{first}</p>
			  </Col>
			  <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{textAlign:"center"}}>
				<h4>2nd</h4>
				<p>{second}</p>
			  </Col>
			  <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{textAlign:"center"}}>
				<h4>3rd</h4>
				<p>{thrid}</p>
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
					dataSource={this.state.prizes}
					renderItem={item => (
					<div>
						{item.over ? (
						
						<Card.Grid style={benefitStyleSuccess} >
							<h5 style={{textAlign:"center"}}>{item.degree} Level</h5>
							<h2 style={{textAlign:"center"}}>{item.number} People Referred</h2>
							<p style= {{textAlign:"center"}}>{item.description}</p>
							<h3 style={{textAlign:"center"}}>Progress So Far: {((degrees[item.degree]/item.number)*100).toFixed(2)}%</h3>
						</Card.Grid>
						): (
							<Popover content={this.renderPopover(item.number, item.degree)} title="Requirements">
							
							<Card.Grid className={styles.prizeGrid}>
								<h5 style={{textAlign:"center"}}>{item.degree} Level</h5>
								<h2 style={{textAlign:"center"}}>{item.number} People Referred</h2>
								<p style= {{textAlign:"center"}}>{item.description}</p>
								<h3 style={{textAlign:"center"}}>Progress So Far: {((degrees[item.degree]/item.number)*100).toFixed(2)}%</h3>
							</Card.Grid>
							</Popover>
						)

						}
						
					</div>
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
