import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ScrollView,Dimensions } from 'react-native'
import { Text, Container, Header, Left, Body, Right, H1, List, ListItem, Button, Icon, Input, CheckBox, H2, Textarea, Thumbnail, Picker } from 'native-base'
import InputField from '../../components/form/InputField';
import colors from '../../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import NextArrowButton from '../../components/buttons/NextArrowButton';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import { addOrderList, getCategories, getOrderDOC, getUSERDATA, getUSERID } from '../../services/service';
import styles from '../styles/LogIn';
const isPortrait= () =>{
    const dim = Dimensions.get('screen')
    return dim.height > dim.width      
  }
  
// import Icon from 'react-native-vector-icons/Feather';
export default class AddListDetails extends React.Component{
    constructor(props) {
    super(props);
        this.state = {
          formValid: true,
          location: '',
          title: '',
          price1:'',
          priceResT:'',
          stay:'',
          type:'',
          priceType:'',
          NotfixedPrice: false,
          disabled: true,
          loadingVisible: false,
          details:'',
          userID:'',
          userName:'',
          checked: false,
          checkedImage: false,
          locationError: '',
          titleError: '',
          price1Error:'',
          priceResTError:'',
          stayError:'',
          typeError:'',
          priceTypeError:'',
          NotfixedPriceError: false,
          disabledError: true,
          loadingVisible: false,
          detailsError:'',
          userID:'',
          userNameError:'',
          checkedError: false,
          photourl:'',
          userPhoto:'',
          orientation: isPortrait() ? 'portrait' : 'landscape',
          photoArray:[],
          photoArray1:[],
          avatarSource:'',
          CategoriesList:[]
        };
    this.changeCheck = this.changeCheck.bind(this);
    this.addCategory = this.addCategory.bind(this);
}

async componentDidMount(){
    const UID = getUSERID()
    const categoriesList = getCategories()
    categoriesList.then(response =>{
        this.setState({
        CategoriesList:response
        })
    })
    UID.then(
    resp =>{
    const getName = getUSERDATA(resp)
        getName.then(response =>{
        const firstName = response.firstName
        this.setState({
            userName: firstName,
            userID: resp
            })
        })
      }
    )
}

async componentWillReceiveProps(nextProps){
    if(nextProps.route.params.photo.length > 0){
        this.setState({
            photoArray:nextProps.route.params.photo
        })
    }
}

    dataHandle = (key, value) =>{
        this.setState({
            [key]: value
        })
        if([key] === "location"){
            this.setState({
                locationError:false
            })
        }
        if([key] === "title"){
            this.setState({
                titleError:false
            })
        }
        if([key] === "type"){
            this.setState({
                typeError:false
            })
        }
        if([key] === "price1"){
            this.setState({
                price1Error:false
            })
        }
    }

    handleChange = async() => {
        var validationArray = []
        if(this.state.location === ""){
            validationArray.push("locationError")
            this.state.locationError = true
        }
        if(this.state.title === ""){
            validationArray.push("locationError")
            this.state.titleError = true
        }
        if(this.state.price1 === ""){
            validationArray.push("locationError")
            this.state.price1Error = true
        }
        if(this.state.type === ""){
            validationArray.push("locationError")
            this.state.typeError = true
        }
        if(this.state.NotfixedPrice){
            if(this.state.priceResT === ""){
                validationArray.push("rest price error")
                this.state.NotfixedPriceError = true
            }
        }
        if(validationArray.length > 0){
            this.setState({
                locationError: this.state.locationError,
                titleError: this.state.titleError,
                price1Error:this.state.price1Error,
                typeError: this.state.typeError,
                NotfixedPriceError: this.state.NotfixedPriceError
            })
        } else {
        const addPlace = addOrderList(
        this.state.location,
        this.state.title,
        this.state.price1,
        this.state.NotfixedPrice,
        this.state.priceResT,
        this.state.userName,
        this.state.type,
        this.state.details,
        this.state.priceType,
        this.state.userID,
        this.state.photoArray
        )
        addPlace.then(response =>{
            this.props.navigation.navigate('PreviewItemDetail',{listID: response})
        })
    }
}
    changeCheck = () => { 
        this.setState({
            NotfixedPrice: !this.state.NotfixedPrice
        })
    }

    changeImage = async () => { 
        this.setState({
            checkedImage: !this.state.checkedImage,
        })
        this.props.navigation.navigate('AddListPhoto')
    }

    addCategory = value =>{
        this.setState({
            type:value
        })
    }

