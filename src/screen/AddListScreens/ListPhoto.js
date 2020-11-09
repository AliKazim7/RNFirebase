import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Text, Container, Header, Left, Body, Right, H1, List, ListItem, Button, Icon, H2, H3,Thumbnail } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp,listenOrientationChange as loc, } from 'react-native-responsive-screen'
import InputField from '../../components/form/InputField';
import HeartButton from '../../components/buttons/HeartButton';
import colors from '../styles/colors';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Loader from '../../components/Loader';

const isPortrait= () =>{
  const dim = Dimensions.get('screen')
  return dim.height > dim.width      
}

export default class ListPhoto extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    formValid: true,
    validEmail: false,
    validFirstName: false,
    imageData: "",
    userWork:'',
    Isdisabled:false,
    userLocation: '',
    userID:'',
    userDetail: '',
    avatarSource:'',
    newpassword:'',
    validPassword: false,
    loadingVisible: false,
    photourl:'',
    userPhoto:'',
    orientation: isPortrait() ? 'portrait' : 'landscape',
    photoArray:[],
    photoArray1:[],
  };
  Dimensions.addEventListener('change', () =>{
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape',
      })
    })
  }

    clickedImage = async () =>{
        this.setState({
            loadingVisible: true,
            Isdisabled:true
        })
        let photoName = Math.random()
        const file = await this.uploadImage()
        if(file && file){
            const uploadTasl = await storage().ref(`images/${photoName}`).putFile(file.uri)
            if(uploadTasl){
                const url = await storage().ref(`images/${photoName}`).getDownloadURL()
                if(url){
                    this.setState({
                      photourl: url,
                      photoArray1:[...this.state.photoArray1, url],
                      loadingVisible: false,
                      Isdisabled:false
                    })
                }
            }
        }
    }

  uploadImage = async() =>{
    const { photoArray } = this.state
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
      this.setState({
        photoArray: [...this.state.photoArray, source.uri],
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
  })}

    handleSave = async() =>{
      this.setState({
        loadingVisible: true,
        Isdisabled:true
      })
      console.log("photoArray1", this.state.photoArray1)
      this.props.navigation.navigate('AddListDetail',{photo: this.state.photoArray1})
      // if(this.state.docID && this.state.docID){
      //   firestore().collection('ItemList').doc(this.state.docID).update({
      //     photo: this.state.photoArray1,
      //   }).then(() => {
      //     this.setState({
      //       loadingVisible: false
      //     })
      //     this.props.navigation.navigate('ListItems',{docID: this.state.docID, documentAdded:true})
      //   })
      //   .catch(e =>{
      //     this.setState({
      //       loadingVisible: false
      //     })
      //     this.props.navigation.navigate('ListItems',{docID: this.state.docID, documentAdded: false})
      //   })
      // }
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
                        <TouchableOpacity 
                            onPress={this.state.photoArray1.length > 0 ? () => this.handleSave() : null}
                        >
                            <Text style={{color:colors.saagColor}} note={this.state.photoArray1.length > 0 ? false : true}>Save</Text>
                        </TouchableOpacity>
                    </Right>
                </Header>
                <TouchableOpacity 
                    onPress={() => this.clickedImage()}
                    style={{flex:1}}
                >
                    {this.state.photoArray.length > 0 ?
                        <ScrollView horizontal
                        style={{width:wp('100%')}}
                        showsHorizontalScrollIndicator={false}>
                            {
                                this.state.photoArray.length > 0
                                ?
                                this.state.photoArray.map((item,index)=>(
                                    <View style={{flexDirection:'row', flex:1}}>
                                        <Thumbnail source={item  ? {uri: item} : null} square resizeMode="cover" style={{width:wp('100%'),flex:1, height:hp('30%'), marginTop:20, marginBottom:20}} /> 
                                    </View>
                                ))
                                :
                                null
                            }
                        </ScrollView>
                    :
                        <View style={{ flex:1}}>
                            <Image style={this.state.orientation === "portrait" ? styles.defaultImage : styles.defaultImageLand} resizeMode="cover" source={require('../../img/noImage.jpeg')} />
                            <View style={styles.addToFavoriteBtn}>
                                <Icon type='FontAwesome5' name="camera-retro" />
                            </View>
                        </View>
                    }
                </TouchableOpacity>
                <View style={{marginBottom:30,justifyContent:'space-around'}}>
                    <Button disabled={this.state.Isdisabled} style={{marginTop:50,alignSelf:'center', backgroundColor:colors.saagColor}} onPress={() => this.clickedImage()}>
                        <Text>Add more Image</Text>
                    </Button>
                </View>
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
    defaultImage:{
      height:hp('20%'),
      width:wp('100%'),
      flex:1, 
    },
    defaultImageLand:{
      height:hp('25%'),
      width:wp('100%'),
      flex:1, 
    },
  });