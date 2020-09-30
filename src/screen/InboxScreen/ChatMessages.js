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
import { Body, Container, H1, H3, Header, Icon, Left, Right, Title } from 'native-base';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { GiftedChat } from 'react-native-gifted-chat';

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
  const userID = await this.getUSERID()
  const getUSER = await this.getUSERDATA(userID)

  console.log("props messages",  getUSER)
  if(userID && getUSER){
      const getMessages = this.getMessages(this.props.route.params.listing.messages)
      console.log("props messages", this.props.route.params.listing, userID)
      const user ={
        _id: getUSER.uid,
        name: getUSER.firstName,
      }
    this.setState({
      userID: user,
      lisitng: this.props.route.params.listing,
    })
  }
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

getMessages = (previousMessages) =>{
    console.log("messages",previousMessages)
    // const { messages } = this.state
    this.setState({
        messages: previousMessages
    })
    // const newMessage = []
    // this.state.messages(previousMessages => GiftedChat.append(
    //     previousMessages, messages
    // ))
    // this.setState(messages(previousMessages => GiftedChat.append(
    //     previousMessages, newMessage
    // )))
    // this.setState({
    //     messages:(previousMessages => GiftedChat.append(previousMessages, newMessage))
    // })
}

docID = async() =>{
    console.log("userID, supplierID, itemID",this.state.lisitng)
    return new Promise((resolve, reject)=>{
        firestore().collection('Chats').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.data());
                if(doc.data().renterID === userID && doc.data().supplierID === supplierID && doc.data().itemID === itemID){
                    console.log("docs", doc)
                    resolve(doc.id)
                } else {
                    resolve(false)
                }
            });
        })
    })
}

getUSERID = async ()=>{
  return new Promise((resolve, reject)=>{
    auth().onAuthStateChanged(user => {
      if (!user) {
      } else {
        // this.setState({
        //   userID: user.uid
        // })
        resolve(user.uid)
      }
    })
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


sendDATA = async (value) =>{
  const { lisitng, supplierID } = this.state
    // const messages = this.state.messages
    // messages.splice(0,0,value[0])
    //     console.log("messages here", messages)
    //     this.setState({
    //         messages: messages
    //     })
      const docID = await this.docID()
            // if(docID){
            //     var documentID = docID.id;
            //     var previous = docID.data().messages
            //     previous.splice(0,0,value[0])
            // }
            console.log("DATA check", docID)
        // firestore().collection('Chats').doc(documentID).update({
        //     messages: previous
        // })
        // .then((response)=>{
        //     console.log("Updated", response)
        //     this.setState({
        //         messages: previous
        //     })
        // })
}


  render() {
      console.log("user id", this.state.userID)
    return (
      <Container>
          <Header transparent>
              <Left>
                  <Icon type="AntDesign" name="arrowleft" onPress={() => this.props.navigation.goBack()} />
              </Left>
              <Body />
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
