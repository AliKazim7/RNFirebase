import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  TouchableOpacity,
  ScrollView, Platform, AsyncStorage, Image
} from 'react-native';
import FastImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Modal from 'react-native-modal'
import colors from '../styles/colors';
import styles from '../styles/CreateList';
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content, Item, Label, Input } from 'native-base';
import headStyle from '../styles/HeaderSetting';
import firestore from '@react-native-firebase/firestore'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import NoImage from '../../components/explore/NoImage';
import Loader from '../../components/Loader';
import StarRating from 'react-native-star-rating';

export default class SelectedListItem extends React.Component{
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
            editData:false,
            location:"",
            loading: false,
            showPreview:false,
            price:"",
            title:"",
            renterData:[],
            detail:"",
            type:"",
            isModalVisible: false
        }
      }

    async componentDidMount(){

        this.setState({
            loading: true
        })
        if(this.props.route.params.result.renterID){
            const getRenter = await this.getRenterID(this.props.route.params.result.renterID)
            setTimeout(()=>{
                this.setState({
                    listing: this.props.route.params.result,
                    location:this.props.route.params.result.location,
                    price:this.props.route.params.result.price1,
                    title:this.props.route.params.result.title,
                    detail:this.props.route.params.result.detail,
                    type:this.props.route.params.result.type,
                    renterData: getRenter,
                    loading: false
                    })
                }, 1000)
        } else {
        setTimeout(()=>{
            this.setState({
                listing: this.props.route.params.result,
                location:this.props.route.params.result.location,
                price:this.props.route.params.result.price1,
                title:this.props.route.params.result.title,
                detail:this.props.route.params.result.detail,
                type:this.props.route.params.result.type,
                loading: false
                })
            }, 1000)
        }
    }

    getRenterID = ID =>{
        const result = []
        return new Promise((resolve, reject)=>{
            firestore()
            .collection('Users')
            .where('uid','==', ID)
            .get()
            .then((querySnapshot)=>{
                querySnapshot.forEach(documentSnapshot => {
                    resolve(documentSnapshot.data())
                });
            })
        })
    }

    goBack = () =>{
      this.props.navigation.goBack()
    }

    checkAvail = async() =>{
        const { location, price,title, detail, type } = this.state
        if(location && price && title && detail && type){
            this.setState({
                showPreview: true,
                editData: false
            })
        }
    }

    getDoc = async() =>{
        const { listing } = this.state
        return new Promise((resolve, reject)=>{
            firestore().collection('ItemList').where('id', '==', listing.id).get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                resolve(doc.id)
              });
            })
          })
    }

    uploadData = async() =>{
        this.setState({
            loading: true
        })
        const { location, price,title, detail, type } = this.state
        const getDoc = await this.getDoc()
        if(getDoc){
            firestore().collection('ItemList').doc(getDoc).update({ 
                title: title,
                type: type,
                location: location,
                price1: price,
                detail: detail
            })
            .then(()=>{
                this.setState({
                    loading: false
                })
            })
        }
    }

    saveData = () =>{
        this.setState({
            editData: true
        })
    }

    handleChange =(key, value) =>{
        this.setState({
            [key]: value
        })
    }

    render(){
        const { listing,isModalVisible, renterData } = this.state
        return(
            <Container style={{backgroundColor: "white"}}>
              {
                !this.state.editData
                ?
                <ScrollView>
                <View style={{width:'100%', marginTop: Platform.OS === "android" ? 20 : 0}}>
                <ScrollView horizontal style={{flex:1}} showsHorizontalScrollIndicator={false}>
                        {
                            listing.photo !== undefined
                            ?
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                   {
                                       listing.photo.length > 0
                                       ?
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
                                            style={{ height: hp('40%'),flex:1,width:wp('100%')}}
                                            source={require('../../img/noImage.jpeg')}
                                            resizeMode="cover"
                                        />   
                                    }
                                </ScrollView>
                            :
                            <Image
                                            style={{ height: hp('40%'),flex:1,width:wp('100%')}}
                                            source={require('../../img/noImage.jpeg')}
                                            resizeMode="cover"
                                        />                             
                        }
                    </ScrollView>
                    <View style={headStyle.leftHeader}>
                        <Icon type="AntDesign" onPress={() => this.props.navigation.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
                    </View>
                    <View style={headStyle.rightHeader1}>
                        <Icon type="MaterialIcons" onPress={() => this.saveData()} style={headStyle.rightIcon} name="edit" />
                    </View>
                </View>
                <List>
                        <ListItem>
                            <Body>
                                <Text style={{fontSize:24}}>{this.state.showPreview === false ? listing.title : this.state.title}</Text>
                                {listing.totalRating> 0
                                ? (
                                    <StarRating
                                        maxStars={5}
                                        starSize={20}
                                        starStyle={colors.saagColor}
                                        fullStarColor={colors.saagColor}
                                        rating={listing.totalRating}
                                    />
                                    )
                                : null}
                                <Text style={{marginTop:10, marginBottom:10}}>{this.state.showPreview === false ? listing.location : this.state.location}</Text>
                            </Body>
                            <Right />
                        </ListItem>
                        <ListItem>
                            <Left>
                                <Body>
                                    <Text style={{fontWeight:'normal'}}>
                                        {this.state.showPreview === false ? listing.type : this.state.type}
                                    </Text>
                                    <Text>hosted by <Text style={{fontWeight:'bold'}}> {listing.userName} </Text> </Text>
                                </Body>
                            </Left>
                            <Right>
                            </Right>
                        </ListItem>
                        {
                            renterData.uid !== ''
                            ?
                            <ListItem onPress={renterData.uid !== undefined ? () => this.props.navigation.navigate('RenterProfile',{renterID: renterData.uid}) : null}>
                                <Left>
                                    <Body>
                                        <Text style={{fontWeight:'normal'}}>
                                            {this.state.showPreview === false ? listing.type : this.state.type}
                                        </Text>
                                        <Text> Rented by <Text style={{fontWeight:'bold'}}> {renterData.firstName} </Text> </Text>
                                    </Body>
                                </Left>
                                <Right>
                                    {
                                        renterData.photo !== undefined
                                        ?
                                        <FastImage style={{ height: hp('8%'), width:wp('18%'), borderRadius:50}} resizeMode="center" source={renterData.photo ? {uri:renterData.photo} : null} />
                                        :
                                        <Image style={{ height: hp('8%'), width:wp('18%'), borderRadius:50}} resizeMode="center" source={require('../../img/images.png')} />
                                    }
                                </Right>
                            </ListItem>
                            :
                            null
                        }
                        <ListItem noBorder>
                            <Left>
                                <Body>
                                    <Text style={{fontWeight:'normal'}}>
                                    $ {this.state.showPreview === false ? listing.price1 : this.state.price}
                                    </Text>
                                </Body>
                            </Left>
                        </ListItem>
                </List>
              </ScrollView>
              :
                <ScrollView style={{marginTop:hp('10%')}}>
                    <Item floatingLabel>
                        <Label>Title</Label>
                        <Input value={this.state.title} onChangeText={(text) => this.handleChange('title', text)} />
                    </Item>
                    <Item style={{marginTop:hp('5%')}} floatingLabel>
                        <Label>Location</Label>
                        <Input value={this.state.location} onChangeText={(text) => this.handleChange('location', text)} />
                    </Item>
                    <Item style={{marginTop:hp('5%')}} floatingLabel>
                        <Label>Price</Label>
                        <Input value={this.state.price} onChangeText={(text) => this.handleChange('price', text)} />
                    </Item>
                    <Item style={{marginTop:hp('5%')}} floatingLabel>
                        <Label>Description</Label>
                        <Input value={this.state.detail} onChangeText={(text) => this.handleChange('detail', text)} />
                    </Item>
                    <Item style={{marginTop:hp('5%')}} floatingLabel>
                        <Label>Type</Label>
                        <Input value={this.state.type} onChangeText={(text) => this.handleChange('type', text)} />
                    </Item>
                </ScrollView>
              }
              {
                  this.state.editData
                  ?
                    <View style={{position:'absolute', bottom:10, right:20}} >
                        <Button style={{backgroundColor:colors.saagColor}} onPress={() => this.checkAvail()} >
                            <Text>Preview</Text>
                        </Button>
                    </View>
                    :
                    null
              }
              {
                  this.state.showPreview
                  ?
                    <View style={{position:'absolute', bottom:10, right:20}} >
                        <Button style={{backgroundColor:colors.saagColor}} onPress={() => this.uploadData()} >
                            <Text>Update</Text>
                        </Button>
                    </View>
                    :
                    null
              }
              <Loader
                modalVisible={this.state.loading}
                animationType="fade"
            />
            </Container>
        )
    }
}