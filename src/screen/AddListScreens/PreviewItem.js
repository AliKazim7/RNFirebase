import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal'
import colors from '../styles/colors';
import styles from '../styles/CreateList';
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content } from 'native-base';
import headStyle from '../styles/HeaderSetting';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import StarRating from 'react-native-star-rating';
import { getItemID } from '../../services/service'

export default class PreviewItem extends React.Component{
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
            location:'',
            title:'',
            type:'',
            price:'',
            priceType:'',
            photo:[],
            isModalVisible: false
        }
      }

    async componentDidMount(){
        const itemID = getItemID(this.props.route.params.listID)
        itemID.then(
            respone =>{
                this.setState({
                    listing: respone[0]
                })
            }
        )
    }

    goBack = () =>{
        this.props.navigation.navigate("ProfileTab")
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
        // CreateList
        return(
            <Container style={{backgroundColor: "white"}}>
                <ScrollView>
                <View>
                    {
                        listing.photo &&
                        listing.photo.length > 0
                        ?
                        <ScrollView 
                        horizontal
                        style={{width:widthPercentageToDP('100%')}}
                        showsHorizontalScrollIndicator={false}>
                            {listing.photo.map((item,index)=>(
                                    <Thumbnail
                                        source={item && {uri: item}}
                                        square
                                        style={{width:widthPercentageToDP('100%'), height: heightPercentageToDP('40%')}}
                                    />
                            ))}
                        </ScrollView>
                        :
                        <Image 
                            resizeMode="cover"
                            style={{
                                width:widthPercentageToDP('100%'),
                                flex:1,
                                // backgroundColor:'red',
                                height: heightPercentageToDP('40%')
                            }}
                            source={require('../../img/noImage.jpeg')} 
                        /> 
                    }
                    <View style={headStyle.leftHeader}>
                        <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
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
                                <Text>hosted by <Text style={{fontWeight:'bold'}}> {listing.userName} </Text> </Text>
                            </Body>
                        </Left>
                        <Right>
                        </Right>
                    </ListItem>
                </List>
                </ScrollView>
                <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                    <View>
                        <Text style={{marginTop:0, marginLeft:10}}> ${listing.price1}</Text>
                    </View>
                </View>
            </Container>
        )
    }
}