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
        console.log("userid",this.props.route.params.listing)
        const getUser = await this.getUSER(this.props.route.params.listing.userID)
        console.log("userid",this.props.route.params.listing, getUser)
        // if(getUser){
            this.setState({
                listing: this.props.route.params.listing,
                userDetails: getUser,
                loadingVisible: false
            })
        // } else {
        //     this.setState({
        //         loadingVisible: false
        //     })
        // }
    }

    async componentWillReceiveProps(nextProps){
        console.log("nxtProps", nextProps)
        if(nextProps.route.params.Date !== undefined){
            const result = await this.checkData(nextProps.route.params.Date, nextProps.route.params.startDate,nextProps.route.params.endDate)
        }
    }

    checkData = (Days, SD, ED) =>{
        this.setState({
            loadingVisible: true
        })
        const totalPrice = Days*this.state.listing.price1
        console.log("Days", Days,totalPrice)
        this.setState({
            totalPrice: totalPrice,
            startDate:SD,
            loadingVisible: false,
            endDate: ED
        })
    }

    getUSER = async(UID) =>{
        console.log("user OD", UID)
        return new Promise((resolve, reject)=>{
            firestore().collection('Users').where('uid', '==',UID).get()
            .then(querySnapshot =>{
                console.log("here",querySnapshot)
                querySnapshot.forEach(documentSnapshot => {
                    console.log(documentSnapshot)
                    resolve(documentSnapshot.data())
                });
            })
        })
    }

    orderNow = async () =>{
        this.setState({
            loadingVisible: true
        })
        const ID = Math.random()
        const userID = await this.getData()
        if(userID){
            const uploadData = await this.orderData(userID, ID)
            if(uploadData){
                const getDocID = await this.orderDoc(ID)
                if(getDocID){
                    firestore().collection('Orders')
                    .doc(getDocID)
                    .update({
                        orderID: getDocID
                    })
                    .then(()=>{
                        this.setState({
                            loadingVisible: false
                        })
                        this.props.navigation.navigate('MainContainer')
                    })
                }
            }
        } else {
            this.setState({
                loadingVisible: false
            })
        }
    }

    orderData = (userID, ID) =>{
        const { endDate, startDate, totalPrice, listing  } = this.state
        return new Promise((resolve, reject)=>{
            console.log("Order Now", endDate, startDate, totalPrice, listing.userID)
            firestore().collection('Orders')
            .add({
                    renterID: userID,
                    supplierID: listing.userID,
                    startDate:startDate,
                    endDate:endDate,
                    orderID: ID,
                    isCompleted: false,
                    totalPrice: totalPrice,
                    listItem: listing
                })
                .then(() => {
                    resolve(true)
                })
                .catch(e =>{
                    resolve(false)
                })
        })
    }

    orderDoc = ID =>{
        return new Promise((resolve, reject)=>{
            firestore().collection('Orders').where('orderID','==',ID)
            .get()
            .then(querySnapshot =>{
                querySnapshot.docs.map((item)=>{
                    resolve(item.id)
                })
            })
        })
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
        const ID =  Math.random()
        this.setState({
            loadingVisible: true
        })
        const userID = await this.getData()
        if(userID){
            const getID = await this.uploadItem(ID, userID)
            console.log("listing", getID)
            if(getID){
                const getDocID = await this.getDocID(ID)
                if(getDocID){
                    firestore().collection("SavedPlaces").doc(getDocID)
                    .update({
                        savedID:getDocID
                    })
                    .then(()=>{
                        console.log("Updated !")
                        this.setState({
                            listing: listing,
                            loadingVisible: false
                        })
                        this.props.navigation.navigate('MainContainer')
                    })
                }
            }
        }
    } 

    uploadItem = (ID,userID) =>{
        const {listing} = this.state
        return new Promise((resolve, reject)=>{
            firestore().collection('SavedPlaces')
            .add({
                location: listing.location,
                favourite: true,
                price1: listing.price1,
                priceResT:listing.priceResT,
                type:listing.type,
                title:listing.title,
                totalRating:listing.totalRating,
                details: listing.details,
                segmenttype:listing.segmenttype,
                priceType:listing.priceType,
                photo:listing.photo,
                id:listing.id,
                savedID:ID,
                userID: userID
            })
            .then((response) =>{
                // this.setState({ loadingVisible: false }, () => goBack());
              resolve(true)  
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
        console.log("here messages")
        this.props.navigation.navigate('Messages',{
            listing: this.state.listing,
            userDetails: this.state.userDetails
        })
    }

    render(){
        const { listing,isModalVisible, userDetails } = this.state
        console.log("userDetails", userDetails)
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
                            listing.photo !== undefined
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