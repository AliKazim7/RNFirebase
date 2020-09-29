import React from 'react'
import { StatusBar, AppRegistry } from 'react-native'
// import { Provider } from 'react-redux';
// import { createStore } from 'redux'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { configureStore, Root } from './src/navigators/AppNavigator';
import RegisterAccount from './src/screen/RegisterAccount'
import LoggedOut from './src/screen/LoggedOut';
import TurnOnNotifications from './src/screen/TurnOnNotifications'
import LogIn from './src/screen/LogIn';
import ProfileContainer from './src/containers/ProfileContainer';
import InboxContainer from './src/containers/InboxContainer';
import SavedContainer from './src/containers/SavedContainer';
import TripsContainer from './src/containers/TripsContainer';
import ExploreContainer from './src/containers/ExploreContainer';
import LoggedInTabNavigator from './src/navigators/LoggedInTabNavigator';
import Home from './src/screen/Home';
import ForgotPassword from './src/screen/ForgotPassword';
import EmailRegister from './src/screen/RegisterScreen/EmailRegister';
import PhoneRegister from './src/screen/RegisterScreen/PhoneRegister';
import auth from '@react-native-firebase/auth'
import ImageList from './src/components/ImageList';
// import rootReducer from './src/redux/reducers'

const Stack = createStackNavigator()
// const store = createStore(rootReducer)
function RegisterAccounts(){
  return(
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="LoggedOut" component={LoggedOut} />
      <Stack.Screen options={{headerShown: false}} name="EmailRegister" component={EmailRegister} />
      <Stack.Screen options={{headerShown: false}} name="PhoneRegister" component={PhoneRegister} />
    </Stack.Navigator>
  )
}

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        loadingVisible: true,
        userLoggedIn: false
    }
}

componentDidMount(){
  this.getData()
}

componentWillUnmount(){
  this.getData()
}

getData = async() =>{
    auth().onAuthStateChanged(user => {
      if (!user) {
        this.setState({
          userLoggedIn: false,
        })
        // this.props.navigation.navigate("LogIn")
      } else {
        this.setState({
          userLoggedIn: true
        })
      }
    })
}
  render(){
    return(
      <NavigationContainer>
        {/* <Provider store={store}> */}
          <Stack.Navigator>
            {/* <Stack.Screen options={{headerShown: false}} name="PhoneRegister" component={PhoneRegister} /> */}
            <Stack.Screen options={{headerShown: false}} name="LogIn" component={LogIn} />
            <Stack.Screen options={{headerShown: false}} name="LoggedIn" component={LoggedInTabNavigator} />
            <Stack.Screen options={{headerShown: false}} name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen options={{headerShown: false}} name="LoggedOut" component={RegisterAccounts} />
             {/* <Stack.Screen options={{headerShown: false}} name="LoggedOut" component={LoggedOut} /> */}
            <Stack.Screen options={{headerShown: false}} name="RegisterAccount" component={RegisterAccount} />
            <Stack.Screen options={{headerShown: false}} name="TurnOnNotifications" component={TurnOnNotifications} />
            {/* <Stack.Screen options={{headerShown: false}} name="LoggedIn" component={LoggedInTabNavigator} /> */}
          </Stack.Navigator>
        {/* </Provider> */}
      </NavigationContainer>
    )
  }
}