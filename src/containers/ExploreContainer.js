import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity, BackHandler
} from 'react-native';
import Listings from '../components/explore/Listings';
import colors from '../styles/colors';
import categoriesList from '../data/categories';
import listings from '../data/listings';
import Loader from '../components/Loader';
import { Card, CardItem, Body, Text, Thumbnail, H2, H3, Icon, Button, Header, Left, Right, Input } from 'native-base';
import HeartButton from '../components/buttons/HeartButton';
import Stars from '../components/Stars';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get("window");
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import CategoriesList from '../components/explore/CategoriesList';
class ExploreContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favouriteListings: [],
      listing:[],
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
    const userID = await this.getUserID()
    const itemList = await this.getApi()
    if(itemList.length > 0){
      const data = await this.mergeList(itemList)
      const savedPlace = await this.savedPlace(userID)
      if(data){
        this.setState({
          segmentList: data,
          listing: data,
          searchAbleList:itemList,
          loadingVisible: false
        })
      } else {
        this.setState({
          loadingVisible: false
        })
      }
    }
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
    const result = [{
      'title':'Trending',
      'Listing':[]
    },{
      'title':'Wanted',
      'Listing':[]
    }]
    return new Promise((resolve, reject)=>{
      const response = lists.filter((item,index)=>{
        if(item.segmenttype === "Trending"){
          result[0].Listing.push(item)
        } else if(item.segmenttype === "Wanted"){
          result[1].Listing.push(item)
        }
      })
      resolve(result)
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
          // resolve(documentSnapshot.data())
          result.push(documentSnapshot.data())
        });
        resolve(result)
      });
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
    const result = this.state.listing.filter((value) =>{
      if(value.title === item){
        return value
      }
    })
    this.props.navigation.navigate("ViewCategory", {
      listing: result[0]
    })
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

  renderCategories = () => {
    return categoriesList.map((listing, index) => (
      <View
        key={`listing-${index}`}
      >
        <CategoriesList
          key={`listing-item-${index}`}
          title={listing.title}
          boldTitle={listing.boldTitle}
          listings={listing.listings}
          // showAddToFav={listing.showAddToFav}
          // showSelected={this.onCardDetail}
          // handleAddToFav={this.handleAddToFav}
          // favouriteListings={this.state.favouriteListings}
          // seeAll={this.seeAllData}
        />
      </View>
    ));
  }


  render() {
    return (
      <View style={styles.wrapper}>
        <Header style={{marginTop:20}} transparent>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              type="EvilIcons"
              color={colors.saagColor}
              style={styles.searchIcon}
            />
            <Input placeholder="Search any address" style={styles.textInput} />
          </View>
        </Header>
        <ScrollView
            style={styles.scrollview}
            contentContainerStyle={styles.scrollViewContent}
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
    paddingTop: 40,
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