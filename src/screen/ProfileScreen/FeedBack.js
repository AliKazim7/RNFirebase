import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView, TouchableOpacity
} from 'react-native';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import styles from '../styles/LogIn';
import PickerForm from '../../components/form/PickerForm';
import { Content, H1, Container, Left, Button, Header, Body, Right, Icon, Title, H3, Item, Label, Textarea } from 'native-base';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { addFeedBack, getUSERID } from '../../services/service';

export default class FeedBack extends Component {
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
      feedBack:'',
      isDisabled: true,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  async componentDidMount(){
    const userID = getUSERID()
    userID.then(res =>{
      this.setState({
        userID: res
      })
    })
  }

  handleNextButton = async () => {
   if(this.state.emailAddress !== "" && this.state.feedBack !== ""){
      this.setState({
        loadingVisible: true
      })
      const addFeed = addFeedBack(this.state.feedBack, this.state.emailAddress, this.state.userID)
      addFeed.then(response =>{
        if(response === true){
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
      })
   }
  }

  handleText = value =>{
    this.setState({
      feedBack: value
    }) 
  }

  handleEmailChange(email) {
    // eslint-disable-next-line
    this.setState({ emailAddress: email });
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,validFirstName, validLastName, validNewPass
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <Container style={{backgroundColor: colors.saagColor}}>
       <Header transparent  style={{marginBottom:20}}>
          <Left >
            <Icon style={{color:'white'}} onPress={()  => this.props.navigation.goBack()} type="AntDesign" name="arrowleft" />
          </Left>
          <Body />
          <Right>
            <TouchableOpacity onPress={() => this.handleNextButton()}>
              <Text style={{color:'white'}}>SEND</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={styles.scrollViewWrapper}>
          
        <View style={{paddingLeft:'5%', marginTop:40, marginBottom:20}}>
           <H1 style={{color:'white'}}>
                How we are doing?
            </H1>
            <Text style={{fontWeight:'normal',marginTop:20,marginRight:20, justifyContent:'flex-start', color:'white'}}>
              We’re always working to improve the SAAG experience, so we’d love to hear what’s working and how we can do better.
              This isn’t a way to contact us, though. We can’t respond to feedback or bug reports individually. If you have a question or need help resolving a problem, you’ll find answers in our Help Center, or you can contact us.
            </Text>
        </View>
          <ScrollView style={styles.scrollView}>
            <InputField
              labelText="Topic"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleEmailChange}
              showCheckmark={validEmail}
              autoFocus
            />
            <Textarea rowSpan={5} value={this.state.feedBack} style={{color:'white'}} placeholder="Write the feedback" onChangeText={(text) => this.handleText(text)} placeholderTextColor="white" bordered />
          </ScrollView>
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
      </Container>
    );
  }
}