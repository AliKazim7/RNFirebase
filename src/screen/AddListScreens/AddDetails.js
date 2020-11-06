import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text, Container, Header, Left, Body, Right, H1, List, ListItem, Button, Icon, Input, CheckBox, H2, Textarea } from 'native-base'
import InputField from '../../components/form/InputField';
import colors from '../../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import NextArrowButton from '../../components/buttons/NextArrowButton';
import { addOrderList, getOrderDOC, getUSERDATA, getUSERID } from '../../services/service';
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
          checked: false
        };
        this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
      }

    async componentDidMount(){
        const UID = getUSERID()
        UID.then(
            resp =>{
                const getName = getUSERDATA(resp)
                getName.then(response =>{
                    const firstName = response[0].firstName
                    this.setState({
                        userName: firstName,
                        userID: resp
                    })
                })
            }
        )
    }
    dataHandle = (key, value) =>{
        this.setState({
            [key]: value
        })
    }

    handleChange = async() => {
        // this.props.navigation.navigate('AddListPhoto')
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
            this.state.userID
        )
        addPlace.then(response =>{
            console.log(response)
            this.props.navigation.navigate('AddListPhoto',{listID: response})
        })
    }
    changeCheck = () => { 
        this.setState({
            NotfixedPrice: !this.state.NotfixedPrice
        })
     }

     toggleNextButtonState() {
        const { title, type, location, price1, NotfixedPrice, priceResT } = this.state;
        if ( title && type && location && price1) {
            if ( NotfixedPrice === false || priceResT !== ''  ) {
                return false;
            }
        }
        return true;
      }

    render(){
        return(
            <Container style={{backgroundColor:colors.saagColor}}>
                <Header transparent>
                    <Left>
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
                        borderBottomColor={colors.white}
                        inputType="email"
                        placeholderTextColor={colors.white}
                        placeholder="New York, America"
                        customStyle={{ marginBottom: 30 }}
                        onChangeText={(text) => this.dataHandle('location', text)}
                        value={this.state.location}
                        autoFocus
                    />
                    {
                        this.state.location !== ''
                        ?
                            <InputField
                                labelText="Title"
                                labelTextSize={14}
                                labelColor={colors.white}
                                textColor={colors.white}
                                borderBottomColor={colors.white}
                                inputType="email"
                                placeholderTextColor={colors.white}
                                placeholder="Trump Tower"
                                customStyle={{ marginBottom: 30 }}
                                onChangeText={(text) => this.dataHandle('title', text)}
                                value={this.state.title}
                            />
                        :
                        null
                    }
                    {
                        this.state.title !== ''
                        ?
                            <InputField
                                labelText="Type"
                                labelTextSize={14}
                                labelColor={colors.white}
                                textColor={colors.white}
                                borderBottomColor={colors.white}
                                inputType="email"
                                placeholderTextColor={colors.white}
                                placeholder="Biking"
                                customStyle={{ marginBottom: 30 }}
                                onChangeText={(text) => this.dataHandle('type', text)}
                                value={this.state.type}
                            />
                        :
                        null
                    }
                    {
                        this.state.type !== ''
                        ?
                        <View style={{flexDirection:'row', width: wp('100%')}}>
                            <InputField
                                labelText="Price For Day One"
                                labelTextSize={14}
                                labelColor={colors.white}
                                textColor={colors.white}
                                borderBottomColor={colors.white}
                                inputType="email"
                                placeholderTextColor={colors.white}
                                placeholder="70"
                                customStyle={{ marginBottom: 30, width:wp('40%') }}
                                onChangeText={(text) => this.dataHandle('price1', text)}
                                value={this.state.price1}
                            />
                        </View>
                        :
                        null
                    }
                    {
                        this.state.type !== ''
                        ?
                        <View style={{flexDirection:'row', width: wp('100%')}}>
                            {/* <InputField
                                labelText="Price For Day One"
                                labelTextSize={14}
                                labelColor={colors.white}
                                textColor={colors.white}
                                borderBottomColor={colors.white}
                                inputType="email"
                                placeholderTextColor={colors.white}
                                placeholder="70"
                                customStyle={{ marginBottom: 30, width:wp('40%') }}
                                onChangeText={(text) => this.dataHandle('price1', text)}
                                value={this.state.price1}
                            /> */}
                            <Textarea placeholder="Add new details" value={this.state.details} bordered onChangeText={(text) => this.dataHandle('details', text)}
                                placeholderTextColor={colors.saagColor} rowSpan={8} style={{color:'white', fontSize:14,marginBottom: 30, width:wp('90%')}} />
                        </View>
                        :
                        null
                    }
                    {
                        this.state.type !== ''
                        ?
                    <View style={{flexDirection:'row'}} >
                        <Left style={{flex:0.5}}>
                            <CheckBox color="white" onPress={() => this.changeCheck()} checked={this.state.NotfixedPrice} />
                        </Left>
                        <Body style={{flex:2, alignItems:'flex-start'}}>
                            <Text style={{color:'white'}}>
                                Use different price for other days
                            </Text>
                        </Body>
                    </View>
                    :
                    null
                }

                    {
                        this.state.NotfixedPrice
                        ?
                        <View style={{flexDirection:'row', width: wp('100%'), marginTop:hp('3%')}}>
                            <InputField
                                labelText="Price For Other days"
                                labelTextSize={14}
                                labelColor={colors.white}
                                textColor={colors.white}
                                borderBottomColor={colors.white}
                                inputType="email"
                                placeholderTextColor={colors.white}
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
                        disabled={this.toggleNextButtonState()}
                    />
                    {/* <Button 
                        disabled={this.state.disabled} 
                        style={{backgroundColor:colors.saagColor}}
                        onPress={() => this.handleChange()} >
                        <Text>Next</Text>
                    </Button> */}
                </View>
            </Container>
        )
    }
}

