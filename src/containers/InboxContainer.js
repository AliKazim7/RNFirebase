import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet, ScrollView
} from 'react-native';
import { Body, Container, H1, H3, Header, Icon, Left, List, ListItem, Right, Title } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import NoMessages from '../screen/InboxScreen/NoMessages';
import NotificationNot from '../screen/InboxScreen/NotifcationNot';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { GiftedChat } from 'react-native-gifted-chat';
import Loader from '../components/Loader';
import colors from '../styles/colors';

export default class InboxContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMessages: true,
      messages:[],
      selectedIndex:0,
      renterChat:[],
      supplierChat:[],
      segmentTab:["Supplier Chat", "Renter Chat"],
      loading: false,
      userID:''
    }
}

async componentDidMount(){
  this.apiCall()
}

apiCall = async() =>{
  this.setState({
    loading: true
  })
  const userID = await this.getUSERID()
  if(userID){
    const renterChat = await this.getRenterID(userID)
    const supplierChat = await this.getSupplierID(userID)
    if(renterChat.length > 0){
      this.setState({
        userID: userID,
        renterChat: renterChat,
        selectedIndex:1,
        loading: false
      })
    } else {
      this.setState({
        userID: userID,
        supplierChat: supplierChat,
        selectedIndex:0,
        loading: false
      })
    }
  }
}

componentWillUnmount(){
  console.log("wil unmount")
}

componentWillReceiveProps(nextProps){
  console.log("nextProps", nextProps.route.params.userID)
  if(nextProps.route.params.userID){
    this.apiCall()
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

handleIndexChange = (values) =>{
  console.log(values)
  this.setState({
    selectedIndex:values
  })
}

showSupplier = () =>{
  console.log("listitem", this.state.supplierChat)
  return(
    <ScrollView style={{marginTop:30}}>
      {
        this.state.supplierChat
        ?
        this.state.supplierChat.map((item,index)=>(
          <List key={index}>
            <ListItem onPress={() => this.chatbuble(item)}>
              <Left>
                <Text>
                  {item.title}
                </Text>
              </Left>
              <Right>
                <Icon type="FontAwesome" name="send-o" onPress={() => this.chatbuble(item)} />
              </Right>
            </ListItem>
          </List>
        ))
        :
        <NoMessages />
      }
    </ScrollView>
  )  
}

showRenter = () =>{
  console.log("listitem", this.state.renterChat)
  return(
    <ScrollView style={{marginTop:30}}>
      {
        this.state.renterChat
        ?
        this.state.renterChat.map((item,index)=>(
          <List key={index}>
            <ListItem>
              <Left>
                <Text>
                  {item.title}
                </Text>
              </Left>
              <Right>
                <Icon type="FontAwesome" name="send-o" onPress={() => this.chatbubleRent(item)} />
              </Right>
            </ListItem>
          </List>
            ))
        :
        <NotificationNot />
      }
    </ScrollView>
  )  
}

  chatbuble = value =>{
    console.log("value", value)
    this.props.navigation.navigate("ChatBubble",{
      listing: value
    })
  }

  chatbubleRent = value =>{
    console.log("value", value)
    this.props.navigation.navigate("RenterChat",{
      listing: value
    })
  }

  render() {
    console.log("supplier chat and renter chat", this.state.supplierChat, this.state.renterChat)
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
          activeTabStyle={{ backgroundColor: 'white',borderBottomColor:colors.saagColor, marginBottom: 2, borderBottomWidth:2, textAlign:'left' }}
          tabTextStyle={{ color: 'black', }}
          activeTabTextStyle={{ color: 'black' }}
          values={this.state.segmentTab}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
        />
        {
          this.state.supplierChat.length > 0
          ? 
            this.showSupplier() 
          :
          null
        }
        {
          this.state.renterChat.length > 0
          ?
          // <NotificationNot />
            this.showRenter()
          :
          null
        }
        <Loader
        modalVisible={this.state.loading}
        animationType="fade"
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