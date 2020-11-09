import React from 'react'
import { View } from 'react-native'
import { Text, Content, Container, List, ListItem, Icon, H1, H3, Button, Header, Left, Body, Right, DatePicker } from 'native-base'
import headStyle from '../styles/HeaderSetting'
import { CalendarList } from 'react-native-calendars'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import colors from '../styles/colors'
import moment from 'moment'

export default class Availability extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currenDate: '',
            openStartCalender:false,
            openEndCalender: false,
            SD:'',
            ED:'',
            selectedDate:[{}]
        }
    }

    goBack = () =>{
        this.props.navigation.goBack()
    }

    clearData = () =>{
        this.setState({
            selectedDate:[],
            SD: '',
            ED:''
        })
    }

    startCalender = () =>{
        this.setState({
            SD: ''
        })
    }

    endCalender = () =>{
        this.setState({
            ED: ''
        })
    }

    setDate = (newDate) => {
        this.setState({ SD: moment(newDate).format('L') });
    }
    
    setDate1 = (newDate) => {
        this.setState({ ED: moment(newDate).format('L') });
    }

    checkAvail = () =>{
        var a = moment(this.state.SD);
        var b = moment(this.state.ED);
        const days = b.diff(a, 'days')
        this.props.navigation.navigate('SelectedItem',{
            Date: days,
            startDate: this.state.SD,
            endDate: this.state.ED
        })
    }

    render(){
        return(
            <Container>
                <View style={{marginTop:25}}>
                    <Header transparent >
                        <Left>
                            <Icon type="AntDesign" onPress={() => this.goBack()} style={{color:'black'}} name="arrowleft" />
                        </Left>
                        <Body />
                        <Right>
                            <Text onPress={this.clearData}>Clear</Text>
                        </Right>
                    </Header>
                    <View style={{marginTop:'5%', marginLeft:12.5}}>
                        <H1>Select dates</H1>
                        <Text note style={{marginTop:10}}>Add your travel dates for exact pricing.</Text>
                    </View>
                    <View style={{width:wp('100%')}}>
                        <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:hp('10%')}}>
                            {
                                !this.state.SD
                            ?
                                <DatePicker
                                    locale={"en"}
                                    minimumDate={new Date()}
                                    maximumDate={this.state.ED !== "" ? new Date(this.state.ED) : new Date(2208, 12, 31)}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select start date"
                                    textStyle={{ color: colors.saagColor }}
                                    placeHolderTextStyle={{ color: colors.saagColor }}
                                    onDateChange={this.setDate}
                                    disabled={false}
                                />
                            :
                                    <Text onPress={() => this.startCalender()} style={{color:colors.saagColor, paddingTop:'3%'}}> {this.state.SD} </Text>
                            }
                            {
                                !this.state.ED
                            ?
                                <DatePicker
                                    locale={"en"}
                                    minimumDate={this.state.SD !== '' ? new Date(this.state.SD) : new Date()}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select end date"
                                    textStyle={{ color: colors.saagColor }}
                                    placeHolderTextStyle={{ color: colors.saagColor }}
                                    onDateChange={this.setDate1}
                                    disabled={false}
                                />
                            :
                                <Text onPress={() => this.endCalender()} style={{color:colors.saagColor, paddingTop:'3%'}}>{this.state.ED}</Text>
                            }
                        </View>
                    </View>
                </View>
                    {
                        this.state.ED && this.state.SD
                        ?
                        <View style={{position:'absolute', bottom:0, right:10}} >
                            <Button onPress={() => this.checkAvail()} style={{backgroundColor:colors.saagColor}}>
                                <Text>Done</Text>
                            </Button>
                        </View>
                        :
                        null
                    }
            </Container>
        )       
    }
}