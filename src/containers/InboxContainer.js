/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet, ScrollView
} from 'react-native';
import { Body, Container, H1, H3, Header, Left, Right, Title } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import NoMessages from '../screen/InboxScreen/NoMessages';
import NotificationNot from '../screen/InboxScreen/NotifcationNot';
import { GiftedChat } from 'react-native-gifted-chat';

export default class InboxContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMessages: true,
      messages:[],
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
      <GiftedChat
        messages={this.state.messages}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    padding: 50,
  },
});
