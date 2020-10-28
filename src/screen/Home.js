import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import Listings from '../components/explore/Listings';
import colors from '../styles/colors';
import listings from '../data/listings';
import { Text, Thumbnail, Button } from 'native-base';
import HeartButton from '../components/buttons/HeartButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import StarRating from 'react-native-star-rating';
import { getUSERID } from '../services/service';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favouriteListings: [],
      selectedIndex:0,
      segmentTab: ["Featured", "Trending", "Wanted", "Categories"],
      segmentList:[],
      listing:[],
      loadingVisible: false,
      segmentChanges: true
    };
    this.handleAddToFav = this.handleAddToFav.bind(this);
    this.renderListings = this.renderListings.bind(this);
    this.onCreateListClose = this.onCreateListClose.bind(this);
  }

  async componentDidMount(){
    this.setState({
      loadingVisible: true
    })
    const userData = getUSERID()
    const userID = await this.getUserID()
    console.log("User DATA", userData)
    const itemList = await this.getApi()
    if(itemList.length > 0){
      const data = await this.mergeList(itemList)
      const savedPlace = await this.savedPlace(userID)
      data.map((item,index)=>{
        savedPlace.forEach((i)=>{
          if(item.userID === i.userID){
            return item.favourite  = true
          } else {
            return item.favourite = false
          }
        })
      })
      if(data){
        this.setState({
          segmentList: data,
          listing: itemList,
          loadingVisible: false
        })
      }
    }
  }

  getUserID= async() =>{
    return new Promise((resolve, reject)=>{
      auth().onAuthStateChanged(user => {
        if (user) {
          resolve(user.uid)
        }
      })
    })
  } 

  getApi = async() =>{
    return new Promise((resolve, reject)=>{
      firestore().collection('ItemList')
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        if(data.length > 0){
          resolve(data)
        }
      });
    })
  }

  mergeList = async(lists) => {
    const result = this.state.segmentTab[0]
    return new Promise((resolve, reject)=>{
      const response = lists.filter((item,index)=>{
        if(item.segmenttype === result){
          return item
        }
      })
      resolve(response)
    })
  }

  savedPlace  = async(ID) => {
    const result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('SavedPlaces')
      .where('userID', '==', ID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          result.push(documentSnapshot.data())
        });
        resolve(result)
      });
    })
  }

  handleAddToFav = (listing) => {
    const { navigate } = this.props.navigation;
    listing.favourite = true
      navigate('CreateModal', { listing });
  }

  onCreateListClose(listingId, listCreated) {
    let { favouriteListings } = this.state;
    if (listCreated) {
      favouriteListings.push(listingId);
    } else {
      favouriteListings = favouriteListings.filter(item => item !== listingId);
    }
    this.setState({ favouriteListings });
  }
  onCardDetail = (listing) =>{
    this.props.navigation.navigate("SelectedItem",{listing: listing})
  }

  seeAllData = (item) => {
    const result = listings.filter((value) =>{
      if(value.title === item){
        return value
      }
    })
    this.props.navigation.navigate("ViewCategory", {
      listing: result[0]
    })
  }

  renderListings() {
    return listings.map((listing, index) => (
      <View
        key={`listing-${index}`}
      >
        <Listings
          key={`listing-item-${index}`}
          title={listing.title}
          boldTitle={listing.boldTitle}
          listings={listing.listings}
          showAddToFav={listing.showAddToFav}
          showSelected={this.onCardDetail}
          handleAddToFav={this.handleAddToFav}
          favouriteListings={this.state.favouriteListings}
          seeAll={this.seeAllData}
        />
      </View>
    ));
  }

  handleIndexChange = async(index) => {
    this.setState({
      loadingVisible: true
    })
    const result = this.state.segmentTab[index]
    const data = await this.fetchListing(result)
    this.setState({
      ...this.state,
      selectedIndex: index,
      segmentList: data,
      segmentChanges: true,
      loadingVisible:false
    });
  };

  fetchListing = (result) =>{
    var value = []
    return new Promise((resolve, reject) =>{
      this.state.listing.filter((elmt) => {
        if(elmt.segmenttype === result){
          value.push(elmt)
        }
      })
      resolve(value)
    })
  }

  renderSegmentList = () =>{
    return(
      <ScrollView showsVerticalScrollIndicator={false}> 
        {
          this.state.listing.map((item,index)=>(
            <TouchableOpacity  key={item.id}
             onPress={() => this.onCardDetail(item)}
             >
            <View style={{marginLeft:20, marginRight:20, marginTop:40}}>
                <View style={styles.addToFavoriteBtn}>
                  <HeartButton
                    color={colors.white}
                    selectedColor={colors.saagColor}
                    selected={item.favourite}
                    onPress={() => this.handleAddToFav(item)}
                  />
                </View>
              <ScrollView horizontal style={{width: wp('100%')}} showsHorizontalScrollIndicator={false}>
                  {item.photo && item.photo.map((i,ind)=>(
                    <Thumbnail key={ind} square source={i && {uri: i}} resizeMethod="resize" resizeMode="stretch" style={{ height:hp('30%'),width:wp('90%'), borderRadius:10}} /> 
                  ))}
              </ScrollView>
              {item.totalRating !== undefined &&item.totalRating > 0
                    ? (
                      <StarRating
                        maxStars={5}
                        starSize={20}
                        starStyle={colors.saagColor}
                        fullStarColor={colors.saagColor}
                        rating={listing.totalRating}
                      />
                      )
                  : 
                      <Text style={{marginTop:10}} note> No Reviews yet </Text>
                  }
                <Text style={{marginTop:10}}>
                    {item.type} - {item.location}
                </Text>
                <Text  style={{marginTop:10}}>${item.price} / {item.priceType}</Text>
            </View>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    )
  }

  render() {
    const { data } = this.props;
    return (
      <View style={styles.wrapper}>
        <SearchBar />
        <View style={styles.scrollview}>
            {this.renderSegmentList()}
        </View>
        <View style={styles.footerButton}>
            <Button onPress={() => this.props.navigation.navigate('FilterModal')} style={{borderRadius:50}} dark>
                <Text>Filters</Text>
            </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollview: {
    paddingTop: 100,
  },
  cardView:{
    width:wp('80%'),
    height:hp('20%'),
    marginLeft:wp('5%')
  },
  image: {
    width:wp('100%'),
    height:hp('30%')
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  categories: {
    marginBottom: 40,
  },
  footerButton:{
    position:'absolute',
    bottom:10,
    marginLeft:wp('38%'),
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    paddingLeft: 20,
    paddingBottom: 20,
    color: colors.gray04,
  },
  addToFavoriteBtn: {
    position: 'absolute',
    right: 12,
    top: 7,
    zIndex: 2,
  },
});

export default Home;