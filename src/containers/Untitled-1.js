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
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { GiftedChat } from 'react-native-gifted-chat';
import Fire from '../components/firebase/FirebaseSvc';

export default class InboxContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMessages: true,
      messages:[],
      renterChat:[],
      supplierChat:[],
      segmentTab:["Messages", "Notifications"],
      userID:''
    }
}

async componentDidMount(){
  // Fire.shared.on(message=>
  //   this.setState(previousState => ({
  //     messages: GiftedChat.append(previousState.messages, message),
  //   }))
  // )
  this.setState({
    loading: true
  })
  const userID = await this.getUSERID()
  if(userID){
    const renterChat = await this.getRenterID(userID)
    const supplierChat = await this.getSupplierID(userID)
    this.setState({
      userID: userID,
      renterChat: renterChat,
      supplierChat: supplierChat,
      loading: false
    })
  }
}

getUSERID = async ()=>{
  return new Promise((resolve, reject)=>{
    auth().onAuthStateChanged(user => {
      if (!user) {
      } else {
        resolve(user.uid)
      }
    })
  })
}

getRenterID = async (ID)=>{
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('Chats').where('renterID','==',ID).get()
    .then(querySnapshot => {
        if(querySnapshot.docs.length > 0){
          querySnapshot.forEach(documentSnapshot => {
            result.push(documentSnapshot.data())
          });
          resolve(result)
        } else{
          resolve(result)
        }
    });
  })
}

getSupplierID = async (ID)=>{
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('Chats').where('supplierID','==',ID).get()
    .then(querySnapshot => {
        if(querySnapshot.docs.length > 0){
          querySnapshot.forEach(documentSnapshot => {
            result.push(documentSnapshot.data())
          });
          resolve(result)
        } else{
          resolve(result)
        }
    });
  })
}

componentWillUnmount() {
  // Fire.shared.off();
}

handleIndexChange = (values) =>{
  this.setState({
    selectedIndex:values
  })
}


sendDATA = (value) =>{
  console.log(value)
}

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        user={this.state.userID}
        onSend={newMessage => this.sendDATA(newMessage)}
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
