import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import transparentHeaderStyle from '../../screen/styles/navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Header, Left, Button, Body, Right, Container, Icon, Item, Label, Input, H1, CheckBox, ListItem, List } from 'native-base';
import Modal from 'react-native-modal'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import colors from '../../screen/styles/colors';
export default class GenderModal extends Component {
  static navigationOptions = ({ navigation }) => ({
    // headerRight: <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="right" color={colors.black} text="Log In" />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerLeft:false,
    headerTintColor: colors.white,
  });

  static onFacebookPress() {
    alert('Facebook button pressed');
  }

  static onCreateAccountPress() {
    alert('Create Account button pressed');
  }

  static onMoreOptionsPress() {
    alert('More options button pressed');
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      gender:'',
      loadingVisible: false,
    };
  }
  async componentDidMount(){
   if(this.props.gender){
       this.setState({
           gender: this.props.gender
       })
    }
  }
  static getDerivedStateFromProps(props, state) {
    if(props.gender){
        this.setState({
            gender: props.gender
        })
     }
  }

  toggleModal = () =>{
  }

  changeCheck = (key) =>{
    this.props.changeCheck(key)
  }

  render() {
    // const background = formValid ? colors.saagColor : colors.darkOrange;
    return (
      <Container style={{backgroundColor: colors.saagColor}}>
        <Modal 
         swipeDirection={['up', 'left', 'right', 'down']} hideModalContentWhileAnimating={true}  backdropColor="black" onBackdropPress={() => this.props.onPress()} style={{backgroundColor:colors.saagColor, height: hp('10%')}} isVisible={this.props.isVisible}>
          <View style={{flex:1, marginLeft:wp('5%'), marginRight:wp('5%'), marginTop:hp('20%')}}>
            <H1 style={{color:'white'}}> 
              Select your gender
            </H1>
            <List>
              <View style={{flexDirection:'row', marginTop:hp('5%')}} >
                <Left style={{flex:0.3, justifyContent:'flex-start',}}>
                  <CheckBox color="white" onPress={() => this.changeCheck('male')} checked={this.state.gender === "male" ? true : false} />
                </Left>
                <Body style={{flex:2, alignItems:'flex-start'}}>
                  <Text onPress={() => this.changeCheck('male')} style={{color:'white'}}>
                    Male
                  </Text>
                </Body>
              </View>
              <View style={{flexDirection:'row', marginTop:hp('5%')}} >
                <Left style={{flex:0.3, justifyContent:'flex-start'}}>
                  <CheckBox color="white" onPress={() => this.changeCheck('female')} checked={this.state.gender === "female" ? true : false} />
                </Left>
                <Body style={{flex:2, alignItems:'flex-start'}}>
                  <Text onPress={() => this.changeCheck('female')} style={{color:'white'}}>
                    Female
                  </Text>
                </Body>
              </View>
              <View style={{flexDirection:'row', marginTop:hp('5%')}} >
                <Left style={{flex:0.3, justifyContent:'flex-start'}}>
                  <CheckBox color="white" onPress={() => this.changeCheck('other')} checked={this.state.gender === "other" ? true : false} />
                </Left>
                <Body style={{flex:2, alignItems:'flex-start'}}>
                  <Text onPress={() => this.changeCheck('other')} style={{color:'white'}}>
                    Other
                  </Text>
                </Body>
              </View>
            </List>
          </View>
        </Modal>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  inputStyle:{
    marginTop:10
  }
})