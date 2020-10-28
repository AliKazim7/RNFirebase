import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity
} from 'react-native';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import styles from '../styles/LogIn';
import PickerForm from '../../components/form/PickerForm';
import { Header, Left, Button, Body, Right, Icon, List, ListItem, H1, Container, Thumbnail } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { getUSERDATA, getUSERID } from '../../services/service';
export default class UserProfile extends Component {
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
      email:'',
      photo:'',
      userName:'',
      emailAddress: '',
      password: '',
      userPhoto:'',
      accountCreate:'',
      newpassword:'',
      validPassword: false,
      loadingVisible: false,
    };

  }
  async componentDidMount(){
    this.setState({
      loadingVisible: true
    })
    const userData = getUSERID()
    userData.then(response =>{
      if(response){
        const getName = getUSERDATA(response)
        getName.then(res =>{
          const emailAddress = res[0].email
          const firstName = res[0].firstName
          const photo = res[0].photo
          const password = res[0].password
          const accountCreate = res[0].accountCreate
          this.setState({
            userName:firstName,
            email: emailAddress,
            loadingVisible: false,
            email: emailAddress,
            accountCreate: accountCreate,
            userPhoto: photo
          })
        })
      }
    })
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,validFirstName, validLastName, validNewPass
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.saagColor : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
        <Container>
            <Loader
                modalVisible={this.state.loadingVisible}
                animationType="fade"
            />
            <Header transparent style={{marginBottom:30}}>
                <Left>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon type='AntDesign' style={{color:'black'}} name="arrowleft" />
                    </TouchableOpacity>
                </Left>
                <Body />
                <Right>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AddUserImg')}>
                        <Icon type="Octicons" style={{color:'black'}} name="pencil" />
                    </TouchableOpacity>
                </Right>
            </Header>
            <List>
                <ListItem>
                    <Body>
                        <H1>Hi, I'm {this.state.userName} </H1>
                        <Text style={{marginTop:20}}>Joined in {this.state.accountCreate} </Text>
                    </Body>
                    <Right>
                      {
                        this.state.userPhoto
                        ?
                        <Thumbnail  source={this.state.userPhoto ? {uri:this.state.userPhoto} : null}  />
                        :
                        <Icon style={{fontSize:50}} type="FontAwesome" name="user" />
                      }
                    </Right>
                </ListItem>
            </List>
        </Container>
    );
  }
}