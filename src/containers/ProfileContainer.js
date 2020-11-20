import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity, 
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import { Container, List, Content, Card,ListItem, CardItem, Thumbnail, Text, Button, Left, Body, Right, Icon, H2 } from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Default from '../img/user.png'
import { getUSERDATA, getUSERID } from '../services/service';
export default class ProfileContainer extends Component {

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      userName: '',
      email:'',
      photo:'',
      userPhoto:'',
      listing:[]
    }
  }

  async componentDidMount(){
    this.setState({
      loading: true
    })
    this.apiCall()
  }

  apiCall = async() =>{
    const userData = getUSERID()
    userData.then(response =>{
      if(response){
        const getName = getUSERDATA(response)
        getName.then(res =>{
          console.log("respomse come here", res)
          const emailAddress = res.email
          const firstName = res.firstName
          const photo = res.photo
          const password = res.password
          this.setState({
            userName:firstName,
            email: emailAddress,
            loading: false,
            email: emailAddress,
            userPhoto: photo
          })
        })
      }
    })
  }

  logout = async() =>{
    auth()
    .signOut()
    .then(() => {
      this.props.navigation.navigate("LogIn")
    });
  }

  onRefresh = async() =>{
    this.setState({
      loading:true
    })
    this.apiCall()
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <ScrollView refreshControl={
            <RefreshControl refreshing={this.state.loading} onRefresh={this.onRefresh} />
          }>
            <Card style={{marginTop:20}}>
              <CardItem bordered>
                <Left style={{width:40, flex:1.5, marginTop:10}}>
                  {
                    this.state.userPhoto
                    ?
                    <View>
                      {
                          Platform.OS === 'android'
                          ?
                          <Thumbnail resizeMethod="auto" source={this.state.userPhoto ? {uri:this.state.userPhoto} : null}  />
                          :
                          <Image style={{ height: heightPercentageToDP('8%'), width:wp('18%'), borderRadius:50}} resizeMode="center" source={this.state.userPhoto ? {uri:this.state.userPhoto} : null} />
                      }
                    </View>
                    :
                    <Image style={{ height: heightPercentageToDP('5%'), width:wp('10%')}} resizeMode="contain" source={require('../img/images.png')} />
                  }
                </Left>
                <Body style={{flex:4}}>
                    <H2 style={{marginTop:10}}>{this.state.userName}</H2>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("UserProfile")}>
                      <Text note>View Profile</Text>
                    </TouchableOpacity>
                </Body>
                <Right />
              </CardItem>
              <List>
                <ListItem itemDivider>
                  <Text>ACCOUNT SETTINGS</Text>
                </ListItem>
                <ListItem onPress={() => this.props.navigation.navigate("EditProfile")}>
                    <Left>
                        <Text style={{color:'black', fontSize:15}}>Personal Information</Text>
                    </Left>
                    <Right>
                    <Icon type="SimpleLineIcons" name="user" />             
                    </Right>
                  </ListItem>
                    <ListItem onPress={() => this.props.navigation.navigate('Notifications')}>
                      <Left>
                        <Text>Notification</Text>
                      </Left>
                      <Right>
                        <Icon type="SimpleLineIcons" name="bell" />
                      </Right>
                    </ListItem>
                <ListItem bordered onPress={() => this.props.navigation.navigate("PaymentScreen")}>
                      <Left>
                        <Text style={{color:'black', fontSize:15}}>Payments and payouts</Text>
                      </Left>
                      <Right>
                        <Icon type="FontAwesome" name="credit-card-alt" />
                      </Right>
                  </ListItem>
                  <ListItem bordered onPress={() => this.props.navigation.navigate("MyOrders")}>
                      <Left>
                        <Text style={{color:'black', fontSize:15}}>My Orders</Text>
                      </Left>
                      <Right>
                        <Icon type="FontAwesome" name="list-alt" />
                      </Right>
                  </ListItem>
              </List>
              <List>
                <ListItem itemDivider>
                  <Text>Become a supplier</Text>
                </ListItem>
                <ListItem bordered onPress={() => this.props.navigation.navigate('AddListDetail')}>
                          <Left>
                            <Text style={{color:'black'}}>List your gear</Text>
                          </Left>
                          <Right>
                            <Icon type="FontAwesome" name="gear" />
                          </Right>
                    </ListItem>
              </List>
              <List>
                <ListItem itemDivider>
                  <Text>Invite Friends</Text>
                </ListItem>
                  <ListItem onPress={() => this.props.navigation.navigate('InviteFriends')} bordered>
                        <Left>
                          <Text style={{color:'black', fontSize:15}}>Get 15% off for your next two gears</Text>
                        </Left>
                        <Right>
                          <Icon type="Feather" name="gift" />
                        </Right>
                  </ListItem>
              </List>
              <List>
                <ListItem itemDivider>
                  <Text>SUPPORT</Text>
                </ListItem>
                <ListItem bordered>
                        <Left>
                          <Text>How SAAG works</Text>
                        </Left>
                        <Right>
                          <Icon type="FontAwesome" name="globe" />
                        </Right>
                      </ListItem>
                <ListItem bordered>
                        <Left>
                          <Text>Get help</Text>
                        </Left>
                        <Right>
                          <Icon type="FontAwesome" name="question" />
                        </Right>
                </ListItem>
                  <ListItem bordered onPress={() => this.props.navigation.navigate('FeedBack')}>
                          <Left>
                            <Text>Give us feedback</Text>
                            </Left>
                          <Right>
                            <Icon type="AntDesign" name="creditcard" />
                          </Right>
                        </ListItem>
              </List>
              <List>
                <ListItem itemDivider>
                  <Text>LEGAL</Text>
                </ListItem>
                      <ListItem onPress={() => this.props.navigation.navigate('TermsService')}>
                        <Left>
                          <Text>Terms of services</Text>
                        </Left>
                        <Right>
                          <Icon type="FontAwesome" name="file-text" />
                        </Right>
                      </ListItem>
              </List>
                    <ListItem  onPress={() => this.logout()}>
                      <TouchableOpacity onPress={() => this.logout()}>
                        <Text style={{color:'black'}}>Log Out</Text>
                      </TouchableOpacity>
                    </ListItem>
              
            </Card>
          </ScrollView>
        </Content>
        <Loader
         modalVisible={this.state.loading}
         animationType="fade"
         />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    padding: 50,
  },
});