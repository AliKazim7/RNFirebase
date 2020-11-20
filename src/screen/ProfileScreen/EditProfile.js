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
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Header, Left, Button, Body, Right, Container, Icon, Item, Label, Input, H1, CheckBox, ListItem, List, DatePicker, Picker } from 'native-base';
import Modal from 'react-native-modal'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Loader from '../../components/Loader';
import moment from 'moment';
import { getUSERDATA, getUSERDOC, getUSERID,updateUserEdit } from '../../services/service';
export default class EditProfile extends Component {
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
      formValid: true,
      validEmail: false,
      validFirstName: false,
      validLastName: false,
      validNewPass:false,
      Email: '',
      PhoneNumber: '',
      DoB:new Date() ,
      Gender:'',
      LastName:'',
      FirstName:'',
      password:'',
      gender:'',
      userID:'',
      receiveEmail:'',
      isVisible: false,
      validPassword: false,
      loadingVisible: false,
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.changeCheck = this.changeCheck.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.handleLastName = this.handleLastName.bind(this)
    this.setDate = this.setDate.bind(this);
  }

  async handleNextButton() {
    this.setState({
      // loadingVisible: true
    })
    const userDATA = getUSERDOC(this.state.userID)
    userDATA.then(response=>{
      if(response && response){
        const updatedDoc = updateUserEdit(
          this.state.gender,
          this.state.PhoneNumber,
          this.state.DoB,
          this.state.Email,
          this.state.receiveEmail,
          this.state.FirstName,
          response
        )
        updatedDoc.then(
          res =>{
            if(res === true){
              this.setState({
                loadingVisible: false
              })
              this.props.navigation.navigate('ProfileTab')
            } else {
            this.setState({
              loadingVisible: false
            })
            this.props.navigation.navigate('ProfileTab')
            }
          }
        )
      }
    })
  }
  async componentDidMount(){
    this.setState({
      loadingVisible: true
    })
    const userID = getUSERID()
    userID.then(response =>{
      const getName = getUSERDATA(response)
      getName.then(res =>{
        const emailAddress = res.email
        const firstName = res.firstName
        const receiveEmail = res.receiveEmail
        const gender = res.Gender
        const PhoneNumber = res.PhoneNumber
        const DoB = res.DoB
        this.setState({
          FirstName:firstName !== undefined ? firstName : '',
          Email: emailAddress !== undefined ? emailAddress : '',
          loadingVisible: false,
          DoB:DoB !== undefined ? DoB : '',
          receiveEmail: receiveEmail !== undefined ? receiveEmail : false,
          gender: gender !== undefined ?  gender : '',
          PhoneNumber: PhoneNumber !== undefined ? PhoneNumber : '',
          userID: response
        })
      })
    })
  }
  handleCloseNotification() {
    this.setState({ formValid: true });
  }


  toggleModal = () =>{
    this.setState({
      isVisible: !this.state.isVisible,
    })
  }

  handleLastName = (key ,name) =>{
    this.setState({
      [key]: name,
    })
  }

  changeCheck = (key) =>{
    if(key === "Male"){
      this.setState({
        gender: key,
        isVisible: false
      })
    } else if(key === "Female"){
      this.setState({
        gender:key,
        isVisible: false
      })
    } else if(key === "Other"){
      this.setState({
        gender:key,
        isVisible: false
      })
    } 
  }

  changeCheck1 = (key) =>{
    this.setState({
      receiveEmail:!this.state.receiveEmail
    })
  }

  toggleNextButtonState() {
    const { PhoneNumber, Email, gender, DoB, FirstName } = this.state;
    if (PhoneNumber && Email &&  FirstName) {
        return false
      }
    return true;
  }

  setDate(newDate) {
    this.setState({ DoB: moment(newDate).format('L') });
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,validFirstName, validLastName, validNewPass
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.saagColor : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <Container style={{backgroundColor: background}}>
        <Header transparent>
            <Left style={{paddingLeft:10}}>
              {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}> */}
                <Icon style={{color:'white'}} onPress={() => this.props.navigation.goBack()} type="AntDesign" name="arrowleft" />
              {/* </TouchableOpacity> */}
            </Left>
            <Body />
            <Right style={{paddingRight:10}}>
              <TouchableOpacity disabled={this.toggleNextButtonState()} onPress={this.handleNextButton}>
                <Text style={{color:colors.white, fontSize:16}}>Save</Text>
              </TouchableOpacity>
            </Right>
          </Header>
        <View style={{marginLeft:20, marginRight:20}}>
          <H1 style={{marginBottom:20, color: colors.white}}>Edit personal Info</H1>
          <ScrollView style={styles.scrollView}>
            <Item style={styles.inputStyle} stackedLabel>
              <Label style={{ color: colors.white}}>User Name</Label>
              <Input value={this.state.FirstName} style={{color:'white', fontSize:15}} onChangeText={(text) => this.handleLastName('FirstName', text)} />
            </Item>
            <Item style={styles.inputStyle} stackedLabel>
              <Label style={{ color: colors.white}}>Email</Label>
              <Input value={this.state.Email} keyboardType="email-address" style={{color:'white', fontSize:15}} onChangeText={(text) => this.handleLastName('Email', text)} />
            </Item>
            <Item style={styles.inputStyle} stackedLabel>
              <Label style={{ color: colors.white}}>Phone Number</Label>
              <Input keyboardType="phone-pad" value={this.state.PhoneNumber} style={{color:'white', fontSize:15}} onChangeText={(text) => this.handleLastName('PhoneNumber', text)} />
            </Item>
            <View style={{flexDirection:'row', marginTop:20}} >
              <Left style={{flex:0.3, justifyContent:'flex-start'}}>
                <CheckBox color="white" onPress={() => this.changeCheck1()} checked={this.state.receiveEmail} />
              </Left>
              <Body style={{flex:2, alignItems:'flex-start'}}>
                <Text style={{color:'white'}}>
                  Receive occasional emails from the SAAG team 
                </Text>
              </Body>
            </View>
          </ScrollView>
        </View>
        <Loader
          modalVisible={this.state.loadingVisible}
          animationType="fade"
        />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  inputStyle:{
    marginTop:10
  },
  scrollView: {
    // paddingLeft: 30,
    // paddingRight: 30,
    // paddingTop: 20,
    // paddingBottom:20,
    // flex: 1,
  },
})