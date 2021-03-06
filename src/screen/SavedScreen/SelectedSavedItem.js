import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView, Platform
} from 'react-native';
import FastImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Modal from 'react-native-modal'
import colors from '../styles/colors';
import styles from '../styles/CreateList';
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content } from 'native-base';
import headStyle from '../styles/HeaderSetting';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import StarRating from 'react-native-star-rating';

export default class SelectedSavedItem extends React.Component{
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
            isModalVisible: false
        }
      }

    componentDidMount(){
        this.setState({
            listing: this.props.route.params.listing
        })
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
            totalPrice:'',
            startDate:'',
            endDate:'',
            userID:'',
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
        const { listing,isModalVisible } = this.state
        return(
            <Container style={{backgroundColor: "white"}}>
              <ScrollView>
                <View style={{width:'100%', marginTop: Platform.OS === "android" ? 20 : 0}}>
                    <ScrollView horizontal style={{flex:1}} showsHorizontalScrollIndicator={false}>
                        {
                            listing.photo ?

                            listing.photo.map((i,ind)=>(
                                <FastImage 
                                  source={i && {uri: i}}
                                  key={ind}
                                  indicator={ProgressBar} 
                                  style={{ height: hp('40%'),flex:1,width:wp('100%')}}
                                />
                            ))
                            :
                                <Image 
                                  source={require('../../img/noImage.jpeg')}
                                  style={{ height: hp('40%'),flex:1,width:wp('100%')}}
                                />
                        }
                    </ScrollView>
                    <View style={headStyle.leftHeader}>
                        <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
                    </View>
                    <View style={headStyle.rightHeader1}>
                        <Icon type="Feather" style={headStyle.rightIcon} name="upload" />
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
                                    fullStarColor={colors.saagColor}
                                    containerStyle={{width:30}}
                                    rating={listing.totalRating}
                                />
                                )
                            : null}
                            <Text note style={{marginTop:10, marginBottom:10}}>{listing.location}</Text>
                        </Body>
                        <Right />
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Body>
                                <Text>
                                    {listing.type}
                                </Text>
                                <Text>hosted by <Text style={{fontWeight:'bold'}}> Kazim </Text> </Text>
                            </Body>
                        </Left>
                        <Right>
                        </Right>
                    </ListItem>
                </List>
              </ScrollView>
                <View style={{flexDirection:'row',justifyContent:'space-between', borderColor:'2px solid black'}}>
                        <View>
                            <Text style={{marginTop:15, marginLeft:10, color: colors.saagColor}}> ${listing.price1} </Text>
                            {listing.totalRating > 0 ? 
                                <View style={{marginLeft:20}}>
                                    <StarRating
                                        maxStars={5}
                                        starSize={20}
                                        starStyle={colors.saagColor}
                                        fullStarColor={colors.saagColor}
                                        rating={listing.totalRating}
                                    />
                                </View>
                            :
                            null
                            }
                        </View>
                        <View style={{right:wp('5%')}}>
                            <Button onPress={this.checkAvail} style={{ marginBottom:5, marginTop:5, backgroundColor:colors.saagColor}} >
                                <Text>Check availablility</Text>
                            </Button>
                        </View>
                </View>
            </Container>
        )
    }
}