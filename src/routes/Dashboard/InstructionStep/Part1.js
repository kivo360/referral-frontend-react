// import React, { Component, Fragment } from 'react';
import React, { PureComponent, Component } from 'react';

import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, Steps, Button, message } from 'antd';
import classNames from 'classnames';
import affection from './Images/affection.png';
import honest from './Images/honest.png';
import connection from './Images/connection.png';
import coins from './Images/coins.png';
import friends from './Images/friends.png';
import safebox from './Images/safebox.png';
import moon from './Images/man-on-the-moon.png';
import bitcoin from './Images/bitcoin.png';

import styles from './Content.less';
const Step = Steps.Step;


export function Part1() {
//   const clsString = classNames(styles.result, className);
  return (
    <div>
      <h1>Hey Guys, I'm Joe N.</h1>
      <img src={honest} alt="Honest Guy" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
      <p style={{fontSize:16}}>I'm your tutorial guide for Funguana. I love crypto, and it's my hope that you will too! I'll be instructing you on our prelaunch campaign</p>
    </div>
  );
}


export function Part2() {
    //   const clsString = classNames(styles.result, className);
    return (
        <div>
            <h1>Spread Some Love</h1>
            <img src={affection} alt="Spread Love" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
            <p style={{fontSize:16}} >As we're perfecting our algorithm for you, spread the crypto love with our pre-launch program.</p>
        </div>
    );
}

    

export function Part3() {
    //   const clsString = classNames(styles.result, className);
    return (
        <div>
            <h1>Refer Friends</h1>
            <img src={connection} alt="Refer Friends" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
            <p style={{fontSize:16}}>You can refer your friends with the referral link on the page</p>
        </div>
    );
}

        
export function Part4() {
    //   const clsString = classNames(styles.result, className);
    return (
        <div>
            <h1>Get Prizes</h1>
            <img src={coins} alt="Get Prizes" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
            <p style={{fontSize:16}}>As you spread the love and wealth, you can get prizes for reaching certain people</p>
        </div>
    );
}

    
export function Part5() {
    //   const clsString = classNames(styles.result, className);
    return (
        <div>
            <h1>Refer In Levels</h1>
            <img src={friends} alt="Get Prizes" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
            <p style={{fontSize:16}}>Prizes are in levels. So you get different prizes for your friends, the friends they share it to and the friends your friend's friends share to.</p> 
        </div>
    );
}

export function Part6() {
    //   const clsString = classNames(styles.result, className);
    return (
        <div>
            <h1>Check Out Prizes</h1>
            <img src={safebox} alt="Get Prizes" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
            <p style={{fontSize:16}}>Check out the prizes below. You'll be notified by email as you hit them.</p>
        </div>
    );
}
        
                


export function Part7() {
    //   const clsString = classNames(styles.result, className);
    return (
        <div>
            <h1>Good Luck!!!</h1>
            <img src={moon} alt="Get Prizes" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
            <p style={{fontSize:16}}>Good luck on your funguana adventure. We'll see you on the moon as we take you there.</p>
        </div>
    );
}

export function Part8() {
    //   const clsString = classNames(styles.result, className);
    return (
        <div>
            <h1>Buy Early Access</h1>
            <img src={bitcoin} alt="Get Prizes" style={{width:"10vw", height:"10vw", padding:"1rem"}} />
            <p style={{fontSize:16}}>Buy early access to get extra benefit.</p>
        </div>
    );
}