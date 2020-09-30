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
  if(userID){
    this.setState({
      userID: userID,
      lisitng: this.props.route.params.listing,
      supplierID: this.props.route.params.userDetails.uid
    })
  }
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
  console.log(value)
  const DataCheck = await this.checkData()
    if(DataCheck){
        // firestore().collection("Chats").add({
    //     supplierID: supplierID,
    //     itemID: lisitng.id,
    //     title: lisitng.title,
    //     messages:value,
    //     listing: lisitng,
    //     renterID: this.state.userID
    // }).then((response)=>{
    //     console.log("Updated", response)
    //     this.setState({
    //         messages:[...this.state.messages, value[0]]
    //     })
    // })
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

checkData = async() =>{
    const { lisitng, supplierID } = this.state
    return new Promise((resolve, reject)=>{
        firestore().collection('Chats').get()
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
        }
      });
    })
}

  render() {
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
