import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet, Image,
  ScrollView, FlatList, TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-image-progress';
import { Card, CardItem, Container, H1, H2,
  Text,
  Thumbnail, } from 'native-base';
import ProgressBar from 'react-native-progress/Bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import colors from '../../styles/colors';

export default class NoOrders extends Component {
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
Current Orders
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
        <FlatList
        data={this.state.listing}
        renderItem={({item, index})=>(
          <TouchableOpacity 
          onPress={() => this.props.onPress(item)} 
          key={index}
        >
          <Card>
            <CardItem cardBody>
              {
                item.listItem.photo !== undefined
                ?
                <FastImage 
                  source={item.listItem.photo[0] && {uri:item.listItem.photo[0]}} 
                  indicator={ProgressBar} 
                  style={{
                    flex:1, height:hp('40%')
                  }}/>
                  :
                  <Image 
                    resizeMode="cover"
                    style={{
                    width:wp('100%'),
                    flex:1,
                    // backgroundColor:'red',
                    height: hp('40%')}}
                    source={require('../../img/noImage.jpeg')} 
                  />
              }
            </CardItem>
            <CardItem cardBody style={{marginLeft:10,marginTop:10, marginBottom:10, backgroundColor:'white'}}>
              <View style={{marginTop:10, marginBottom:10}}>
                <Text note>
                  Anytime
                </Text>
                <H2 style={styles.contentType}>
                  {item.listItem.location}
                </H2>
                <Text style={styles.contentType}>1 stay</Text>
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
        )}
        />
      </View>
    )
  }

  render() {
  	return (
    <Container>
      {
        this.state.listing.length > 0
        ?
        this.TotalOrder()
        :
        this.NoOrders()
      }
    </Container>
  	);
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
  	borderTopColor: colors.black,
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

  wrapper: {
    display: 'flex',
    flex:1
    // backgroundColor: colors.white,
  },
  contentType:{
    marginTop:10,
  },
  CardStyle:{
    borderRadius:10,
    flex:1,
    width:wp('100%'),
    // marginLeft:wp('5%'), 
    borderWidth:1, 
    borderColor:'white',
    backgroundColor:'red',
    marginTop:50
  }
});