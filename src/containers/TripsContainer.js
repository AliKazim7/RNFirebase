
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  // Image,
  TouchableOpacity, FlatList
} from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import NoLists from '../components/saved/NoList';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Loader from '../components/Loader';
import { Card, CardItem, H1, H2,
  Text,
  Thumbnail,Container } from 'native-base';
import colors from '../screen/styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import NoImage from '../components/explore/NoImage';
import headStyle from '../screen/styles/HeaderSetting';
export default class TripsContainer extends Component {
  constructor(props){
    super(props)
    this.state ={
        listing:[],
        loading: false
    }
  }

  async componentDidMount(){
    this.setState({
      loading: true
    })
    const userID = await this.getApi()
    if(userID){
      const getName = await this.getUSERDATA(userID)
      if(getName){
        const filterOrdered = await this.getOrder(userID)
        if(filterOrdered){
          const result = []
          getName.filter((item, index)=>{
            filterOrdered.filter((i, ind)=>{
              if(item.title === i.listItem.title){
                return (item.Ordered = true, item.renterID = i.renterID)
                // result.push(item)
              }
            })
          })
          this.setState({
            listing: getName,
            loading: false
          })
        }
      } else {
        this.setState({
          loading: false
        })
      }
    }
  }

  mergedList = (MainArray, orderArray) =>{
    return new Promise((resolve, reject)=>{
      MainArray.map((item, index)=>{
        orderArray.map((i, ind)=>{
          if(item.title === i.listItem.title){
            item.Ordered = true
            item.renterID = i.renterID
            resolve(item)
          }
        })
      })
    })
  }

  getOrder = value =>{
    const result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('Orders').where('supplierID','==', value)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // resolve(documentSnapshot.data())
          result.push(documentSnapshot.data())
        });
        resolve(result)
      })
    })
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

  getUSERDATA = async(userID) =>{
    let result = []
    return new Promise((resolve, reject)=>{
      firestore()
        .collection('ItemList')
        .where('userID', '==', userID)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            // resolve(documentSnapshot.data())
            result.push(documentSnapshot.data())
          });
          resolve(result)
        });
    })
  }

  navigationRoute = (value) =>{
  this.props.navigation.navigate('SelectList', {
    result: value
  })
  }

  render() {
    return (
      <Container>
        <Loader 
          modalVisible={this.state.loading}
          animationType="fade"
        />
        {this.state.listing.length > 0 && this.state.listing ? <H1 style={{marginTop:hp('5%'), marginLeft:wp('5%')}}>Listing</H1> : null}
        {this.state.listing.length > 0 && this.state.listing  ? <CardView navigation={this.navigationRoute} result={this.state.listing} /> : <NoLists />}
        
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
  }
});

const CardView = (props) =>{
  const result = props.result
  console.log("resultws here", result)
  return(
    <View style={{flex:1}}>
      <FlatList
        data={result}
        renderItem={({item, index})=>(
          <TouchableOpacity 
          onPress={() => props.navigation(item)} 
          key={index}
        >
          <Card>
            <CardItem cardBody>
              {/* <Image source={item.photo[0] && {uri:item.photo[0]}} resizeMode="cover" style={{flex:1, height:hp('40%')}} /> */}
              {
                item.photo !== undefined
                ?
                  <Image 
                    source={item.photo[0] && {uri:item.photo[0]}} 
                    indicator={ProgressBar} 
                    style={{
                      flex:1, height:hp('40%')
                    }}
                  />
                :
                  <NoImage />
              }
              {
                item.Ordered === true 
                ?
                <View style={headStyle.leftHeader1} >
                  <Text style={{color:'white'}}>Rented</Text>
                </View>
                :
                null
              }
            </CardItem>
            <CardItem cardBody style={{marginLeft:10,marginTop:10, marginBottom:10, backgroundColor:'white'}}>
              <View style={{marginTop:10, marginBottom:10}}>
                <H2 style={{marginTop:10}}>
                  {item.location}
                </H2>
                <Text style={styles.contentType}>
                  {item.title}
                </Text>
                <Text style={styles.contentType}>
                  {item.type}
                </Text>
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
        )}
        />
    </View>
  )
}