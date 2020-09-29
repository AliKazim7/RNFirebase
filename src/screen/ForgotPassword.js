/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../components/form/InputField';
import Notification from '../components/Notification';
import NextArrowButton from '../components/buttons/NextArrowButton';
import NavBarButton from '../components/buttons/NavBarButton';
import Loader from '../components/Loader';
import styles from './styles/ForgotPassword';
import auth from '@react-native-firebase/auth'
import { Header, Icon, Body, Right, Left } from 'native-base';

export default class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <NavBarButton
      handleButtonPress={() => navigation.goBack()}
      location="left"
      icon={<Icon name="angle-left" color={colors.white} size={30} />}
    />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      loadingVisible: false,
      validEmail: false,
      emailAddress: '',
      passwordSent: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.goToNextStep = this.goToNextStep.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
  }

  handleEmailChange(email) {
    // eslint-disable-next-line
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;

    this.setState({ emailAddress: email });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false });
    }
  }

  goToNextStep() {
    const { emailAddress } = this.state;
    this.setState({ loadingVisible: true });
    setTimeout(() => {
      auth().sendPasswordResetEmail(emailAddress).then(function(){
        // alert("A verification email has been sent to you")
        // this.props.navigation.navigate("LogIn")
        Alert.alert(
          'A verification email has been sent to you',
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
      }).catch(function(error) {
        // An error happened.
        // alert("Invalid Email!")
      });
      // if (emailAddress === 'wrong@email.com') {
      //   this.setState({
      //     loadingVisible: false,
      //     formValid: false,
      //   });
      // } else {
      //   this.setState({
      //     loadingVisible: false,
      //     formValid: true,
      //   });
      // }
    }, 2000);
    this.setState({
      loadingVisible: false,
    });
    setTimeout(() => {
      this.props.navigation.navigate("LogIn")
    }, 6000);
  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  render() {
    const { loadingVisible, formValid, validEmail } = this.state;
    const background = formValid ? colors.saagColor : colors.darkOrange;
    const showNotification = !formValid;
    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: background }, styles.wrapper]}
        behavior="padding"
      >
        <Header transparent>
            <Left>
              <Icon style={{color:'white'}} onPress={() => this.props.navigation.goBack()} type="AntDesign" name="arrowleft" />
            </Left>
            <Body />
            <Right />
          </Header>
        <View style={styles.scrollViewWrapper}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.forgotPasswordHeading}>
                {this.state.passwordSent ? 'A verification email has been sent to you' : 'Forgot your password?'}
            </Text>
            <Text style={styles.forgotPasswordSubheading}>
Enter your email to find your account
            </Text>
            <InputField
              customStyle={{ marginBottom: 30 }}
              textColor={colors.white}
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              onChangeText={this.handleEmailChange}
              showCheckmark={validEmail}
            />
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.goToNextStep}
            disabled={!validEmail}
          />
        </View>
        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />
        <View style={styles.notificationWrapper}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine="No account exists for the requested"
            secondLine="email address."
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}
