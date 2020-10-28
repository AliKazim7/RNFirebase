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
      loadingVisible: true
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

  getDocID = async() => {
    return new Promise((resolve, reject)=>{
      firestore().collection('Users').where('uid', '==', this.state.userID).get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          resolve(doc.id)
        });
    })
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
        const emailAddress = res[0].email
        const firstName = res[0].firstName
        const receiveEmail = res[0].receiveEmail
        const gender = res[0].Gender
        const PhoneNumber = res[0].PhoneNumber
        const DoB = res[0].DoB
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
  getApi = async() =>{
    return new Promise((resolve, reject)=>{
      auth().onAuthStateChanged(user => {
        if (!user) {
        } else {
          resolve(user.uid)
        }
      })
    })
  }

  getUSERDATA = async(userID) =>{
    let result = []
    return new Promise((resolve, reject)=>{
      firestore()
        .collection('Users')
        .where('uid', '==', userID)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            // resolve(documentSnapshot.data())
            result.push(documentSnapshot.data())
          });
          resolve(result)
        });
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
    if(key === "male"){
      this.setState({
        gender: key,
        isVisible: false
      })
    } else if(key === "female"){
      this.setState({
        gender:key,
        isVisible: false
      })
    } else if(key === "other"){
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
    if (PhoneNumber && Email && gender && DoB  &&  FirstName) {
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
    console.log("userID", this.state.userID)
    return (
      <Container style={{backgroundColor: background}}>
        <Header transparent>
            <Left>
              {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}> */}
                <Icon style={{color:'white'}} onPress={() => this.props.navigation.goBack()} type="AntDesign" name="arrowleft" />
              {/* </TouchableOpacity> */}
            </Left>
            <Body />
            <Right>
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
              <Input value={this.state.FirstName} style={{color:'white'}} onChangeText={(text) => this.handleLastName('FirstName', text)} />
            </Item>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrowdown" type="AntDesign" /> }
                placeholder="Gender"
                placeholderStyle={{ color: "white" }}
                placeholder="Gender"
                textStyle={{ color: "white" }}
                itemTextStyle={{ color: 'white' }}
                placeholderIconColor="#007aff"
                style={{ width: wp('100%') }}
                selectedValue={this.state.gender}
                onValueChange={this.changeCheck.bind(this)}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
              <DatePicker
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="Select date"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "white" }}
                onDateChange={this.setDate}
                disabled={false}
              />
              <Text style={{color:'white', marginLeft:5, borderBottomColor:'white', borderBottomWidth:1}}>
                Date: {this.state.DoB.toString()}
              </Text>
            <Item style={styles.inputStyle} stackedLabel>
              <Label style={{ color: colors.white}}>Email</Label>
              <Input value={this.state.Email} keyboardType="email-address" style={{color:'white'}} onChangeText={(text) => this.handleLastName('Email', text)} />
            </Item>
            <Item style={styles.inputStyle} stackedLabel>
              <Label style={{ color: colors.white}}>Phone Number</Label>
              <Input keyboardType="phone-pad" value={this.state.PhoneNumber} style={{color:'white'}} onChangeText={(text) => this.handleLastName('PhoneNumber', text)} />
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