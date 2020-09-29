import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform,
  Image
} from 'react-native';
import FastImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import HeartButton from '../../components/buttons/HeartButton';
import { Container, Content, H1, Card, CardItem, List, Left, Right, Text, ListItem, Header, Body, Icon, Button, Input, Thumbnail, H2, H3 } from 'native-base'
import Stars from '../../components/Stars';
import colors from '../../styles/colors';
import headStyle from '../styles/HeaderSetting';
import SearchBar from '../../components/SearchBar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import listings from '../../data/listings';
import firestore from '@react-native-firebase/firestore'
import Loader from '../../components/Loader';
const { width, height } = Dimensions.get("window");

export default class SavedDetail extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            listing:[],
            loading:false,
            searchAbleList:[],
            similarArray:[],
            title:''
        }
      }

      async componentDidMount(){
      //  this.setState({
      //    loading: true
      //  })
       const listed = await this.sectionFilter(this.props.route.params.result.segmenttype)
       this.setState({
           listing: this.props.route.params.result,
           searchAbleList:this.props.route.params.result,
           title: this.props.route.params.result.location,
           similarArray:listed,
           loading: false
       })
      }

      sectionFilter = value =>{
        var arrau = []
        return new Promise((resolve, reject)=>{
          firestore().collection('ItemList')
          .where('segmenttype','==',value)
          .get()
          .then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data());
            if(data.length > 0){
              resolve(data)
            }
          });
        })
      }

      onCardDetail = (listing) =>{
        this.props.navigation.navigate("SelectedSave",{listing: listing})
      }

      onCardDetail1 = (listing) =>{
        this.props.navigation.navigate("SelectedSave",{listing: listing})
      }

      goBack = () => {
        this.props.navigation.goBack()
      }

      showFilter = () =>{
        this.props.navigation.navigate("FilterModal")
      }

      handleAddToFav = (listing) =>{
        this.props.navigation.navigate('CreateModal', { listing })
      }

      changingText = text =>{
          const result = this.state.searchAbleList.filter((item)=>{
            if(item.title === text){
            }
            if(item.type === text){
            }
            if(item.location === text){
              return item
            }
            if(item.title !== text && item.location !== text && item.type !== text){
              return this.state.searchAbleList
            }
          })
        if(result){
          this.setState({
            listing: result
          })
        } else {
          this.setState({
            listing: this.state.searchAbleList
          })
        }
      }

    render(){
        const { listing,similarArray } = this.state
        return(
            <Container>
                <Loader 
                  modalVisible={this.state.loading}
                  animationType="fade"
                />
                <Header transparent style={{marginTop: Platform.OS === "android" ? 30 : 5}}>
                    <View style={styles.leftHeader}>
                        <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
                    </View>
                    <View style={styles.rightHeader2}>
                        <Icon type="SimpleLineIcons" style={headStyle.rightIcon} name="user-follow" />
                    </View>
                    <View style={styles.rightHeader1}>
                        <Icon type="Entypo" style={headStyle.rightIcon} name="dots-three-vertical" />
                    </View>
                </Header>
                <ScrollView>
                    <View style={styles.TitleView}>
                      <H1 style={{marginBottom:5}}>{this.state.title}</H1>
                        <Button onPress={() => this.showFilter()} transparent style={{borderColor:colors.saagColor,width:wp('30%'), borderWidth:1,marginTop:10, marginBottom:20}}>
                          <Icon style={{fontSize:20,color:'black'}} type="Octicons" name="settings" />
                          <Text style={{color:'black',fontSize:16, marginLeft:-20}}>Filters</Text>
                        </Button>
                    </View>
                        <TouchableHighlight
                        style={styles.card}
                        onPress={() => this.onCardDetail(listing)}
                        // key={index}
                      >
                        <View>
                          {/* {showAddToFav
                              ? ( */}
                            {/* <View style={styles.addToFavoriteBtn}>
                              <HeartButton
                                color={colors.white}
                                selectedColor={colors.saagColor}
                                // selected={favouriteListings.indexOf(listing.id) > -1}
                                onPress={() => this.handleAddToFav(listing)}
                              />
                            </View> */}
                            {/* // )
                            // : null} */}
                          <ScrollView horizontal style={{flex:1}} showsHorizontalScrollIndicator={false}>
                        {
                            listing.photo !== undefined
                            ?
                            listing.photo.map((i,ind)=>(
                                // <Thumbnail
                                //     square
                                //     key={ind}
                                //     style={{ height: hp('40%'),flex:1,width:wp('100%') , backgroundColor:'red'}}
                                //     source={i && {uri: i}}
                                //     resizeMode='stretch'
                                // />
                                <FastImage 
                                  source={i && {uri: i}}
                                  key={ind}
                                  indicator={ProgressBar} 
                                  style={{ height: hp('40%'),flex:1,width:wp('100%')}}
                                />
                              ))
                              :
                                <Image
                                  style={{ height: hp('40%'),flex:1,width:wp('100%')}}
                                  resizeMode='cover'
                                  source={require('../../img/noImage.jpeg')}
                                />
                        }
                    </ScrollView>
                          {listing.stars > 0
                            ? (
                              <View style={{marginTop:10}}>
                                <Stars
                                  votes={listing.stars}
                                  size={10}
                                  color={colors.green02}
                                />
                              </View>
                            )
                            : 
                              <Text note>
                                No reviews yet
                              </Text>
                            }
                          <Text
                            style={styles.listingTitle}
                            numberOfLines={2}
                          >
                            {listing.title}
                          </Text>
                            <Text style={{marginTop:5}}>
                              <Text style={{fontWeight:'bold'}}>${listing.price}</Text>
                              <Text> / {listing.priceType} </Text>
                            </Text>
                        </View>
                      </TouchableHighlight>
                  
                  <H3 style={{marginLeft:10}}>
                    Similar to your saves
                  </H3>

                <ScrollView 
                  style={styles.scrollView1}
                  contentContainerStyle={{ paddingRight: 30 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.similarArray.map((item,index)=>(
                     <TouchableHighlight
                        style={styles.card1}
                        onPress={() => this.onCardDetail1(item)}
                        key={index}
                     >
                     <View>
                     {/* {showAddToFav
                         ? ( */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {
                          item.photo !== undefined
                            ?
                          item.photo.map((i,ind)=>(
                            <FastImage 
                              source={i && {uri: i}}
                              key={ind}
                              indicator={ProgressBar} 
                              style={styles.image1}
                            />
                            ))
                              :
                            <Image
                              style={styles.image}
                              resizeMode='cover'
                              source={require('../../img/noImage.jpeg')}
                            />
                          }
                        </ScrollView>
                        <Text style={[{ color: listing.color }, styles.listingType]}>
                          {listing.type}
                        </Text>
                        <Text
                          style={styles.listingTitle}
                          numberOfLines={2}
                        >
                          {listing.title}
                        </Text>
                        <Text style={styles.listingPrice}>
              $
                          {listing.price}
                          {' '}
                          {listing.priceType}
                        </Text>
                         {item.stars > 0
                         ? (
                           <Stars
                             votes={item.stars}
                             size={10}
                           />
                         )
                         : null}
                     </View>    
                   </TouchableHighlight>
                  ))}
                </ScrollView>
                </ScrollView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 21,
      paddingRight: 21,
    },
    HeaderChange:{
      flex:6,
      marginLeft: Platform.OS === 'android' ? wp('10%') : null
    },
    title: {
      color: colors.gray04,
    },
    seeAllBtn: {
      marginTop: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    seeAllBtnText: {
      color: colors.gray04,
      marginRight: 5,
    },
    scrollView: {
      marginTop: 20,
      marginLeft: 15,
      marginBottom: 40,
    },
    scrollView1: {
      marginTop: 20,
      marginLeft: 10,
      marginBottom: 40,
    },
    card: {
      flexDirection: 'column',
      width:'95%',
      minHeight: 100,
      marginLeft:10,
      marginBottom:40
    },
    card1:{
      marginRight: 6,
      marginLeft: 6,
      width: 157,
      flexDirection: 'column',
      minHeight: 100,
    },
    image: {
      borderRadius: 18,
      width:'100%',
      height:hp('30%')
    },
    image1: {
      width: wp('50%'),
      flex: 1,
      height: 100,
      borderRadius: 8,
      marginBottom: 7,
  },
    listingTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.gray04,
      marginTop: 5,
    },
    listingType: {
      fontWeight: '700',
      fontSize: 10,
    },
    addToFavoriteBtn: {
      position: 'absolute',
      right: 12,
      top: 7,
      zIndex: 2,
    },
    listingPrice: {
      color: colors.gray04,
      marginTop: 4,
      marginBottom: 2,
      fontSize: 12,
      fontWeight: '300',
    },
    searchContainer: {
      display: 'flex',
      borderWidth: 1,
      borderColor: colors.gray03,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.7,
      shadowRadius: 10,
      borderRadius: 15,
      height: 50,
      width:"100%"
    },
    searchIcon: {
      position: 'absolute',
      left: 8,
      fontSize:25,
      top: 15,
    },
    textInput: {
      display: 'flex',
      marginLeft: 44,
      color: colors.gray02,
    },
    TitleView:{
      paddingLeft:20,
      marginTop:10, 
      marginBottom:40, 
      borderBottomColor:'black', 
      borderBottomWidth:1
    },
    rightHeader2:{
        position:"absolute",
        right:60, 
        height:50,
        width:50, 
        backgroundColor:'white', 
        borderRadius:40
    },
    listingTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.gray04,
      marginTop: 2,
    },
    listingType: {
      fontWeight: '700',
      fontSize: 10,
    },
    addToFavoriteBtn: {
      position: 'absolute',
      right: 12,
      top: 7,
      zIndex: 2,
    },
  listingPrice: {
    color: colors.gray04,
    marginTop: 4,
    marginBottom: 2,
    fontSize: 12,
    fontWeight: '300',
  },
  leftHeader:{
    position:"absolute", 
    left:5,
    height:50,
    width:50, 
    backgroundColor:'white', 
    borderRadius:40
  }, 
  rightHeader1:{
    position:"absolute",
    right:5, 
    height:50,
    width:50, 
    backgroundColor:'white', 
    borderRadius:40
},
  });