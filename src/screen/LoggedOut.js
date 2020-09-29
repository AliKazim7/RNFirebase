/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import RoundedButton from '../components/buttons/RoundedButton';
import NavBarButton from '../components/buttons/NavBarButton';
import styles from './styles/LoggedOut';
import { Icon, Container, Content, Header, Left, Button, Body, Right } from 'native-base'
const airbnbLogo = require('../img/SAAAG.png');

export default class LoggedOut extends Component {
  constructor(props){
    super(props)
    this.state = {
      loadingVisible: false
    }
  }

  componentDidMount(){
    // this.setState({
    //   loadingVisible: true
    // })
    // this.getStorage()
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="right" color={colors.white} text="Log In" />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
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

  render() {
    return (
      // <Container>
        <ScrollView style={styles.wrapper}>
        <Header transparent>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              {/* <Text style={{color:'black'}}>Back</Text> */}
              <Icon type='AntDesign' style={{color:'white'}} name="arrowleft" />
            </Button>
          </Left>
          <Body />
          <Right />
        </Header>
        <View style={styles.welcomeWrapper}>
          <Image
            source={airbnbLogo}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>
Welcome to SAAG.
          </Text>
          <RoundedButton
            text="Continue with Facebook"
            textColor={colors.green01}
            background={colors.white}
            // icon={<Icon name="facebook" size={20} style={styles.facebookButtonIcon} />}
            icon={<Icon type="FontAwesome" name="facebook" size={20} style={styles.facebookButtonIcon} name="facebook" />}
            handleOnPress={this.onFacebookPress}
          />
          <RoundedButton
            text="Continue with Google"
            textColor={colors.green01}
            background={colors.white}
            icon={<Icon type="FontAwesome" name="google" size={20} style={styles.facebookButtonIcon} />}
            handleOnPress={this.onFacebookPress}
          />
          {/* <RoundedButton
            text="Continue with Phone Number"
            textColor={colors.green01}
            background={colors.white}
            icon={<Icon type="FontAwesome" name="mobile" size={20} style={styles.facebookButtonIcon} />}
            handleOnPress={() => this.props.navigation.navigate('PhoneRegister')}
          /> */}
          <RoundedButton
            text="Create Account with Mail"
            textColor={colors.white}
            handleOnPress={() => this.props.navigation.navigate('EmailRegister')}
          />
          

          <View style={styles.termsAndConditions}>
            <Text style={styles.termsText}>
              By tapping Continue, Create Account or More
            </Text>
            <Text style={styles.termsText}>
              {' options,'}
            </Text>
            <Text style={styles.termsText}>
              {"I agree to SAAG's "}
            </Text>
            <TouchableHighlight style={styles.linkButton}>
              <Text style={styles.termsText}>
                Terms of Service
              </Text>
            </TouchableHighlight>
            <Text style={styles.termsText}>
              ,
            </Text>
            <TouchableHighlight style={styles.linkButton}>
              <Text style={styles.termsText}>
                Payments Terms of Service
              </Text>
            </TouchableHighlight>
            <Text style={styles.termsText}>
              ,
            </Text>
            <TouchableHighlight style={styles.linkButton}>
              <Text style={styles.termsText}>
                Privacy Policy
              </Text>
            </TouchableHighlight>
            <Text style={styles.termsText}>
              , and
            </Text>
            <TouchableHighlight style={styles.linkButton}>
              <Text style={styles.termsText}>
                Nondiscrimination Policy
              </Text>
            </TouchableHighlight>
            <Text style={styles.termsText}>
              .
            </Text>
          </View>
        </View>
      </ScrollView>
      // </Container>
    );
  }
}
