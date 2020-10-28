import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import styles from '../styles/LogIn';
import PickerForm from '../../components/form/PickerForm';
import { Content, H1, Container, Left, Button, Header, Body, Right, Icon, Title, H3, List, ListItem } from 'native-base';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { widthPercentageToDP } from 'react-native-responsive-screen';

export default class Notifications extends Component {
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
      emailAddress: '',
      loadingVisible: false,
      userID:'',
      isDisabled: true,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  async componentDidMount(){
    const UserID = await this.getUSERID()
    if(UserID){
      this.setState({
        userID: UserID
      })
    }
  }

  getUSERID = async() =>{
    return new Promise((resolve, reject)=>{
      auth().onAuthStateChanged(user => {
        if (!user) {
        } else {
          resolve(user.uid)
        }
      })
    })
  }

  handleNextButton = async () => {
    this.setState({
      loadingVisible: true
    })
    const userDATA = await this.getDocID()
    if(userDATA && userDATA){
      firestore().collection('Users').doc(userDATA).update({
        workEmail: this.state.emailAddress
      }).then(() => {
        this.setState({
          loadingVisible: false
        })
        this.props.navigation.navigate('ProfileTab')
      })
      .catch(e =>{
        this.setState({
          loadingVisible: false
        })
        this.props.navigation.navigate('ProfileTab')
      })
    }
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

  handleEmailChange(email) {
    // eslint-disable-next-line
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ emailAddress: email });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true, isDisabled: false });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false, isDisabled: true });
    }
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,validFirstName, validLastName, validNewPass
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <Container>
       <Header transparent>
          <Left >
            <Icon onPress={() => this.props.navigation.goBack()} type="AntDesign" name="arrowleft" />
          </Left>
          <Body />
          <Right />
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
        <List>
            <ListItem noBorder>
              <Left>
                <H1>
                  ACCOUNT SETTINGS
                </H1>
              </Left>
            </ListItem>
            <ListItem>
                <Left>
                    <Text>
                        Notifications
                    </Text>
                </Left>
            </ListItem>
            <ListItem>
                <Left>
                    <Text>
                        Payout method
                    </Text>
                </Left>
            </ListItem>
            <ListItem>
                <Left>
                    <Text>
                        Currency
                    </Text>
                </Left>
            </ListItem>
            <ListItem>
                <Left>
                    <Text>
                        About
                    </Text>
                </Left>
            </ListItem>
            <ListItem>
                <Left>
                    <Text>
                        Advanced Settings
                    </Text>
                </Left>
            </ListItem>
            <ListItem>
                <Left>
                    <Text>
                        Log Out
                    </Text>
                </Left>
            </ListItem>
        </List>
        </ScrollView>
      </Container>
    );
  }
}