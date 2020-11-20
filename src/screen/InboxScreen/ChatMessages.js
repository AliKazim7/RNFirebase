/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet, ScrollView, RefreshControl
} from 'react-native';
import { Body, Container, H1, H3, Header, Icon, Left, Right, Title } from 'native-base';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { GiftedChat } from 'react-native-gifted-chat';
import { getAllMessages, getUSERID } from '../../services/service'

export default class ChatMessages extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMessages: true,
      messages:[],
      existedData:[],
      lisitng:[],
      segmentTab:["Messages", "Notifications"],
      userID:'',
      supplierID:'',
      listItems:''
    }
 }

async componentDidMount(){
  this.apiCall()
}

apiCall = async() =>{
  const userid = getUSERID()
  userid.then(USERID =>{
    const getMessages = getAllMessages(this.props.route.params.listing.ChatID)
    getMessages.then(response=>{
      console.log("this.props ", response,USERID)
      const user ={
        _id: USERID
      }
      this.setState({
        messages:response.messages,
        userID: user,
        loading: false,
        lisitng: this.props.route.params.listing
      })
    })
  })
  // const userID = await this.getUSERID()
  // const getUSER = await this.getUSERDATA(userID)
  // if(userID && getUSER){
  //     const getMessages = this.getMessages(this.props.route.params.listing.messages)
  //     const user ={
  //       _id: getUSER.uid,
  //     }
  //   this.setState({
  //     userID: user,
  //     lisitng: this.props.route.params.listing,
  //     loading: false
  //   })
  // }
}

getUSERDATA = userID =>{
    let result = []
    return new Promise((resolve, reject)=>{
      firestore()
        .collection('Users')
        .where('uid', '==', userID)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            result.push(documentSnapshot.data())
          });
          resolve(result[0])
        });
    })
}

getMessages = (ID) =>{
    this.setState({
      messages:ID
    })
}

docID = async() =>{
    const { lisitng } = this.state
    return new Promise((resolve, reject)=>{
      firestore()
      .collection('Chats')
      .where('ChatID','==', this.state.lisitng.ChatID)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
        resolve(doc)
      });
    })
  })
}

sendDATA = async (value) =>{
  const docID = await this.docID()
    if(docID){
        var documentID = docID.id;
        var previous = docID.data().messages
        previous.push(value[0])
        console.log("documentID", previous)
        firestore().collection('Chats').doc(documentID).update({
          messages: previous
        })
        .then((response)=>{
          this.setState({
            messages: previous
          })
      })
    }
}

onRefresh = () =>{
  this.setState({
    loading:true
  })
  this.apiCall()
}

  render() {
    return (
      <Container>
        <Header  transparent>
            <Left>
              <Icon type="AntDesign" name="arrowleft" onPress={() => this.props.navigation.navigate('InboxTab',{userID: this.state.userID})} />
            </Left>
            <Body>
              <Title>
                {this.state.lisitng.title}
              </Title>
            </Body>
          <Right />
        </Header>
      <GiftedChat
        messages={this.state.messages}
        user={this.state.userID}
        onSend={newMessage => this.sendDATA(newMessage)}
      />
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
