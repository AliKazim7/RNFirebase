import React from 'react'
import { View,TouchableOpacity } from 'react-native'
import { Container, Header, Left, Icon, H1, Text, List, ListItem, Right,Button } from 'native-base'
import Loader from '../../components/Loader'

export default class ListCompany extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            checkedHosp: false,
            loadingVisible: false,
            checkedNotHosp: false
        }
    }

    handlePress = () => {
        this.setState({
            checkedHosp: !this.state.checkedHosp,
            checkedNotHosp: false
        })
    }
    
    handledNothosp = () => {
        this.setState({
            checkedNotHosp: !this.state.checkedNotHosp,
            checkedHosp: false
        })
    }
    
    navigationCheck = () => {
        this.setState({
            loadingVisible: true
        })
        setTimeout(() =>{
            this.setState({
                loadingVisible: false
            })
            this.props.navigation.navigate('GuestList')
        }, 1000)
    }

    render(){
        return(
            <Container>
                <Loader
                    modalVisible={this.state.loadingVisible}
                    animationType="fade"
                />
                <Header transparent>
                    <Left>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" />
                        </TouchableOpacity>
                    </Left>
                </Header>
                <View style={{marginLeft:10, marginRight:10}}>
                    <H1>
                        Are you listing on Airbnb as part of a company?
                    </H1>
                    <Text note style={{marginTop:10}}>
                        This info helps you get the right hosting features.
                        It won't be seen by guests and doesn't affect how a listing appears.
                    </Text>
                    <List>
                        <ListItem>
                            <Left>
                                <Text>
                                    Yes, I work for or run a hospitality business
                                </Text>
                            </Left>
                            <Right>
                                <TouchableOpacity
                                    style={
                                        this.state.checkedHosp
                                        ?
                                        {
                                            borderWidth:1,
                                            borderColor:'rgba(0,0,0,0.2)',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width:30,
                                            height:30,
                                            backgroundColor:'blue',
                                            borderRadius:50,
                                        }
                                        :
                                        {
                                            borderWidth:1,
                                            borderColor:'rgba(0,0,0,0.2)',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width:30,
                                            height:30,
                                            backgroundColor:'#fff',
                                            borderRadius:50,
                                        }
                                    }
                                        onPress={() => this.handlePress()}
                                    >
                                    {/* <Icon name="circle" type="Entypo"  size={30} color="#01a699" /> */}
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <Text>
                                    No, that doesn't sound like me
                                </Text>
                            </Left>
                            <Right>
                                <TouchableOpacity
                                    style={
                                            this.state.checkedNotHosp
                                            ?
                                            {
                                                borderWidth:1,
                                                borderColor:'rgba(0,0,0,0.2)',
                                                alignItems:'center',
                                                justifyContent:'center',
                                                width:30,
                                                height:30,
                                                backgroundColor:'blue',
                                                borderRadius:50,
                                            }
                                            :
                                            {
                                                borderWidth:1,
                                                borderColor:'rgba(0,0,0,0.2)',
                                                alignItems:'center',
                                                justifyContent:'center',
                                                width:30,
                                                height:30,
                                                backgroundColor:'#fff',
                                                borderRadius:50,
                                            }
                                        }
                                        onPress={() => this.handledNothosp()}
                                    >
                                    {/* <Icon name="circle" type="Entypo"  size={30} color="#01a699" /> */}
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                    </List>
                </View>
                {
                    this.state.checkedHosp === true || this.state.checkedNotHosp === true ? 
                    <View style={{bottom:10, right:20, position:'absolute'}}>
                        <Button onPress={() => this.navigationCheck()} >
                            <Text>Next</Text>
                        </Button>
                    </View>
                    : null
                }
            </Container>
        )
    }
}