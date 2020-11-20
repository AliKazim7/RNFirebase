
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  // Image,
  TouchableOpacity, FlatList, RefreshControl, TouchableHighlight
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
import { getSupplierItem, getUSERID, getOrderSupplier, displayRented } from '../services/service';
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
    this.apiCall()
  }

  apiCall = async() =>{
    this.setState({
      listing:[]
    })
    const userID = getUSERID()
    userID.then(response =>{
      const supplierItems = getSupplierItem(response)
      supplierItems.then(supplier =>{
        if(supplier.length > 0){
          const getOrder = getOrderSupplier(response)
          getOrder.then(orders=>{
            if(orders.length > 0){
              const rentedItem = displayRented(supplier, orders)
              rentedItem.then(rent =>{
                this.setState({
                  listing: rent,
                  loading:false
                })
              })
            } else {
              this.setState({
                listing: supplier,
                loading:false
              })
            }
          })
        } else {
          this.setState({
            listing: [],
            loading:false
          })
        }
      })
    })
  }

  navigationRoute = (value) =>{
    this.props.navigation.navigate('SelectList', {
      result: value
    })
  }

  onRefresh = () =>{
    this.setState({
      loading:true
    })
    this.apiCall()
  }

  goBack = () =>{
    this.props.navigation.navigate('AddListItem')
  }


  render() {
    return (
      <Container>
          <Loader 
            modalVisible={this.state.loading}
            animationType="fade"
          />
          {this.state.listing.length > 0 && this.state.listing
          ? 
            <H1 
              style={{marginTop:hp('5%'), marginLeft:wp('5%')}}>
              Listing
            </H1> 
          : 
            null
          }
          {
          this.state.listing.length > 0 && this.state.listing  
          ? 
            <CardView 
              onRefresh={this.onRefresh} 
              loading={this.state.loading} 
              navigation={this.navigationRoute} 
              goBack={this.goBack} 
              result={this.state.listing} 
            /> 
          : 
            <NoLists 
              onRefresh={this.onRefresh} 
              loading={this.state.loading} 
              goBack={this.goBack} 
            />
          }
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
  	// paddingLeft: 20,
  	// paddingRight: 20,
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

const FooterButton = (props) =>{
  return(
    <View style={styles.footer}>
      <TouchableHighlight
       onPress={props.goBack} 
       style={styles.findHomesButton}>
        <Text style={styles.findHomesButtonText}>
      New Listing
        </Text>
      </TouchableHighlight>
    </View>
  )
}

const CardView = (props) =>{
  const result = props.result
  return(
    <View style={{flex:1,marginLeft:20, marginRight:20}}>
      <FlatList
        ListFooterComponent={
          <FooterButton goBack={props.goBack} />
        }
        data={result}
        refreshControl={
          <RefreshControl onRefresh={props.onRefresh} refreshing={props.loading} />
        }
        renderItem={({item, index})=>(
          <TouchableOpacity 
          onPress={() => props.navigation(item)} 
          key={index}
        >
          <Card>
            <CardItem cardBody>
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
                item.rented === true 
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
                  {item.title}
                </H2>
                <Text style={styles.contentType}>
                  {item.location}
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