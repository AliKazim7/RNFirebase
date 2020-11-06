/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Icon, Header, Left, Body, Right } from 'native-base'
import colors from '../styles/colors';
import InputField from '../../components/form/InputField';
import RadioInput from '../../components/form/RadioInput';
import RoundedButton from '../../components/buttons/RoundedButton';
import styles from '../styles/CreateList';
import headStyle from '../styles/HeaderSetting';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

class CreateModal extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Icon
          name="md-close"
          size={30}
          color={colors.lightBlack}
        />
      </TouchableOpacity>
    ),
    headerStyle: styles.headerStyle,
  });

  constructor(props) {
    super(props);

    this.state = {
      privacyOption: 'private',
      // location: props.navigation.state.params.listing.location,
      location:'',
      loading: false,
      listing:[],
      userID:''
    };

    this.listCreated = false;
    this.selectPrivacyOption = this.selectPrivacyOption.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleCreateList = this.handleCreateList.bind(this);
  }

  componentDidMount(){
    this.getData()
    this.setState({
      listing: this.props.route.params.listing
    })
}

  getData = async() =>{
    auth().onAuthStateChanged(user => {
        if (!user) {
          this.setState({
              loadingVisible: false
          })
        } else {
          this.setState({
            loadingVisible: false,
            userID: user.uid
          })
        }
      })
  }
  selectPrivacyOption(privacyOption) {
    this.setState({ privacyOption });
  }

  handleLocationChange(location) {
    this.setState({ location });
  }

  handleCreateList() {
    const { navigation } = this.props;
    const { listing, location, privacyOption, userID } = this.state
    const { goBack } = navigation;
    this.setState({ loading: true });
    setTimeout(() => {
      firestore().collection('SavedPlaces')
      .add({
        location: listing.location,
        favourite: true,
        price: listing.price,
        type:listing.type,
        title:listing.title,
        stars:listing.totalRating,
        segmentType:listing.segmentType,
        priceType:listing.priceType,
        photo:listing.photo,
        id:listing.id,
        color:listing.color,
        listTitle: location,
        userID: userID
      })
      .then(() =>{
        this.setState({ loading: false }, () => goBack());
      })
    }, 2000);
  }

  render() {
    const { privacyOption, location, loading } = this.state;

    return (
      <View style={styles.wrapper}>
        <Header transparent>
          <Left>
            <Icon onPress={() => this.props.navigation.goBack()} name="arrowleft" type="AntDesign" />
          </Left>
          <Body />
          <Right />
        </Header>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.heading}>
            Create a list
          </Text>
          <View style={styles.content}>
            <View style={styles.inputWrapper}>
              <InputField
                labelText="Title"
                labelTextSize={16}
                labelTextWeight="400"
                labelColor={colors.lightBlack}
                textColor={colors.lightBlack}
                placeholder={location}
                defaultValue={location}
                borderBottomColor={colors.gray06}
                inputType="email"
                inputStyle={{ fontSize: 18, fontWeight: '400', paddingBottom: 30 }}
                onChangeText={this.handleLocationChange}
                showCheckmark={false}
                autoFocus
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.createButton}>
          <RoundedButton
            text="Create"
            textColor={colors.white}
            textAlign="left"
            background={colors.green01}
            borderColor="transparent"
            iconPosition="left"
            disabled={!location}
            loading={loading}
            icon={(
              <View style={styles.buttonIcon}>
                <FontAwesomeIcon name="angle-right" color={colors.white} size={30} />
              </View>
            )}
            handleOnPress={this.handleCreateList}
          />
        </View>
      </View>
    );
  }
}


// CreateList.propTypes = {
//   navigation: PropTypes.shape({
//     state: PropTypes.shape({
//       params: PropTypes.shape({
//         listing: PropTypes.shape({
//           location: PropTypes.string,
//         }),
//       }),
//     }),
//   }).isRequired,
// };

// export default connect(null, mapDispatchToProps)(CreateList);
export default CreateModal
