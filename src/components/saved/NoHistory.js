import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet, Image,
  ScrollView, FlatList, TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-image-progress';
import { Body, Card, CardItem, Container, H1, H2,
  Left,
  List,
  ListItem,
  Text,
  Thumbnail, } from 'native-base';
import ProgressBar from 'react-native-progress/Bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import colors from '../../styles/colors';

export default class NoHistory extends Component {
  constructor(props){
    super(props)
    this.state = {
      listing : []
    }
  }

  componentDidMount(){
    if(this.props.listing.length > 0){
      this.setState({
        listing: this.props.listing
      })
    } else {
      this.setState({
        listing:[]
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.listing.length > 0){
      this.setState({
        listing: nextProps.listing
      })
    } else {
      this.setState({
        listing:[]
      })
    }
  }

  NoOrders = () =>{
    return(
      <View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.heading}>
  Previous Orders
          </Text>
          <Text style={styles.description}>
  You don't have any orders listed.
          </Text>
          <Text style={styles.description}>
  You can orders item from the Home Page.
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableHighlight style={styles.findHomesButton}>
            <Text style={styles.findHomesButtonText}>
  Order Items
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  TotalOrder = () =>{
    return(
      <View>
        <List>
          {
            this.state.listing.map((item, index)=>(
              <ListItem key={index}>
                <Left style={{flex:1}}>
                  {
                    item.photo !== undefined 
                    ?
                    <FastImage style={{ height: hp('8%'), width:wp('18%'), borderRadius:50}} resizeMode="center" source={item.photo[0] && {uri:item.photo[0]}} />
                    :
                    <Image style={{ height: hp('5%'), width:wp('10%')}} resizeMode="contain" source={require('../../img/noImage.jpeg')}  />
                  }
                </Left>
                <Body style={{flex:6}}>
                  <Text>
                    {item.title}
                  </Text>
                </Body>
              </ListItem>
            ))
          }
        </List>
      </View>
    )
  }

  render(){
    return(
      <Container>
        {
          this.state.listing.length > 0
          ?
          this.TotalOrder()
          :
          this.NoOrders()
        }
      </Container>
    )
  }

}

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  heading: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 40,
    color: colors.gray04,
    marginTop: 70,
    paddingLeft: 20,
    paddingRight: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray04,
    paddingLeft: 20,
    paddingRight: 20,
  },
  footer: {
  	position: 'absolute',
  	width: '100%',
  	height: 80,
  	bottom: 0,
  	borderTopWidth: 1,
  	borderTopColor: colors.gray05,
  	paddingLeft: 20,
  	paddingRight: 20,
  },
  findHomesButton: {
  	paddingTop: 15,
  	paddingBottom: 15,
  	marginTop: 16,
  	borderRadius: 3,
  	backgroundColor: colors.pink,
  },
  findHomesButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});