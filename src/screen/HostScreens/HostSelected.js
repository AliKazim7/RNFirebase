import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import Modal from 'react-native-modal'
import colors from '../styles/colors';
import styles from '../styles/CreateList';
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content } from 'native-base';
import Stars from '../../components/Stars';
import headStyle from '../styles/HeaderSetting';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Carousel from 'react-native-snap-carousel'
const sliderWidth = Dimensions.get('window').width;
const itemHeight = Dimensions.get('window').height;
export default class HostSelected extends React.Component{
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
            photo:[],
            isModalVisible: false
        }
      }

    componentDidMount(){
        this.setState({
            listing: this.props.route.params.listed,
            photo: this.props.route.params.listed.photo
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
        // CreateList
        return(
            <Container style={{backgroundColor: "white"}}>
                <View style={{flex: 1}}>
                    <Modal isVisible={isModalVisible}>
                        <View style={{flex: 1}}>
                            <Text>Hello!</Text>

                            <Button title="Hide modal" />
                        </View>
                    </Modal>
                </View>
                <ScrollView>
                <Content>
                <View style={{width:'100%',flex:1, backgroundColor:'red'}}>
                    {/* <Image 
                        style={{width:'100%'}}
                        // resizeMode="stretch"
                        source={listing.photo}
                    /> */}
                    {
                        this.state.photo.length > 0
                        ?
                        <ScrollView 
                        horizontal
                        style={{flex:1, backgroundColor:'yellow'}}
                        showsHorizontalScrollIndicator={false}>
                            {listing.photo.map((item,index)=>(
                                <Image
                                    source={item && {uri: item}}
                                    style={{flex:1,height: hp('40%'), backgroundColor:'green'}}
                                    resizeMode="cover"
                                    />
                            ))}
                        </ScrollView>
                        :
                        null
                    }
                    <View style={headStyle.leftHeader}>
                        <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black', marginTop:12.5, marginLeft:12.5, fontSize:25}} name="arrowleft" />
                    </View>
                    <View style={headStyle.rightHeader2}>
                        <Icon type="Feather" style={headStyle.rightIcon} name="upload" />
                    </View>
                    <View style={headStyle.rightHeader1}>
                        <Icon type="FontAwesome" onPress={() => this.saveData()} style={headStyle.rightIcon} name="heart-o" />
                    </View>
                    {
                        this.state.photo.length > 0
                        ?
                        <View style={headStyle.bottomCorousal}>
                            <Icon type="Entypo" style={{color:'white'}} name="dots-three-horizontal" />
                        </View>
                        :
                        null
                    }
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
                    <ListItem>
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
                </Content>
                </ScrollView>
                <View style={{flexDirection:'row', borderColor:'2px solid black'}}>
                        <View>
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
                        <View style={{position:'absolute', bottom:0, right:10}}>
                        <Button onPress={this.checkAvail} style={{marginLeft:40, marginBottom:5, marginTop:5}} danger>
                            <Text>Check availablility</Text>
                        </Button>
                        </View>
                </View>
            </Container>
        )
    }
}
