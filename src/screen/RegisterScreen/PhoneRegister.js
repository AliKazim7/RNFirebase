import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import ActionCreators from '../redux/actions';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import NavBarButton from '../../components/buttons/NavBarButton';
import styles from '../styles/LogIn'
import auth from '@react-native-firebase/auth'
import PhoneInput from 'react-native-phone-input'
import { Header, Left, Button,Icon, Container } from 'native-base';
import CodeInput from 'react-native-code-input';
const airbnbLogo = require('../../img/airbnb-logo.png');

export default class PhoneRegister extends Component {
  static navigationOptions = ({ navigation }) => ({
    // headerRight: <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="right" color={colors.white} text="Log In" />,
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
      phoneNumber:'',
      showPinCode:false,
      loadingVisible: false,
      confirmResult:null
    };

    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentDidMount(){
  }

  toggleNextButtonState() {
  }

  signInWithPhoneNumber = async (value) =>{
    const confirmtaion = await auth().signInWithPhoneNumber(value)
    this.setState({
      confirmtaion
    })
  }

  handleNextButton = async() =>{
    this.setState({
      loadingVisible:true
    })
    const data = "".concat("+" , this.state.phoneNumber)
    const data0 = this.phone.getValue()
    const confirmtaion = await auth().signInWithPhoneNumber(data0)
    .then(result =>{
      this.setState({
        showPinCode: true,
        loadingVisible: false,
        confirmResult:result
      })  
    })
    .catch(error =>{
      this.setState({
        showPinCode: true,
        loadingVisible: false,
      })
    })
  } 

  // selectCountry = (value) =>{
  //   const data = value.concat("+" , this.phone.getCountryCode(value))
  //   this.setState({
  //     phoneNumber: this.phone.getCountryCode(value)
  //   })
  // }

  changePhoneNumber = (value) => {
    this.setState({
      phoneNumber: value
    })
  }

  _onFinishCheckingCode1 = async (value) => {
    const { confirmResult } = this.state
    if(value.length == 6){
      confirmResult.confirm(verificationCode)
      .then(user => {
        this.setState({ userId: user.uid })
        alert(`Verified! ${user.uid}`)
      })
      .catch(error => {
        alert(error.message)
    })
  }
    // const data = value.concat("+" , value)
    // this.setState({
    //   phoneNumber: value
    // })
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,validFirstName, validLastName, validNewPass
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.saagColor : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <Container  style={[{ backgroundColor: background }, styles.wrapper]}>
        <Header transparent style={{marginBottom:40}}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              
            <Icon style={{color:'black'}} name="arrow-back" />
            </Button>
          </Left>
      </Header>
      <KeyboardAvoidingView
        style={[{ backgroundColor: background }, styles.wrapper]}
        behavior="padding"
      >
        <View style={styles.scrollViewWrapper}>
           <ScrollView style={styles.scrollView}>
            <View>
              {
                !this.state.showPinCode 
                ? 
                <PhoneInput 
                  ref={ref => { this.phone = ref }}
                  style={{borderBottomWidth:2,marginTop:25, marginBottom:25, borderBottomColor:'black'}} 
                  allowZeroAfterCountryCode={false} 
                  textProps={{placeholder:"3310499184"}}
                  textStyle={{fontSize: 16,marginTop:15, marginBottom:15,marginLeft:15}}
                  value={this.state.phoneNumber}
                  onChangePhoneNumber={this.changePhoneNumber}
                  onSelectCountry={this.selectCountry}
                />
              :
                <CodeInput
                  ref="codeInputRef2"
                  // secureTextEntry
                  activeColor='rgba(0,0,0,0.3)'
                  inactiveColor='rgba(0,0,0,0.3)'
                  autoFocus={false}
                  inputPosition='center'
                  // size={50}
                  // code
                  codeLength={6}
                  onFulfill={(code) => this._onFinishCheckingCode1(code)}
                  containerStyle={{ marginTop: 30 }}
                  codeInputStyle={{ borderWidth: 1.5 }}
                />
              }
            </View>
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton}
            disabled={this.toggleNextButtonState()}
          />
        </View>
        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />
        <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine="Those credentials don't look right."
            secondLine="Please try again."
          />
        </View>
      </KeyboardAvoidingView>
      </Container>
    );
  }
}