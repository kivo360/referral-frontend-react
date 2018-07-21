// import React, { Component, Fragment } from 'react';
import React, { PureComponent, Component } from 'react';

import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, Steps, Button, message } from 'antd';
import { Part1, Part2, Part3, Part4, Part5, Part6, Part7, Part8 } from './Part1';

const Step = Steps.Step;





export default class Instructions extends PureComponent {
    constructor(props) {
        super(props);
        this.steps = [{
            title: 'Hello',
            content: <Part1 />,
        }, {
            title: 'Spread Some Love',
            content: <Part2 />,
        }, {
            title: 'Refer Your Friends',
            content: <Part3 />,
        }, {
            title: 'Rewards Coming Too',
            content: <Part4 />,
        }, {
            title: 'There\'s Levels',
            content: <Part5 />,
        },
        {
            title: 'Check Prizes',
            content: <Part6 />,
        },
        {
            title: 'Buy Your First Month Early',
            content: <Part8 />,
        },
        {
            title: 'Good Luck',
            content: <Part7 />,
        },
    ];
          
        this.state = {
            current: 0,
        };
    }

    next() {
        const newCurrent = this.state.current + 1;
        this.setState({ current: newCurrent });
    }

    prev() {
        const newCurrent = this.state.current - 1;
        this.setState({ current: newCurrent });
    }
    
    render(){
        const {current} = this.state;
        const containerPadding = {
            padding: '1.5rem',
        }

        // Get the close function from props
        // const { close } = this.props;
        return (
            <div style={containerPadding}>
                {/* <Steps current={current}>
                    {this.steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className={styles.stepsContent} style={containerPadding}>{this.steps[current].content}</div>
                <div className={styles.stepsAction}>
                    {
                        current < this.steps.length - 1
                        && <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    {
                        current === this.steps.length - 1
                        && <Button type="primary" onClick={() => close()}>Done</Button>
                    }
                    {
                        current > 0 && current !== this.steps.length - 1
                        && (
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                Previous
                            </Button>
                        )
                    }
                </div>

                Content {this.state.openKeys} */}
            </div>
        )
    }
}

