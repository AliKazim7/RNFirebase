import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  // Image,
  TouchableOpacity, FlatList, RefreshControl, TouchableHighlight
} from 'react-native';
import { Body, Container, H1, H3, Header, Icon, Left, List, ListItem,Text, Right, Title,Card, CardItem,H2 } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import NoMessages from '../screen/InboxScreen/NoMessages';
import NotificationNot from '../screen/InboxScreen/NotifcationNot';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { GiftedChat } from 'react-native-gifted-chat';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { getItemDetail, getRenterChat,getSupplierChat, getUSERID } from '../services/service';

export default class InboxContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMessages: true,
      messages:[],
      allChats:[],
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
  const result = []
  const userID = getUSERID()
  userID.then(response =>{
    const renterChats = getRenterChat(response)
    renterChats.then(reChat =>{
      console.log("renter chats come here", reChat)
      if(reChat.length > 0){
        reChat.forEach(element => {
          result.push(element)
        });
      }
      const supplierchats = getSupplierChat(response)
      supplierchats.then(supChat =>{
        console.log("supplier chats come here", supChat)
        if(reChat.length > 0){
          supChat.forEach(element => {
            result.push(element)
          });
        }
        if(result.length > 0){
        result.forEach((item,index) =>{
          console.log("supplier chats come here", result)
          const getDetail = getItemDetail(item.itemID)
          getDetail.then(res =>{
            console.log("supplier chats come here", res)
            if(item.itemID === res.id){
              result[index].title = res.title
              result[index].type = res.type
            }
            this.setState({
              allChats: result,
              loading: false
            })
          })
        })
        } else {
          this.setState({
            allChats: result,
            loading: false
          })
        }
      })
    })
  })
}

componentWillUnmount(){
}

componentWillReceiveProps(nextProps){
  if(nextProps.route.params.userID){
    this.apiCall()
  }

}

showSupplier = () =>{
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

getAllChats = () =>{
  return(
    <ScrollView>
      {
        this.state.allChats
        ?
        this.state.allChats.map((item,index)=>(
          <List key={index}>
            <ListItem>
              <Left>
                <Body>
                  <Text>
                    {item.title}
                  </Text>
                  <Text note>
                    {item.type}
                  </Text>
                </Body>
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
    this.props.navigation.navigate("ChatBubble",{
      listing: value
    })
  }

  chatbubleRent = value =>{
    this.props.navigation.navigate("ChatBubble",{
      listing: value
    })
  }

  onRefresh = () =>{
    this.setState({
      loading: false
    })
    this.apiCall()
  }

  render() {
    return (
      <Container>
        <ScrollView refreshControl={
          <RefreshControl onRefresh={this.onRefresh} refreshing={this.state.loading} />
        }>
          {this.state.allChats.length > 0 && this.state.allChats
          ? 
            <H1 
              style={{marginTop:hp('5%'), marginLeft:wp('5%')}}>
              Inbox
            </H1> 
          : 
            <H1 
              style={{marginTop:hp('5%'), marginLeft:wp('5%')}}>
              Inbox
            </H1>
          }
          {
          this.state.allChats.length > 0 && this.state.allChats  
          ? 
            <CardView 
              onRefresh={this.onRefresh} 
              loading={this.state.loading} 
              navigation={this.chatbubleRent} 
              goBack={this.goBack} 
              result={this.state.allChats} 
            /> 
          : 
            <NoMessages />
          }
        </ScrollView>
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
    flex:1
    // backgroundColor: colors.white,
  },
  contentType:{
    marginTop:5,
    fontSize:14
  },
  CardStyle:{
    borderRadius:10,
    flex:1,
    width:wp('100%'),
    // marginLeft:wp('5%'), 
    borderWidth:1, 
    borderColor:'white',
    backgroundColor:'red',
    marginTop:50
  },
  footer: {
  	// width: '60%',
  	// height: 80,
  	// bottom: 0,
  	// borderTopWidth: 1,
  	// borderTopColor: colors.gray05,
  	paddingLeft: 20,
  	paddingRight: 20,
  },
  findHomesButton: {
  	paddingTop: 15,
  	paddingBottom: 15,
  	marginTop: 16,
  	borderRadius: 3,
  	backgroundColor: colors.saagColor,
  },
  findHomesButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});

const CardView = (props) =>{
  const result = props.result
  return(
    <View style={{flex:1,marginTop:20}}>
      <FlatList
        data={result}
        refreshControl={
          <RefreshControl onRefresh={props.onRefresh} refreshing={props.loading} />
        }
        renderItem={({item, index})=>(
          <TouchableOpacity 
            onPress={() => props.navigation(item)} 
            key={index}
          >
            <List>
              <ListItem>
                <Left>
                  <Body>
                    <Text>
                      {item.title}
                    </Text>
                    <Text note>
                      {item.type}
                    </Text>
                  </Body>
                </Left>
                <Right>
                  <Icon type="FontAwesome" name="send-o" onPress={() => props.navigation(item)} />
                </Right>
              </ListItem>
            </List>
          </TouchableOpacity>
        )}
        />
    </View>
  )
}