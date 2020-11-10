/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Body, Container, H1, H3, Header, Icon, Left, Right, Title } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import NoOrders from '../../components/saved/NoOrders';
import NoHistory from '../../components/saved/NoHistory';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Loader from '../../components/Loader'
import { getItemID, getRenterOrder, getUSERID } from '../../services/service'
export default class MyOrders extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMessages: true,
      showNotifications:false,
      segmentTab:["Current Orders", "Order History"],
      selectedIndex:0,
      completedArray:[],
      loading: false,
      notcompletedArray:[]
    }
}

async componentDidMount(){
  this.apiCall()
  // this.setState({
  //   loading: true
  // })
  // const completed = []
  // const completedNot = []
  // const userID = await this.getApi()
  // if(userID){
  //   const getOrders = await this.getOrders(userID)
  //   if(getOrders){
  //     const notCompleted = getOrders.filter((item)=>{
  //       if(item.isCompleted === false){
  //         completedNot.push(item)
  //       }
  //     })
  //     const Completed = getOrders.filter((item)=>{
  //       if(item.isCompleted === true){
  //         completed.push(item)
  //       }
  //     })
  //     if(completedNot.length > 0 || completed.length > 0){
  //       this.setState({
  //         completedArray : completed,
  //         loading: false,
  //         notcompletedArray : completedNot
  //       })
  //     } else {
  //       this.setState({
  //         loading: false
  //       })
  //     }
  //   } else{
  //     this.setState({
  //       loading: false
  //     })
  //   }
  // }
}

apiCall = async() =>{
  const userID = getUSERID()
  const array = []
  userID.then(response =>{
    const getOrders = getRenterOrder(response)
    getOrders.then(res =>{
      res.map((item, index)=>{
        const getItems = getItemID(item.itemID)
        getItems.then(result=>{
          result.map((i, ind)=>{
            if(item.itemID === i.id){
              if(item.isCompleted === false){
                i.price1 = item.totalPrice
                i.supplierID = item.supplierID
                i.startDate = item.startDate
                i.renterID = item.renterID
                i.orderID = item.orderID
                i.isCompleted = item.isCompleted
                i.endDate = item.endDate
                this.setState({
                  notcompletedArray:[i,...this.state.notcompletedArray]
                })
              } else {
                i.price1 = item.totalPrice
                i.supplierID = item.supplierID
                i.startDate = item.startDate
                i.renterID = item.renterID
                i.orderID = item.orderID
                i.isCompleted = item.isCompleted
                i.endDate = item.endDate
                this.setState({
                  completedArray:[i,...this.state.completedArray]
                })
              }
            }
          })
        })
      })
    })
  })
}

async componentWillReceiveProps(nextProps){
}

getApi = async() =>{
  return new Promise((resolve, reject)=>{
    auth().onAuthStateChanged(user => {
      if (!user) {
      } else {
        resolve(user.uid)
      }
    })
  })
}

getOrders = async(userID) =>{
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('Orders').where('renterID','==',userID).get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        result.push(documentSnapshot.data())
      });
      resolve(result)
    });
  })
}

handleIndexChange = (values) =>{
  this.setState({
    selectedIndex:values,
    showMessages: !this.state.showMessages,
    showNotifications: !this.state.showNotifications
  })
}

currentOrders = () =>{
    return(
      <NoOrders onPress={this.displayDetail} listing={this.state.notcompletedArray} />
    )
}

orderHistory = () =>{
  return(
    <NoHistory onPress={this.displayDetail} listing={this.state.completedArray} />
  )
}

  displayDetail = (data) =>{
    this.props.navigation.navigate('OrderListing',{
      result: data
    })
  }

  render() {
    return (
      <Container>
        <Header transparent>
          <Left>
            <Icon onPress={() => this.props.navigation.goBack()} type="AntDesign" name="arrowleft" />
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
            this.currentOrders()
          :
          null
        }
        {
          this.state.showNotifications
          ?
            this.orderHistory()
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
