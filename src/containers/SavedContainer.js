/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity, FlatList, RefreshControl
} from 'react-native';
import Fastimage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import NoResults from '../components/saved/NoResults';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Loader from '../components/Loader';
import { Card, CardItem, Container, H1, H2,
  Text,
  Thumbnail, } from 'native-base';
import colors from '../screen/styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import colors from '../styles/colors';
import MainImage from '../data/photos/listing6.png'
import { getSavedItem, getUSERID,getSavedValues } from '../services/service'
const uri = "https://firebasestorage.googleapis.com/v0/b/saagg-e874a.appspot.com/o/images%2Flisting6.png?alt=media&token=66d9d57c-86f7-4d0a-b7fb-ed5950ab4019"

export default class SavedContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      listing:[]
    }
  }

  async componentDidMount(){
    this.setState({
      loading: true
    })
    this.apiCall()
  }


  apiCall = async() =>{
    this.setState({
      listing:[]
    })
    const userID = getUSERID()
    userID.then(
      response =>{
        const saveValue = getSavedItem(response)
        saveValue.then(res =>{
          
        console.log("querySnapshot",res)
        if(res[0].saved.length > 0){
          res[0].saved.map((item, index)=>{
            const savedItems = getSavedValues(item)
            savedItems.then(array =>{
              this.setState({
                listing: [...this.state.listing, array],
                loading: false
              })
            })
          })
        } else {
          this.setState({
            listing:[],
            loading:false
          })
        }
        })
      }
    )
  }

  navigationRoute = (value) =>{
  this.props.navigation.navigate('SavedDetail', {
    result: value
  })
  }
  goBack = () =>{
    console.log("value")
    this.props.navigation.navigate('ExploreContainer')
  }

  onReferesh = () => {
    console.log("On Refresh")
    this.setState({
      loading:true
    })
    this.apiCall()
  }

  render() {
    return (
      <Container>
        <Loader 
          modalVisible={this.state.loading}
          animationType="fade"
        />
        {this.state.listing.length > 0 && this.state.listing ? <H1 style={{marginTop:hp('5%'), marginLeft:wp('5%')}}>Saved</H1> : null}
        {this.state.listing.length > 0 && this.state.listing  ? <CardView onReferesh={this.onReferesh} loading={this.state.loading} navigation={this.navigationRoute} result={this.state.listing} /> : <NoResults onReferesh={this.onReferesh} loading={this.state.loading} goHome={this.goBack} />}
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
    marginTop:10,
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
  console.log("results", result)
  return(
    <View style={{flex:1}}>
      <FlatList
        data={result}
        refreshControl={
          <RefreshControl onRefresh={props.onReferesh} refreshing={props.loading} />
        }
        renderItem={({item, index})=>(
          <TouchableOpacity 
          onPress={() => props.navigation(item)} 
          key={index}
        >
          <Card>
            <CardItem cardBody>
              {/* <Image source={item.photo[0] && {uri:item.photo[0]}} resizeMode="cover" style={{flex:1, height:hp('40%')}} /> */}
              {
                item.photo !== undefined && item.photo.length > 0
                ?
                <Fastimage 
                  source={item.photo[0] && {uri:item.photo[0]}} 
                  indicator={ProgressBar} 
                  style={{
                    flex:1, height:hp('40%')
                  }}
                />
                :
                <Image 
                  source ={require('../img/noImage.jpeg')}
                  style={{
                    flex:1, height:hp('40%')
                  }}
                />
              }
            </CardItem>
            <CardItem cardBody style={{marginLeft:10,marginTop:10, marginBottom:10, backgroundColor:'white'}}>
              <View style={{marginTop:10, marginBottom:10}}>
                <H2 style={styles.contentType}>
                  {item.title}
                </H2>
                <Text style={styles.contentType}>{item.location}</Text>
                <Text style={styles.contentType}>{item.type}</Text>
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
        )}
        />
    </View>
  )
}