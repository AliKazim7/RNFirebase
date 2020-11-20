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
import StarRating from 'react-native-star-rating';
import colors from '../styles/colors';
import styles from '../styles/CreateList';
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content, Textarea, CheckBox } from 'native-base';
import headStyle from '../styles/HeaderSetting';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Loader from '../../components/Loader';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import moment from 'moment'
import { addComments, addComplain, completeOrder, getItemID, getUSERDATA, getUSERID, setItemRating } from '../../services/service';
export default class OrderDetails extends React.Component{
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
            supplierData:[],
            renterData:[],
            userDetails:[],
            itemData:[],
            newRating: 0,
            newRatingProd:0,
            totalPrice:'',
            itemComment:'',
            startDate:'',
            endDate:'',
            result:[],
            userID:'',
            Complain:'',
            checked:false,
            showFeedBackScreen:false,
            feedBackOptions:false,
            loadingVisible:false
        }
        this.toggleMethod = this.toggleMethod.bind(this);
      }

    async componentDidMount(){
        this.setState({
            listing: this.props.route.params.result,
            result:this.props.route.params.result
        })
        const supplierID = this.getSuplier(this.props.route.params.result.supplierID)
        const renterID = this.getRenter(this.props.route.params.result.renterID)
        const itemID = this.getItem(this.props.route.params.result.id)
    }

    getSuplier = async(ID) =>{
        const itemID = getUSERDATA(ID)
        itemID.then(respose =>{
            this.setState({
                supplierData: respose[0]
            })
        })
    }

    getRenter = async(ID) =>{
        const itemID = getUSERDATA(ID)
        itemID.then(respose =>{
            this.setState({
                renterData: respose[0]
            })
        })
    }

    getItem = async(ID) =>{
    const itemID = getItemID(ID)
        itemID.then(respose =>{
            this.setState({
                itemData: respose[0]
            })
        })
    }

    orderNow = async () =>{
        const {listing} = this.state
        this.setState({
            loadingVisible:true
        })
        console.log("listing items", listing.orderID)
        const compOrder = completeOrder(listing.orderID)
        compOrder.then(response =>{
            this.setState({
                feedBackOptions: true,
                loadingVisible:false
            })
        })
    }

    updateStatus = async(docID) =>{
        return new Promise((resolve, reject)=>{
            firestore().collection('Orders').doc(docID)
            .update({
                isCompleted: true
            }).then(()=>{
                resolve(true)
            })
        })
    }

    setSupplierRating = async() =>{
        const { supplierData,newRating } = this.state
        const docID = await this.getDocID(supplierData.uid)
        if(supplierData.supplierRating > 0){
            const newRAT = ((supplierData.supplierRating * 5) + newRating)/(5 + 1)
            return new Promise((resolve, reject)=>{
                firestore().collection('Users').doc(docID).update({ 
                    supplierRating: newRAT
                })
                .then(()=>{
                    resolve(true)
                })
            })
        } else {
            const newRAT = newRating
            return new Promise((resolve, reject)=>{
                firestore().collection('Users').doc(docID).update({ 
                    supplierRating: newRAT
                })
                .then(()=>{
                    resolve(true)
                })
            })
        }
    }

    getDocID = async(ID) => {
        return new Promise((resolve, reject)=>{
          firestore().collection('Users').where('uid', '==', ID).get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              resolve(doc.id)
            });
          })
        })
      }
    goBack = () =>{
      this.props.navigation.goBack()
    }

    newRatingProd = (rating) =>{
        this.setState({
            newRatingProd: rating
        })
    }

    onStarRatingPress = (rating) =>{
        this.setState({
            newRating: rating
        })
    } 

    onhandleChange = text =>{
        this.setState({
            itemComment:text
        })
    }

    onhandleComplain = text =>{
        this.setState({
            Complain:text
        })
    }

    changeCheck = () =>{
        this.setState({
            showFeedBackScreen:true
        })
    }

    toggleMethod(){
        const { newRating, newRatingProd, itemComment } = this.state;
        if (newRating && newRatingProd && itemComment) {
            return false
        }
        return true;
    }

    sendComplain = () =>{
        const { listing } = this.state
        const addComp = addComplain(listing.renterID, listing.supplierID,this.state.Complain, this.state.listing.id )
        addComp.then(response =>{
            this.props.navigation.goBack()
        })
    }

    onSkip = () =>{
        const { listing } = this.state
        console.log("listing come here", listing)
        this.props.navigation.goBack()
    } 

    render(){
        const { listing,isModalVisible,result, userDetails,itemData } = this.state
        console.log("listing come here", listing)
        return(
            <Container style={{backgroundColor: "white"}}>
                <Loader
                    modalVisible={this.state.loadingVisible}
                    animationType="fade"
                />
                {
                    this.state.feedBackOptions === false
                    ?
                    <ScrollView>
                        <View style={{width:'100%'}}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {
                                    listing.photo !== undefined
                                    ?
                                    listing.photo.map((i,ind)=>(
                                        <FastImage
                                            key={ind}
                                            resizeMode="cover"
                                            indicator={ProgressBar} 
                                            style={{width:widthPercentageToDP('100%'),flex:1, height: heightPercentageToDP('40%')}}
                                            source={i && {uri: i}}
                                        />
                                    ))
                                    :
                                        <Image 
                                            resizeMode="cover"
                                            style={{
                                                width:widthPercentageToDP('100%'),
                                                flex:1,
                                                height: heightPercentageToDP('40%')
                                            }}
                                            source={require('../../img/noImage.jpeg')} 
                                        />
                                }
                            </ScrollView>
                            <View style={headStyle.leftHeader}>
                                <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
                            </View>
                        </View>
                        <List>
                            <ListItem>
                                <Body>
                                    <H3>{result.title}</H3>
                                    <Text note style={{marginTop:10, marginBottom:10}}>{result.location}</Text>
                                </Body>
                                <Right />
                            </ListItem>
                            <ListItem>
                                <Left>
                                    <Text>Total Price</Text>
                                </Left>
                                <Right style={{flex:1}}>
                                    <Text>{this.state.listing.price1}</Text>
                                </Right>
                            </ListItem>
                            <ListItem>
                                <Left>
                                    <Text>Start Date</Text>
                                </Left>
                                <Right style={{flex:1}}>
                                    <Text>
                                        {moment(this.state.listing.startDate).format("MMM Do YYYY")}
                                    </Text>
                                </Right>
                            </ListItem>
                            <ListItem>
                                <Left>
                                    <Text>End Date</Text>
                                </Left>
                                <Right style={{flex:1}}>
                                    <Text>
                                        {moment(this.state.listing.endDate).format("MMM Do YYYY")}
                                    </Text>
                                </Right>
                            </ListItem>
                        </List>
                    </ScrollView>
                    :
                    <View>
                        <Header transparent>
                            <Left>
                                <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
                            </Left>
                            <Body />
                            {
                                this.state.showFeedBackScreen
                                ?
                                <Right />
                                :
                                <Right style={{paddingRight:10}}>
                                    <TouchableOpacity onPress={this.onSkip}>
                                        <Text style={{color:colors.saagColor}}>
                                            Skip
                                        </Text>
                                    </TouchableOpacity>
                                </Right>
                            }
                        </Header>
                        <ScrollView>
                            {
                                this.state.showFeedBackScreen
                                ?
                                <List>
                                    <ListItem noBorder style={{ marginBottom:10}}>
                                        <Body>
                                            <Textarea rowSpan={5} bordered  onChangeText={(text) => this.onhandleComplain(text)} placeholder="Write Complain" />
                                        </Body>
                                    </ListItem>
                                </List>
                                :
                                <List style={{paddingLeft:10, paddingRight:10}}>
                                    <ListItem itemDivider>
                                        <Text style={{fontSize:20}}>Feedback</Text>
                                    </ListItem>
                                    <ListItem noBorder>
                                        <Left>
                                            <Text>Rate Supplier for experience you had</Text>
                                        </Left>
                                    </ListItem>
                                    <ListItem style={{ marginBottom:10}}>
                                        <Body>
                                            <StarRating
                                                disabled={false}
                                                fullStarColor={colors.saagColor}
                                                maxStars={5}
                                                rating={this.state.newRating}
                                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                            />
                                        </Body>
                                    </ListItem>
                                    <ListItem noBorder>
                                        <Left>
                                            <Text>Rate the Product for experience you had</Text>
                                        </Left>
                                    </ListItem>
                                    <ListItem noBorder style={{ marginBottom:10}}>
                                        <Body>
                                            <StarRating
                                                disabled={false}
                                                fullStarColor={colors.saagColor}
                                                maxStars={5}
                                                rating={this.state.newRatingProd}
                                                selectedStar={(rating) => this.newRatingProd(rating)}
                                            />
                                        </Body>
                                    </ListItem>
                                    <ListItem noBorder style={{ marginBottom:10}}>
                                        <Body>
                                            <Textarea rowSpan={5} bordered  onChangeText={(text) => this.onhandleChange(text)} placeholder="Add a comment" />
                                        </Body>
                                    </ListItem>
                                    <ListItem>
                                        <Left style={{flex:0.}}>
                                            <CheckBox color="black" onPress={() => this.changeCheck()} checked={this.state.checked} />
                                        </Left>
                                        <Body style={{flex:1, alignItems:'flex-start'}}>
                                            <Text style={{color:'black'}}>
                                                Was Item delivered as describe?
                                            </Text>
                                        </Body>
                                    </ListItem>
                                </List>
                                }
                        </ScrollView>
                    </View>
                }
                {
                    !this.state.feedBackOptions
                    ?
                    <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                            <View style={{position:'absolute', bottom:0, right:widthPercentageToDP('5%')}}>                           
                                <Button onPress={this.orderNow} style={{marginBottom:5, marginTop:5, backgroundColor:colors.saagColor}} >
                                    <Text>Complete Order</Text>
                                </Button>
                            </View>
                    </View>
                    :
                    // <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                    //         <View style={{position:'absolute', bottom:0,marginTop:heightPercentageToDP('5%'), right:widthPercentageToDP('5%')}}>                           
                    //             <Button onPress={this.orderNow} style={{marginBottom:5, marginTop:5, backgroundColor:colors.saagColor}} >
                    //                 <Text>Add Feedback</Text>
                    //             </Button>
                    //         </View>
                    // </View>
                    null
                }
                {
                    this.state.showFeedBackScreen
                    ?
                    <View style={{flexDirection:'row',position:'relative', right:10, borderColor:'2px solid black'}}>
                        <Button onPress={this.sendComplain} style={{marginBottom:5, marginTop:5,marginLeft:widthPercentageToDP('6%'), backgroundColor:colors.saagColor}} >
                            <Text>Send Complain</Text>
                        </Button>
                    </View>
                    :
                    null
                }
                {
                    this.state.showaddFeedButton
                    ?
                    <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                            <View style={{position:'absolute', bottom:0,marginTop:heightPercentageToDP('5%'), right:widthPercentageToDP('5%')}}>                           
                                <Button onPress={this.orderNow} style={{marginBottom:5, marginTop:5, backgroundColor:colors.saagColor}} >
                                    <Text>Add Feedback</Text>
                                </Button>
                            </View>
                    </View>
                    :
                    null
                }
            </Container>
        )
    }
}