/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Body, Container, H1, H3, Header, Left, Right, Title } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import NoMessages from '../screen/InboxScreen/NoMessages';
import NotificationNot from '../screen/InboxScreen/NotifcationNot';

export default class InboxContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMessages: true,
      segmentTab:["Messages", "Notifications"],
      selectedIndex:0
    }
}

handleIndexChange = (values) =>{
  this.setState({
    selectedIndex:values
  })
}

  render() {
    return (
      <Container>
        <Header transparent>
          <Left>
            <H3>Inbox</H3>
          </Left>
          <Body />
          <Right />
        </Header>
        <SegmentedControlTab
          borderRadius={0}
          tabsContainerStyle={{ height: 50, backgroundColor: '#F2F2F2',marginLeft:10, marginRight:10 }}
          tabStyle={{ backgroundColor: 'white',fontSize:16, borderWidth: 0, borderColor: 'transparent', alignItems:'baseline' }}
          activeTabStyle={{ backgroundColor: 'white',borderBottomColor:'green', marginBottom: 2, borderBottomWidth:2, textAlign:'left' }}
          tabTextStyle={{ color: 'black', }}
          activeTabTextStyle={{ color: 'black' }}
          values={this.state.segmentTab}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
        />
        {
          this.state.showMessages
          ? 
          <NoMessages />
          :
          null
        }
        {
          this.state.showNotifications
          ?
          <NotificationNot />
          :
          null
        }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    padding: 50,
  },
});
