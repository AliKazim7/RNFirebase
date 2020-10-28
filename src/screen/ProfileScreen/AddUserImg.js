import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text, Container, Header, Left, Body, Right, H1, List, ListItem, Button, Icon, H2, H3,Thumbnail, Input, Item, Label } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import InputField from '../../components/form/InputField';
import HeartButton from '../../components/buttons/HeartButton';
import colors from '../styles/colors';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Loader from '../../components/Loader';
import { getUSERDATA, getUSERDOC, getUSERID, updateUser } from '../../services/service';
export default class AddUserImg extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          formValid: true,
          validEmail: false,
          validFirstName: false,
          imageData: "",
          userWork:'',
          userLocation: '',
          userID:'',
          userDetail: '',
          avatarSource:'',
          disAbled: false,
          newpassword:'',
          validPassword: false,
          loadingVisible: false,
          photourl:'',
          userPhoto:'',
          userLanguage:'',
          photoName: Math.random()
        };
      }

    async componentDidMount(){
      this.setState({
        loadingVisible: false
      })
      const userData = getUSERID()
      userData.then(
        resp =>{
          this.setState({
            userID:resp,
          })
        }
      )
      userData.then(response =>{
        if(response){
          const getName = getUSERDATA(response)
          getName.then(res =>{
            const photo = res[0].photo
            const userWork = res[0].userWork
            const userDetail = res[0].userDetail
            const userLocation = res[0].userLocation
            const userLanguage = res[0].userLanguage
            this.setState({
              loadingVisible: false,
              userPhoto: photo,
              userWork: userWork,
              userLocation: userLocation,
              userDetail: userDetail,
              userLanguage:userLanguage,
              photourl: photo
            })
          })
        }
      })
    }

    clickedImage = async () =>{
        this.setState({
          disAbled: true
        })
        const { photoName } = this.state
        const file = await this.uploadImage()
        if(file && file){
          const uploadTasl = await storage().ref(`images/${photoName}`).putFile(file.uri)
            if(uploadTasl){
                const url = await storage().ref(`images/${photoName}`).getDownloadURL()
                if(url){
                    this.setState({
                      photourl: url,
                      disAbled: false
                    })
                }
            }
        }
    }

    uploadImage = async() =>{
      const options = {
        title: 'Select Avatar',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
       return new Promise((resolve, reject)=>{
            ImagePicker.launchImageLibrary(options, (response) => {
        
                if (response.didCancel) {
                  this.setState({
                    loadingVisible: false
                  })
                } else if (response.error) {
                  this.setState({
                    loadingVisible: false
                  })
                } else if (response.customButton) {
                } else {
                  const source = { uri: response.uri };
              
                  // You can also display the image using data:
                  // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                  this.setState({
                    avatarSource: source,
                    showOptions: false,
                    showIcon: false,
                    imageUri:response.uri,               
                    showImageView:true
                  });
                  setTimeout(function(){
                      resolve(response)
                  }, 1000)
                }
              });
        })
    }

    handleChange = (value) =>{
      this.setState({
        userDetail: value
      })
    }

    handleLocation = (value) =>{
      this.setState({
        userLocation: value
      })
    }

    handleWork = (value) =>{
      this.setState({
        userWork: value
      })
    }

    handleLanguage = (value) =>{
      this.setState({
        userLanguage: value
      })
    }

    handleSave = async() =>{
      this.setState({
        loadingVisible: true
      })
      const userData = getUSERDOC(this.state.userID)
      userData.then(
        response => {
          if(response && response){
            const updatedDoc = updateUser(
              this.state.photourl, 
              this.state.userDetail, 
              this.state.userLanguage, 
              this.state.userLanguage, 
              this.state.userWork,
              response
            )
              updatedDoc.then(res =>{
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
            })
          }
        }
      )
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

    render(){
        return(
            <Container style={{flex:1}}>
                <Loader
                  modalVisible={this.state.loadingVisible}
                  animationType="fade"
                />
                <Header transparent>
                    <Left>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text>X</Text>
                        </TouchableOpacity>
                    </Left>
                    <Right>
                        <TouchableOpacity onPress={() => this.handleSave()}>
                            <Text style={{color:colors.saagColor}} note={this.state.disAbled} >Save</Text>
                        </TouchableOpacity>
                    </Right>
                </Header>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:20, marginLeft:20, marginRight:20, flex:1}}>
               
                <TouchableOpacity onPress={() => this.clickedImage()}>
                    {this.state.avatarSource === "" ?
                    <View style={{backgroundColor:'grey', justifyContent:'center', alignItems:'center'}}>
                        {
                          this.state.userPhoto ? 
                            <Thumbnail source={this.state.userPhoto  ? {uri: this.state.userPhoto} : null} square resizeMode="cover" style={{width:wp('100%'), height:hp('50%')}} /> 
                            : 
                            <Image style={{flex:1, height:hp('60%'), width:wp('100%')}} resizeMode='cover' source={require('../../img/images.png')} />
                        }
                        <View style={styles.addToFavoriteBtn}>
                            <Icon type='FontAwesome5' name="camera-retro" />
                        </View>
                    </View>
                    :
                    <View style={{backgroundColor:'grey'}}>
                        <Thumbnail source={this.state.avatarSource  ? this.state.avatarSource : null} square resizeMode="cover" style={{width:wp('100%'), height:hp('50%')}} />
                    </View>
                    }
                </TouchableOpacity>
                     {/* <InputField
                        labelText="Edit about me"
                        labelTextSize={14}
                        labelColor={colors.black}
                        textColor={colors.black}
                        borderBottomColor={colors.black}
                        inputType="email"
                        value={this.state.userDetail}
                        customStyle={{ marginBottom: 30 }}
                        onChangeText={this.handleChange}
                        // showCheckmark={validNewPass}
                    /> */}
                    <Item fixedLabel style={{marginBottom:30}}>
                      <Label>Edit about me</Label>
                      <Input
                        onChangeText={this.handleChange}
                        value={this.state.userDetail}
                        style={{color:'black'}}
                      />
                    </Item>
                    <H3 style={{marginBottom:20}}>Optional Details</H3>
                    {/* <InputField
                        labelText="Location"
                        labelTextSize={12}
                        labelColor={colors.black}
                        textColor={colors.black}
                        borderBottomColor={colors.black}
                        inputType="email"
                        value={this.state.userLocation}
                        customStyle={{ marginBottom: 30 }}
                        placeholder="e.g. Paris, FR/ Brooklyn, NY/ Chicago, IL"
                        onChangeText={this.handleLocation}
                        // showCheckmark={validNewPass}
                    /> */}
                    <Item fixedLabel style={{marginBottom:30}}>
                      <Label>Language</Label>
                      <Input
                        placeholder="e.g. Paris, FR/ Brooklyn, NY/ Chicago, IL"
                        onChangeText={this.handleLanguage}
                        value={this.state.userLanguage}
                        style={{color:'black'}}
                      />
                    </Item>
                    <Item fixedLabel style={{marginBottom:30}}>
                      <Label>Location</Label>
                      <Input
                        placeholder="e.g. Paris, FR/ Brooklyn, NY/ Chicago, IL"
                        onChangeText={this.handleLocation}
                        value={this.state.userLocation}
                        style={{color:'black'}}
                      />
                    </Item>
                    {/* <InputField
                        labelText="Work"
                        labelTextSize={12}
                        labelColor={colors.black}
                        textColor={colors.black}
                        borderBottomColor={colors.black}
                        inputType="email"
                        customStyle={{ marginBottom: 30 }}
                        placeholder="e.g. FOCUSTECK/ Airbnb/ Apple"
                        onChangeText={this.handleWork}
                        value={this.state.userWork && this.state.userWork }
                        defaultValue={this.state.userWork ? this.state.userWork : null}
                        // showCheckmark={validNewPass}
                    /> */}
                    <Item fixedLabel style={{marginBottom:30}}>
                      <Label>Work</Label>
                      <Input
                        placeholder="e.g. FOCUSTECK/ Airbnb/ Apple"
                        onChangeText={this.handleWork}
                        value={this.state.userWork}
                        style={{color:'black'}}
                      />
                    </Item>
                </ScrollView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 21,
      paddingRight: 21,
    },
    title: {
      color: colors.gray04,
    },
    seeAllBtn: {
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    seeAllBtnText: {
        color: colors.gray04,
        marginRight: 5,
    },
    scrollView: {
      marginTop: 20,
      marginLeft: 15,
      marginBottom: 40,
    },
    card: {
      marginRight: 6,
      marginLeft: 6,
      width: 157,
      flexDirection: 'column',
      minHeight: 100,
    },
    image: {
        width: undefined,
        flex: 1,
        height: 100,
        borderRadius: 8,
        marginBottom: 7,
    },
    listingTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.gray04,
      marginTop: 2,
    },
    listingType: {
        fontWeight: '700',
        fontSize: 10,
    },
    addToFavoriteBtn: {
      position: 'absolute',
      right: 12,
      bottom: 7,
      zIndex: 2,
    },
    listingPrice: {
        color: colors.gray04,
        marginTop: 4,
        marginBottom: 2,
        fontSize: 12,
        fontWeight: '300',
    },
  });