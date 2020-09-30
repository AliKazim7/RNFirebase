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
import Stars from '../../components/Stars';
import headStyle from '../styles/HeaderSetting';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Loader from '../../components/Loader';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
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
        const totalPrice = Days*this.state.listing.price
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
        const { endDate, startDate, totalPrice, listing  } = this.state
        const userID = await this.getData()
        if(userID){
            console.log("Order Now", endDate, startDate, totalPrice, listing.userID)
            firestore().collection('Orders').add({
                renterID: userID,
                supplierID: listing.userID,
                startDate:startDate,
                endDate:endDate,
                orderID: Math.random(),
                isCompleted: false,
                totalPrice: totalPrice,
                listItem: listing
            }).then(() => {
                this.setState({
                  loadingVisible: false
                })
                this.props.navigation.navigate('ExploreContainer')
              })
              .catch(e =>{
                this.setState({
                  loadingVisible: false
                })
              })
        } else {
            this.setState({
                loadingVisible: false
            })
        }
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

    saveData = () =>{
        const {listing} = this.state
        this.props.navigation.navigate("CreateModal", { listing })
        // this.setState({
        //     isModalVisible: true
        // })
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
                            {listing.stars> 0
                            ? (
                                <Stars
                                votes={listing.stars}
                                size={10}
                                color={colors.green02}
                                />
                                )
                            : null}
                            <Text note style={{marginTop:10, marginBottom:10}}>{listing.location}</Text>
                        </Body>
                        <Right />
                    </ListItem>
                    {/* <ListItem>
                        <Body>
                            <Text>
                                <Text style={{fontWeight:'bold'}}> Book now and get 20% off. </Text> Be one of the first 3 people who Book
                                this place and save. Book your trip 
                            </Text>
                        </Body>
                        <Right>
                            <Icon
                                type="FontAwesome"
                                name="tags"
                                color="green"
                            />
                        </Right>
                    </ListItem> */}
                    <ListItem>
                        <Left>
                            <Body>
                                <Text>
                                    {listing.type}
                                </Text>
                                <Text note>hosted by <Text style={{fontWeight:'bold'}}> Kazim </Text> </Text>
                            </Body>
                        </Left>
                        <Right>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('HostProfile',{userID: userDetails.uid})}>
                                <Thumbnail source={userDetails.photo && {uri: userDetails.photo}} />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                </List>
            </ScrollView>
                <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                        {
                            !this.state.totalPrice
                            ?
                            <View style={{marginBottom:20}}>
                                <Text style={{marginTop:15, marginLeft:10}}> ${listing.price} / {listing.priceType} </Text>
                                {listing.stars > 0 ? 
                                    <View style={{marginLeft:20}}>
                                        <Stars
                                        votes={listing.stars}
                                        size={10}
                                        color={colors.green02}
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