    render(){
        return(
            <Container style={{backgroundColor:colors.saagColor}}>
                <Header transparent>
                    <Left style={{paddingLeft:10}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{color: 'white'}} name="arrowleft" type="AntDesign" />
                        </TouchableOpacity>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <ScrollView>
                    <List style={{marginTop:10, marginLeft:20,marginRight:20}}>
                        <View style={{ marginRight:10,marginBottom:30}}>
                            <H2 style={{color:'white'}}>Add information about your gear</H2>
                        </View>
                        <InputField
                            labelText="Location"
                            labelTextSize={14}
                            labelColor={colors.white}
                            textColor={colors.white}
                            borderBottomColor={this.state.locationError ? colors.black : colors.white}
                            inputType="email"
                            placeholderTextColor='rgba(0,0,0,0.6)'
                            placeholder="San Francisco, CA"
                            customStyle={{ marginBottom: 30 }}
                            onChangeText={(text) => this.dataHandle('location', text)}
                            value={this.state.location}
                            autoFocus
                        />
                        <InputField
                            labelText="Title"
                            labelTextSize={14}
                            labelColor={colors.white}
                            textColor={colors.white}
                            borderBottomColor={this.state.titleError ? colors.black : colors.white}
                            inputType="email"
                            placeholderTextColor='rgba(0,0,0,0.6)'
                            placeholder="San Francisco Bay Area"
                            customStyle={{ marginBottom: 20 }}
                            onChangeText={(text) => this.dataHandle('title', text)}
                            value={this.state.title}
                        />
                        <Picker
                            mode="dropdown"
                            placeholderStyle={this.state.typeError ? { color: "black", textAlign:'left', justifyContent:'flex-start', paddingLeft:'-5%'} : { color: "white", textAlign:'left', justifyContent:'flex-start', paddingLeft:'-5%', paddingBottom:40}}
                            placeholder="Category"
                            textStyle={{ color: "white" }}
                            itemTextStyle={{ color: 'black' }}
                            placeholderIconColor="white"
                            style={{ width: wp('90%'), textAlign:'left', marginBottom:30,borderBottomColor:'white', borderBottomWidth:1  }}
                            selectedValue={this.state.type}
                            onValueChange={this.addCategory.bind(this)}
                        >
                        {
                        this.state.CategoriesList.map((item, index)=>(
                            <Picker.Item label={item.categoryName} value={item.categoryName} />
                        ))
                        }
                        </Picker>
                        <View style={{flexDirection:'row', marginBottom:30}} >
                            <Left style={{flex:0.5,paddingLeft:'-5%'}}>
                                <CheckBox color="white" onPress={() => this.changeImage()} checked={this.state.checkedImage} />
                            </Left>
                            <Body style={{flex:2, alignItems:'flex-start'}}>
                                <Text style={{color:'white'}}>
                                    Do you want to attach an Image?
                                </Text>
                            </Body>
                        </View>
                        <View style={{flexDirection:'row', width: wp('100%')}}>
                            <InputField
                                labelText="Price For Day One"
                                labelTextSize={14}
                                labelColor={colors.white}
                                textColor={colors.white}
                                borderBottomColor={this.state.price1Error ? colors.black : colors.white}
                                inputType="email"
                                placeholderTextColor='rgba(0,0,0,0.6)'
                                placeholder="70"
                                customStyle={{ marginBottom: 30, width:wp('40%') }}
                                onChangeText={(text) => this.dataHandle('price1', text)}
                                value={this.state.price1}
                            />
                        </View>
                        {
                            this.state.type !== ''
                            ?
                            <View style={{flexDirection:'row', width: wp('100%')}}>
                                <Textarea placeholder="Add new details" value={this.state.details} bordered onChangeText={(text) => this.dataHandle('details', text)}
                                    placeholderTextColor="rgba(0,0,0,0.6)" rowSpan={8} style={{color:'white', fontSize:14,marginBottom: 30, width:wp('90%')}} />
                            </View>
                            :
                            null
                        }
                        {
                            this.state.type !== ''
                            ?
                        <View style={this.state.NotfixedPrice ? {flexDirection:'row'} : {flexDirection:'row', marginBottom:hp("5%")}} >
                            <Left style={{flex:0.5}}>
                                <CheckBox color="white" onPress={() => this.changeCheck()} checked={this.state.NotfixedPrice} />
                            </Left>
                            <Body style={{flex:2, alignItems:'flex-start'}}>
                                <Text style={{color:'white'}}>
                                    Use different price
                                </Text>
                                <Text style={{color:'white'}}>
                                    for other days
                                </Text>
                            </Body>
                        </View>
                        :
                        null
                    }
                    {
                        this.state.NotfixedPrice
                        ?
                        <View style={{flexDirection:'row', width: wp('100%'), marginTop:hp('3%'), marginBottom:hp("3%")}}>
                        <InputField
                            labelText="Price For Other days"
                            labelTextSize={14}
                            labelColor={colors.white}
                            textColor={colors.white}
                            borderBottomColor={this.state.NotfixedPriceError ? colors.black : colors.white}
                            // borderBottomColor={colors.white}
                            inputType="email"
                            placeholderTextColor="rgba(0,0,0,0.6)"
                            placeholder="70"
                            customStyle={{ marginBottom: 30, width:wp('40%') }}
                            onChangeText={(text) => this.dataHandle('priceResT', text)}
                            value={this.state.priceResT}
                        />
                        </View>
                        :
                        null
                    }
                    </List>
                </ScrollView>
                <View style={{bottom:0, right:20, position:'absolute'}}>
                    <NextArrowButton 
                        handleNextButton={() => this.handleChange()}
                    />
                </View>
            </Container>
        )
    }
}

const ImageStyle = StyleSheet.create({
    
    defaultImage:{
      height:hp('20%'),
      width:wp('100%'),
      flex:1, 
      backgroundColor:'red'
    },
    defaultImageLand:{
      height:hp('50%'),
      width:wp('100%'),
      flex:1, 
      backgroundColor:'yellow'
    },
  });