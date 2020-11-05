import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Modal from 'react-native-modal'
import colors from '../styles/colors';
import styles from '../styles/CreateList';
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content } from 'native-base';
import headStyle from '../styles/HeaderSetting';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Loader from '../../components/Loader';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import StarRating from 'react-native-star-rating';
import { addOrder, getUSERDATA, getUSERID,SaveItemData } from '../../services/service';
export default class SelectedItem extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon 
                type="FontAwesome"
                name="arrow-circle-left"
                fontSize={30}
            /> 
          </TouchableOpacity>
        ),
        headerStyle: styles.headerStyle,
        tabBarVisible: false
      });
      constructor(props){
        super(props)
        this.state ={
            listing:[],
            userDetails:[],
            isModalVisible: false,
            totalPrice:'',
            startDate:'',
            endDate:'',
            userID:'',
            loadingVisible:false
        }
      }

    async componentDidMount(){
        this.setState({
            loadingVisible: true
        })
        const getDetails = getUSERDATA(this.props.route.params.listing.userID)
        getDetails.then(response =>{
            this.setState({
                listing: this.props.route.params.listing,
                userDetails: response[0],
                loadingVisible: false
            })
        })
    }

    async componentWillReceiveProps(nextProps){
        if(nextProps.route.params.Date !== undefined){
            const result = await this.checkData(nextProps.route.params.Date, nextProps.route.params.startDate,nextProps.route.params.endDate)
        }
    }

    checkData = (Days, SD, ED) =>{
        this.setState({
            loadingVisible: true
        })
        const totalPrice = Days*this.state.listing.price1
        this.setState({
            totalPrice: totalPrice,
            startDate:SD,
            loadingVisible: false,
            endDate: ED
        })
    }

    orderNow = async () =>{
        this.setState({
            loadingVisible: true
        })
        const ID = Math.random()
        const userID = getUSERID()
        userID.then(
            response =>{
                const addORder = addOrder(
                    response,
                    ID,
                    this.state.listing,
                    this.state.startDate,
                    this.state.endDate,
                    this.state.totalPrice
                )
                addORder.then(
                    res =>{
                        firestore().collection('OrderItems')
                        .doc(res.id)
                        .update({
                            orderID: res.id
                        })
                        .then(()=>{
                            this.setState({
                            loadingVisible: false
                        })
                        this.props.navigation.navigate('ExploreContainer')
                      })
                    }
                )
            }
        )
    }

    getData = async() =>{
        return new Promise((resolve, reject)=>{
            auth().onAuthStateChanged(user => {
              if (!user) {
              } else {
                resolve(user.uid)
              }
            })
          })
    }

    goBack = () =>{
      this.props.navigation.goBack()
    }

    checkAvail = () =>{
        this.props.navigation.navigate("Availability")
    }

    saveData =  async() =>{
        const {listing} = this.state
        listing.favourite = true
        this.setState({
            loadingVisible: true
        })
        const userID = getUSERID()
        userID.then(response =>{
            const saveItem = SaveItemData(response, this.state.listing.id)
            saveItem.then(res =>{
                this.setState({
                    loadingVisible: false
                })
            })
        })
    } 

    uploadItem = (ID,userID) =>{
        const {listing} = this.state
        return new Promise((resolve, reject)=>{
            firestore().
            collection('SavedPlaces').
            where("userID",'==',"shd5NG3uF3gE8gia7Gjncts6EgE3")
            .get()
            .then(function(querySnapshot) {
               querySnapshot.forEach(function(doc) {
                console.log(doc.data().saved, doc.id)
             })
            })
            .catch((e)=>{
                resolve(false)
            })
        })
    }

    getDocID = async(ID) =>{
        return new Promise((resolve, reject)=>{
            firestore().collection('SavedPlaces').where('savedID','==', ID)
            .get()
            .then(querySnapshot =>{
                querySnapshot.docs.map((item)=>{
                    resolve(item.id)
                })
            })
        })
    }

    contactUser = () =>{
        this.props.navigation.navigate('Messages',{
            listing: this.state.listing,
            userDetails: this.state.userDetails
        })
    }

    render(){
        const { listing,isModalVisible, userDetails } = this.state
        console.log("listing", listing.photo)
        return(
            <Container style={{backgroundColor: "white"}}>
                <Loader
                    modalVisible={this.state.loadingVisible}
                    animationType="fade"
                />
            <ScrollView>
                <View style={{width:'100%'}}>
                    {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageGallery")} >
                        <Image 
                        style={{width:'100%'}}
                        // resizeMode="stretch"
                        source={listing.photo}
                        />
                    </TouchableOpacity> */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            listing.photo !== undefined && listing.photo.length > 0
                            ?
                            listing.photo.map((i,ind)=>(
                                // <TouchableOpacity 
                                // key={ind} onPress={() => this.props.navigation.navigate("ImageGallery",{
                                //     photo: listing.photo
                                // })} >
                                    <FastImage
                                        key={ind}
                                        resizeMode="cover"
                                        indicator={ProgressBar} 
                                        style={{width:widthPercentageToDP('100%'),flex:1, height: heightPercentageToDP('40%')}}
                                        source={i && {uri: i}}
                                    />
                                // </TouchableOpacity>
                            ))
                            :
                            <Image 
                                resizeMode="cover"
                                style={{
                                    width:widthPercentageToDP('100%'),
                                flex:1,
                                // backgroundColor:'red',
                                height: heightPercentageToDP('40%')}}
                                source={require('../../img/noImage.jpeg')} />
                        }
                    </ScrollView>
                    <View style={headStyle.leftHeader}>
                        <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
                    </View>
                    <View style={headStyle.rightHeader2}>
                        <Icon type="Feather" style={headStyle.rightIcon} name="upload" />
                    </View>
                    <View style={headStyle.rightHeader1}>
                        <Icon type="FontAwesome" onPress={() => this.saveData()} style={ listing.favourite ? headStyle.rightSelected : headStyle.rightIcon} name={listing.favourite ? "heart" : "heart-o"} />
                    </View>
                </View>
                <List>
                    <ListItem>
                        <Body>
                            <H3>{listing.title}</H3>
                            {listing.totalRating> 0
                            ? (
                                <StarRating
                                    maxStars={5}
                                    starSize={20}
                                    starStyle={colors.saagColor}
                                    containerStyle={{width:30}}
                                    fullStarColor={colors.saagColor}
                                    rating={listing.totalRating}
                                />
                                )
                            : null}
                            <Text note style={{marginTop:10, marginBottom:10}}>{listing.location}</Text>
                        </Body>
                        <Right />
                    </ListItem>
                    <ListItem onPress={() => this.props.navigation.navigate('HostProfile',{userID: userDetails.uid})}> 
                        <Left>
                            <Body>
                                <Text>
                                    {listing.type}
                                </Text>
                                <Text note>hosted by <Text style={{fontWeight:'bold'}}> {userDetails.firstName} </Text> </Text>
                            </Body>
                        </Left>
                        <Right>
                            {
                                userDetails.photo !== undefined
                                ?
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('HostProfile',{userID: userDetails.uid})}>
                                    <FastImage source={userDetails.photo && {uri: userDetails.photo}} />
                                </TouchableOpacity>
                                :
                                <Image source={require('../../img/images.png')} style={{ height: heightPercentageToDP('5%'), width:widthPercentageToDP('10%')}} resizeMode="contain" />
                            }
                        </Right>
                    </ListItem>
                    <ListItem onPress={() => this.contactUser()}>
                        <Left>
                            <Body>
                                <Text>
                                    Contact with Supplier
                                </Text>
                            </Body>
                        </Left>
                        <Right>
                            {
                                userDetails.photo !== undefined
                                ?
                                <TouchableOpacity>
                                    <FastImage source={userDetails.photo && {uri: userDetails.photo}} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity>
                                    <Image source={require('../../img/images.png')} style={{ height: heightPercentageToDP('5%'), width:widthPercentageToDP('10%')}} resizeMode="contain" />
                                </TouchableOpacity>
                            }
                        </Right>
                    </ListItem>
                </List>
            </ScrollView>
                <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                        {
                            !this.state.totalPrice
                            ?
                            <View style={{marginBottom:20}}>
                                <Text style={{marginTop:15, marginLeft:10}}> ${listing.price1} </Text>
                                {listing.totalRating > 0 ? 
                                    <View style={{marginLeft:20}}>
                                        <StarRating
                                            maxStars={5}
                                            starSize={20}
                                            starStyle={colors.saagColor}
                                            fullStarColor={colors.saagColor}
                                            containerStyle={{width:30}}
                                            rating={listing.totalRating}
                                        />
                                    </View>
                                :
                                null
                                }
                            </View>
                            :
                            <View style={{marginBottom:20}}>
                                <Text style={{marginTop:15, marginLeft:10}}> ${this.state.totalPrice}</Text>
                            </View>
                        }
                        <View style={{position:'absolute', bottom:0, right:widthPercentageToDP('5%')}}>
                            {
                                !this.state.totalPrice
                                ?
                                    <Button onPress={this.checkAvail} style={{marginBottom:5, marginTop:5, backgroundColor:colors.saagColor}} >
                                        <Text>Check availablility</Text>
                                    </Button>
                                :
                                    <Button onPress={this.orderNow} style={{marginBottom:5, marginTop:5, backgroundColor:colors.saagColor}} >
                                        <Text>Order Now</Text>
                                    </Button>
                            }
                        </View>
                </View>
            </Container>
        )
    }
}