{/* <Container>
                <Header transparent>
                    <Left>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrowleft" type="AntDesign" />
                        </TouchableOpacity>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <View>
                    <H1>Tell us about your place</H1>
                </View>
                <List>
                    <ListItem>
                        <Body>
                            <Text>First, let's narrow things down</Text>
                            <DropDownPicker
                                items={[
                                    {label: 'Apartment', value: 'uk'},
                                    {label: 'House', value: 'house'},
                                    {label: 'Secondary unit', value: 'SU'},
                                    {label: 'Unique space', value: 'US'},
                                    {label: 'Bed and breakfast', value: 'b&b'},
                                    {label: 'Boutique hotel', value: 'boutique'},
                                ]}
                                defaultValue={this.state.country}
                                containerStyle={{height: 40, borderWidth:0, borderColor:'transparent', marginTop:20}}
                                style={{backgroundColor: '#fafafa', borderWidth:0, borderColor:'transparent'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa', borderWidth:0, borderColor:'transparent'}}
                                onChangeItem={item => this.setState({
                                    country: item.value
                                })}
                            />
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text>Now choose a property type</Text>
                            <DropDownPicker
                                items={[
                                    {label: 'Guest House', value: 'uk'},
                                    {label: 'Guest suite', value: 'house'},
                                    {label: 'Farm stay', value: 'SU'},
                                ]}
                                defaultValue={this.state.country}
                                containerStyle={{height: 40, borderWidth:0, borderColor:'transparent', marginTop:20}}
                                style={{backgroundColor: '#fafafa', borderWidth:0, borderColor:'transparent'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa', borderWidth:0, borderColor:'transparent'}}
                                onChangeItem={item => this.setState({
                                    country: item.value
                                })}
                                placeholder="Select One"
                            />
                        </Body>
                    </ListItem>
                </List>
                <View style={{bottom:10, right:20, position:'absolute'}}>
                    <Button onPress={() => this.props.navigation.navigate('ListCompany')} >
                        <Text>Next</Text>
                    </Button>
                </View>
            </Container> */}