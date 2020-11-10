import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import FastImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import HeartButton from '../../components/buttons/HeartButton';
import { Container, Content, H1, Card, CardItem, List, Left, Right, Text, ListItem, Header, Body, Icon, Button, Input } from 'native-base'
import colors from '../../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Loader from '../../components/Loader';
import StarRating from 'react-native-star-rating';
import { getAllCategoryItems, getCategoriesData, getUSERID, SaveItemData } from '../../services/service';

export default class GetFiltered extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            listing:[],
            searchAbleList:[],
            filtered:[],
            loadingVisible:false,
            title:''
        }
      }

      async componentDidMount(){
        this.setState({
          loadingVisible:true
        })
        const getData = getAllCategoryItems(this.props.route.params.category)
        getData.then(response =>{
          console.log("listing come here", response)
            this.setState({
                listing: response,
                searchAbleList:response,
                title: this.props.route.params.category,
                loadingVisible: false
            })
        })
        .catch(()=>{
            this.setState({
                listing:[]
            })
        })
      }

      async componentWillReceiveProps(nextProps){
        if(nextProps.route.params.result){
          const filterResult = await this.filterResult(nextProps.route.params.result)
        }
      }

      filterResult = async(list) =>{
        this.setState({
          loadingVisible:true
        })
        const result = this.state.searchAbleList.filter((item,index)=>{
          if(item.location.match(list.Location) && (list.multiSliderValue[0] < item.price1 && list.multiSliderValue[1] > item.price1) ){
            return item
          }
        })
        this.setState({
          listing:result,
          loadingVisible:false,
          filtered:list
        })
      }

      onCardDetail = (listing) =>{
        this.props.navigation.navigate("SelectedItem",{listing: listing})
      }
      goBack = () => {
        this.props.navigation.goBack()
      }

      showFilter = () =>{
        this.props.navigation.navigate("FilterModal")
      }

      handleAddToFav = (listing) =>{
        if(listing.favourite === false){
          listing.favourite = true
          this.setState({
            loadingVisible: true
          })
          const userID = getUSERID()
          userID.then(response =>{
          const saveItem = SaveItemData(response, listing.id)
          saveItem.then(res =>{
          this.setState({
            loadingVisible: false
          })
          })
        })
        }
      }

      changingText = text =>{
          const array = []
          const result = this.state.searchAbleList.filter((item)=>{
            if(item.title.match(text)){
              array.push(item)
            }
            if(item.type.match(text)){
              array.push(item)
            }
            if(item.location.match(text)){
              array.push(item)
            }
            // if(item.price1.match(text)){
            //   array.push(item)
            // }
            if(item.title !== text && item.location !== text && item.type !== text){
              return this.state.searchAbleList
            }
          })

        if(array.length > 0){
          this.setState({
            listing: array
          })
        } else {
          this.setState({
            listing: this.state.searchAbleList
          })
        }
      }

      clearAll = () =>{
        this.setState({
          listing: this.state.searchAbleList,
          filtered:[]
        })
      }

    render(){
        return(
            <Container>
                <Header style={{marginTop:20}} transparent>
                  <Left>
                    <Icon type="Feather" onPress={() => this.goBack()} style={{ fontSize:25, fontWeight:'100'}} name="arrow-left" />
                  </Left>
                  <Body style={styles.HeaderChange}>
                    <View style={styles.searchContainer}>
                      <Icon
                        name="search"
                        type="EvilIcons"
                        color={colors.saagColor}
                        style={styles.searchIcon}
                      />
                      <Input onChangeText={(text) => this.changingText(text)} placeholder="Search any address" style={styles.textInput} />
                    </View>
                  </Body>
                  <Right />
                </Header>
                <ScrollView>
                    <View style={styles.TitleView}>
                      <Text style={{marginBottom:5, color:colors.saagColor}} note>{this.state.listing.length} items</Text>
                      <H1 style={{marginBottom:5}}>{this.state.title}</H1>
                        <Button onPress={() => this.showFilter()} style={{backgroundColor:colors.saagColor,width:wp('30%'),marginTop:10, marginBottom:20}}>
                          <Icon style={{fontSize:20,color:'white'}} type="Octicons" name="settings" />
                          <Text style={{color:'white',fontSize:16, marginLeft:-20}}>Filters</Text>
                        </Button>
                        {
                          this.state.filtered.Location !== undefined
                          ?
                          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                              {
                                this.state.filtered.Location !== undefined ?
                                <Button style={{backgroundColor:colors.saagColor, marginBottom:10}} transparent rounded>
                                  <Text style={{color:'white'}} >{this.state.filtered.Location}</Text>
                                  <Text style={{color:'white'}}>X</Text>
                                </Button>
                                : null
                              }
                              {
                                this.state.filtered.multiSliderValue !== undefined 
                                ?
                                <Button style={{backgroundColor:colors.saagColor, marginBottom:10}} transparent rounded>
                                  <Text style={{color:'white'}}>${this.state.filtered.multiSliderValue[0]} - ${this.state.filtered.multiSliderValue[1]} </Text>
                                  <Text style={{color:'white'}}>X</Text>
                                </Button>
                                :
                                null
                              }
                              {
                                this.state.filtered.starCount !== undefined ?
                                <Button style={{backgroundColor:colors.saagColor, marginBottom:10}} transparent rounded>
                                  <Text style={{color:'white'}}>{this.state.filtered.starCount !== undefined ? this.state.filtered.starCount : 0 } </Text>
                                  <Text style={{color:'white'}}>X</Text>
                                </Button>
                                :
                                null
                              }
                          </ScrollView>
                          :
                          null
                        }
                    </View>
                    {this.state.listing.map((listing, index)=>(
                        <TouchableHighlight
                        style={styles.card}
                        onPress={() => this.onCardDetail(listing)}
                        key={index}
                      >
                        <View>
                          {/* {showAddToFav
                              ? ( */}
                            <View style={styles.addToFavoriteBtn}>
                              <HeartButton
                                color={colors.black}
                                selectedColor={colors.saagColor}
                                // selected={favouriteListings.indexOf(listing.id) > -1}
                                onPress={() => this.handleAddToFav(listing)}
                              />
                            </View>
                            {/* // )
                            // : null} */}
                          {
                            listing.photo !== undefined
                            ?
                            <FastImage
                              style={styles.image}
                              resizeMode="cover"
                              indicator={ProgressBar} 
                              source={listing.photo[0] && { uri : listing.photo[0]}}
                            />
                            :
                            <Image
                              style={styles.image}
                              resizeMode="cover"
                              source={require('../../img/noImage.jpeg')}
                            />
                          }
                          {listing.totalRating > 0
                            ? (
                              <View style={{marginTop:10, width:wp('20%')}}>
                                <StarRating
                                    maxStars={5}
                                    starSize={20}
                                    starStyle={colors.saagColor}
                                    fullStarColor={colors.saagColor}
                                    rating={listing.totalRating}
                                />
                              </View>
                            )
                            : 
                              <Text style={{color:colors.saagColor}} note>
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
                              <Text style={{fontWeight:'bold', color: colors.saagColor}}>${listing.price1}</Text>
                            </Text>
                        </View>
                      </TouchableHighlight>
                    ))}
                </ScrollView>
                {
                  this.state.filtered.Location !== undefined
                  ?
                  <View >
                    <Button transparent onPress={() => this.clearAll()}>
                      <Text style={{color:colors.saagColor}}> Clear All </Text>
                    </Button>
                  </View>
                  :
                  null
                }
                <Loader
                  modalVisible={this.state.loadingVisible}
                  animationType="fade"
                />
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
    card: {
      flexDirection: 'column',
      width:'95%',
      minHeight: 100,
      marginLeft:10,
      // marginRight:50,
      marginBottom:40
    },
    image: {
        // flex: 1,
        borderRadius: 18,
        width:'100%',
        flex: 1,
        height: hp('40%'),
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
    TitleView:{
      paddingLeft:10,
      marginTop:40,
      marginBottom:40, 
      borderBottomColor:'black', 
      borderBottomWidth:1
    }
  });