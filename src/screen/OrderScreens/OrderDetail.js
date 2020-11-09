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
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content, Textarea } from 'native-base';
import headStyle from '../styles/HeaderSetting';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Loader from '../../components/Loader';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import moment from 'moment'
import { addComments, getItemID, getUSERDATA, getUSERID, setItemRating } from '../../services/service';
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
        console.log("lisitng items", listing)
        this.props.navigation.navigate('ProfileTab')
        const settingRating = setItemRating(listing, this.state.newRatingProd)
        const comments = addComments(listing,this.state.renterData, this.state.itemComment)
        const supplierRating = await this.setSupplierRating()
        if(supplierRating){
                const updateStatus = await this.updateStatus(listing.orderID)
                if(updateStatus){
                }
        }
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

    toggleMethod(){
        const { newRating, newRatingProd, itemComment } = this.state;
        if (newRating && newRatingProd && itemComment) {
            return false
        }
        return true;
    }

    render(){
        const { listing,isModalVisible,result, userDetails,itemData } = this.state
        return(
            <Container style={{backgroundColor: "white"}}>
                <Loader
                    modalVisible={this.state.loadingVisible}
                    animationType="fade"
                />
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
                    <Textarea rowSpan={5} bordered  onChangeText={(text) => this.onhandleChange(text)} placeholder="Add a comment" />
                </List>
            </ScrollView>
                <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                        <View style={{position:'absolute', bottom:0, right:widthPercentageToDP('5%')}}>                           
                            <Button onPress={this.orderNow} disabled={this.toggleMethod()} style={{marginBottom:5, marginTop:5, backgroundColor:colors.saagColor}} >
                                <Text>Completed</Text>
                            </Button>
                        </View>
                </View>
            </Container>
        )
    }
}