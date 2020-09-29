import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  TouchableOpacity,
  ScrollView, Platform, AsyncStorage
} from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Modal from 'react-native-modal'
import colors from '../styles/colors';
import styles from '../styles/CreateList';
import { Icon, Header, Container, Left, Button, Right, Body, Title, List, ListItem, Text, H1, H2, H3, Thumbnail, Content, Item, Label, Input } from 'native-base';
import Stars from '../../components/Stars';
import headStyle from '../styles/HeaderSetting';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import NoImage from '../../components/explore/NoImage';

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
            price:"",
            title:"",
            detail:"",
            type:"",
            isModalVisible: false
        }
      }

    componentDidMount(){
        this.setState({
            listing: this.props.route.params.result,
            location:this.props.route.params.result.location,
            price:this.props.route.params.result.price,
            title:this.props.route.params.result.title,
            detail:this.props.route.params.result.detail,
            type:this.props.route.params.result.type,
        })
    }

    goBack = () =>{
      this.props.navigation.goBack()
    }

    checkAvail = () =>{
        // const { location, price,title, detail, type } = this.state
        console.log("here")
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
        const { listing,isModalVisible } = this.state
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
                            listing.photo.map((i,ind)=>(
                                <Image 
                                  source={i && {uri: i}}
                                  key={ind}
                                  indicator={ProgressBar} 
                                  style={{ height: hp('40%'),flex:1,width:wp('100%')}}
                                />
                            ))
                            :
                            <NoImage />
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
                                <Text style={{fontSize:24}}>{listing.title}</Text>
                                {listing.stars> 0
                                ? (
                                    <Stars
                                    votes={listing.stars}
                                    size={10}
                                    color={colors.green02}
                                    />
                                    )
                                : null}
                                <Text style={{marginTop:10, marginBottom:10}}>{listing.location}</Text>
                            </Body>
                            <Right />
                        </ListItem>
                    <ListItem>
                        <Left>
                            <Body>
                                <Text style={{fontWeight:'normal'}}>
                                    {listing.type}
                                </Text>
                                <Text>hosted by <Text style={{fontWeight:'bold'}}> {listing.userName} </Text> </Text>
                            </Body>
                        </Left>
                        <Right>
                        </Right>
                    </ListItem>
                    <ListItem noBorder>
                        <Left>
                            <Body>
                                <Text style={{fontWeight:'normal'}}>
                                   $ {listing.price} /  {listing.priceType}
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
                            <Text>Save</Text>
                        </Button>
                    </View>
                    :
                    null
              }
            </Container>
        )
    }
}

{/* <Item floatingLabel>
                                <Label>Title</Label>
                                <Input value={listing.title} onChangeText={(text) => this.handleChange('title', key)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>location</Label>
                                <Input value={listing.location} onChangeText={(text) => this.handleChange('location', key)} />
                            </Item> */}