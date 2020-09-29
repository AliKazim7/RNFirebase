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
  // Image,
  TouchableOpacity, FlatList
} from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import NoResults from '../components/saved/NoResults';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Loader from '../components/Loader';
import { Card, CardItem, H1, H2,
  Text,
  Thumbnail, } from 'native-base';
import colors from '../screen/styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import colors from '../styles/colors';
import MainImage from '../data/photos/listing6.png'

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
    const dataResult = await this.getApi()
    if(dataResult){
      const arrayValue = await this.apiCall(dataResult)
      if(arrayValue){
        this.setState({
          listing: arrayValue,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }
    }
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

  apiCall = async(ID) =>{
    let result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('SavedPlaces')
      .where('userID', '==', ID)
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
  this.props.navigation.navigate('SavedDetail', {
    result: value
  })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Loader 
          modalVisible={this.state.loading}
          animationType="fade"
        />
        {this.state.listing.length > 0 && this.state.listing ? <H1 style={{marginTop:hp('5%'), marginLeft:wp('5%')}}>Saved</H1> : null}
        {this.state.listing.length > 0 && this.state.listing  ? <CardView navigation={this.navigationRoute} result={this.state.listing} /> : <NoResults />}
        {/* <NoResults /> */}
      </View>
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
              <Image 
                  source={item.photo[0] && {uri:item.photo[0]}} 
                  indicator={ProgressBar} 
                  style={{
                    flex:1, height:hp('40%')
                  }}/>
            </CardItem>
            <CardItem cardBody style={{marginLeft:10,marginTop:10, marginBottom:10, backgroundColor:'white'}}>
              <View style={{marginTop:10, marginBottom:10}}>
                <Text note>
                  Anytime
                </Text>
                <H2 style={styles.contentType}>
                  {item.location}
                </H2>
                <Text style={styles.contentType}>1 stay</Text>
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
        )}
        />
    </View>
  )
}