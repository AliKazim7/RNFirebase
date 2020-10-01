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

export default class Messages extends Component {
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
  if(userID){
    const user ={
      _id: getUSER.uid,
      name: getUSER.firstName,
    }
    this.setState({
      userID: user,
      lisitng: this.props.route.params.listing,
      supplierID: this.props.route.params.userDetails.uid
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

docID = async(userID, supplierID, itemID) =>{
    console.log("userID, supplierID, itemID",userID, supplierID, itemID)
    return new Promise((resolve, reject)=>{
        firestore().collection('Chats').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.data());
                if(doc.data().renterID === userID && doc.data().supplierID === supplierID && doc.data().itemID === itemID){
                    console.log("docs", doc)
                    resolve(doc)
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
  const DataCheck = await this.checkData()
  const ID = Math.random()
  console.log("DataCheck",DataCheck,this.state.userID._id)
    if(DataCheck){
      const uploadData = await this.uploadData(ID, value)
      if(uploadData){
        const getDoc = await this.getDoc(ID)
        if(getDoc){
          firestore().collection('Chats').doc(getDoc).update({
            ChatID: getDoc
        })
        .then((response)=>{
            console.log("Updated", response)
            this.setState({
                messages: value
            })
        })
        }
      }
    } else {
        const docID = await this.docID(this.state.userID,supplierID,lisitng.id)
            if(docID){
                var documentID = docID.id;
                var previous = docID.data().messages
                previous.splice(0,0,value[0])
            }
            console.log("DATA check", documentID, previous, value)
        firestore().collection('Chats').doc(documentID).update({
            messages: previous
        })
        .then((response)=>{
            console.log("Updated", response)
            this.setState({
                messages: previous
            })
        })
    }
}

uploadData = async(ID, value) =>{
  const { lisitng, supplierID } = this.state
  return new Promise((resolve, reject)=>{
    firestore().collection("Chats")
        .add({
          supplierID: supplierID,
          itemID: lisitng.id,
          title: lisitng.title,
          messages:value,
          ChatID: ID,
          listing: lisitng,
          renterID: this.state.userID._id
        })
        .then((response)=>{
          console.log("Updated", response)
        //   this.setState({
        //     messages:[...this.state.messages, value[0]]
        // })
        resolve(true)
      })
  })
}

getDoc = async(ID) =>{
  return new Promise((resolve, reject)=>{
    firestore().collection('Chats').where('ChatID','==', ID)
    .get()
    .then(querySnapshot =>{
      querySnapshot.docs.map((item)=>{
          resolve(item.id)
      })
    })
  })
}

checkData = async() =>{
    const { lisitng, supplierID } = this.state
    return new Promise((resolve, reject)=>{
        firestore().collection('Chats')
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          if(data.length > 0){
            const result = data.filter((item,index)=>{
              if(item.renterID === this.state.userID && item.supplierID === supplierID && item.itemID === lisitng.id ){
                resolve(false)
              } else {
                resolve(true)
              }
            })
          } else {
            resolve(true)
          }
       });
    })
}

  render() {
    console.log("here", this.state.userID)
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
