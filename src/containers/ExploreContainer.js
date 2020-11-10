import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableOpacity, BackHandler
} from 'react-native';
import Listings from '../components/explore/Listings';
import colors from '../styles/colors';
import categoriesList from '../data/categories';
import listings from '../data/listings';
import Loader from '../components/Loader';
import { Card, CardItem, Body, Text, Thumbnail, H2, H3, Icon, Button, Header, Left, Right, Input } from 'native-base';
import HeartButton from '../components/buttons/HeartButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get("window");
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import CategoriesList from '../components/explore/CategoriesList';
import CategoriesArray from '../components/explore/CategoriesList1'
import { getCategories, getItemList, getSavedItem, getUSERID, mergeList,mergeSaved } from '../services/service';
class ExploreContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favouriteListings: [],
      listing:[],
      CategoriesList:[],
      searchAbleList:[],
      loadingVisible:false
    };
    this.handleAddToFav = this.handleAddToFav.bind(this);
    this.renderListings = this.renderListings.bind(this);
    this.onCreateListClose = this.onCreateListClose.bind(this);
  }

  async componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState({
      loadingVisible: true
    })
    const categoriesList = getCategories()
    categoriesList.then(response =>{
      this.setState({
        CategoriesList:response
      })
    })
    this.apiCall()
  }

  apiCall = async() =>{
    this.setState({
      listing:[]
    })
    var UID = ""
    var items = []
    const userData = getUSERID()
    userData.then(response =>{
      UID = response
    })
    const itemLists = getItemList()
    itemLists.then(res =>{
      console.log("item list items", res)
      if(res.length > 0){
        const saveItem = getSavedItem(UID)
        saveItem.then(arr =>{
          console.log("saved items", arr)
          if(arr[0].saved.length > 0){
            const mergeSave = mergeSaved(arr[0].saved, res)
            mergeSave.then(arries =>{
              console.log("merge items", arries)
              const data = mergeList(arries)
              data.then(response=>{
                if(response){
                  this.setState({
                    segmentList: response,
                    listing: response,
                    searchAbleList:res,
                    loadingVisible: false
                  })
                } else {
                  this.setState({
                    loadingVisible: false
                  })
                }
              })
            })
          } else {
            const mergeSave = mergeSaved(arr[0].saved, res)
            mergeSave.then(arries =>{
              console.log("merge items", arries)
              const data = mergeList(arries)
              data.then(response=>{
                if(response){
                  this.setState({
                    segmentList: response,
                    listing: response,
                    searchAbleList:res,
                    loadingVisible: false
                  })
                } else {
                  this.setState({
                    loadingVisible: false
                  })
                }
              })
            })
          }
        })
      } else {
        this.setState({
          listing:[]
        })
      }
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

handleBackButton() {
    return true;
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



  handleAddToFav(listing) {
    const { navigate } = this.props.navigation;
    let { favouriteListings } = this.state;

    const index = favouriteListings.indexOf(listing.id);
    if (index > -1) {
      favouriteListings = favouriteListings.filter(item => item !== listing.id);
      this.setState({ favouriteListings });
    } else {
      this.props.navigation.navigate("CreateModal", { listing })
    }
  }

  onCardDetail = (listing) =>{
    this.props.navigation.navigate("SelectedItem",{listing: listing})
  }

  handleIndexChange = (index) =>{
    const item = this.state.segmentTab[index]
    const result = listings.filter((value) =>{
      if(value.title === item){
        return value
      }
    })
    this.props.navigation.navigate("ViewCategory", {
      listing: result[0]
    })
  }

  seeAllData = (item) => {
    console.log("items come here", item)
    const result = this.state.listing.filter((value) =>{
      if(value.title === item){
        return value
      }
    })
    console.log("items come here", result[0].title === "All Listings")
    if(result[0].title === "All Listings"){
      this.props.navigation.navigate("AllItems", {
        listing: result[0]
      })
    } else {
      this.props.navigation.navigate("ViewCategory", {
        listing: result[0]
      })
    }
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

  renderListings() {
    return this.state.listing.map((listing, index) => (
      <View
        key={`listing-${index}`}
      >
        <Listings
          key={`listing-item-${index}`}
          title={listing.title}
          boldTitle={listing.boldTitle}
          listings={listing.Listing}
          showAddToFav={listing.showAddToFav}
          showSelected={this.onCardDetail}
          handleAddToFav={this.handleAddToFav}
          favouriteListings={this.state.favouriteListings}
          seeAll={this.seeAllData}
        />
      </View>
    ));
  }

  changingText = text =>{
    const array = []
    const result = this.state.searchAbleList.filter((item)=>{
      if(item.title === text){
      }
      if(item.type === text){
      }
      if(item.location === text){
      }
      if(item.price === text){
      }
      // if(item.title !== text && item.location !== text && item.type !== text){
      //   return this.state.listing
      // }
    })
  // if(array.length > 0){
  //   this.setState({
  //     listing: array
  //   })
  // } else {
  //   this.setState({
  //     listing: this.state.listing
  //   })
  // }
}

showSelected = (value) => {
  this.props.navigation.navigate("GetFiltered", {
    category: value
  })
}
  renderCategories = () => {
    if(this.state.CategoriesList.length > 0){
      return(
        <CategoriesArray
          listing={this.state.CategoriesList}
          showSelected={this.showSelected}
        />
      )
    } else {
      return categoriesList.map((listing, index) => (
        <View
          key={`listing-${index}`}
        >
          <CategoriesList
            key={`listing-item-${index}`}
            title={listing.title}
            boldTitle={listing.boldTitle}
            listings={listing.listings}
          />
        </View>
      ));
    }
  }

  onReferesh = () => {
    this.setState({
      loadingVisible:true
    })
    this.apiCall()
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView
            style={styles.scrollview}
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
              <RefreshControl onRefresh={this.onReferesh} refreshing={this.state.loadingVisible} />
            }
          >
            {this.renderCategories()}
            {this.renderListings()}
        </ScrollView>
        <Loader
          modalVisible={this.state.loadingVisible}
          animationType="fade"
        />
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
    paddingTop: 20,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  categories: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    paddingLeft: 20,
    paddingBottom: 20,
    color: colors.gray04,
  },
  HeaderChange:{
    flex:6,
    marginLeft: Platform.OS === 'android' ? wp('10%') : null
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
     // marginTop: 28,
     // marginLeft: 21,
     // marginRight: 21,
   },
   searchIcon: {
     position: 'absolute',
     left: 8,
     fontSize:25,
     top: 15,
     color:colors.saagColor
   },
   textInput: {
     display: 'flex',
     // marginTop: Platform.OS === 'android' ? 5 : 5,
     marginLeft: 44,
     color: colors.gray02,
   },
});


// const ListingsQuery = gql`
//   query {
//     multipleListings{
//       title,
//       description
//     }
//   }
// `

// const ExploreContainerTab = graphql(ListingsQuery)(ExploreContainer);

export default ExploreContainer;