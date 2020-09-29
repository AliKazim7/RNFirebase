import React from 'react'
import { View,TouchableOpacity } from 'react-native'
import { Container, Header, Left, Icon, H1, Text, List, ListItem, Right,Button } from 'native-base'
import Loader from '../../components/Loader'
import colors from '../../styles/colors'

export default class GuestList extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            loadingVisible: false,
            guestNumber:4,
            bedForGuest:1, 
            bedGuest:0
        }
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
                    <Right>
                        <Text style={{color:colors.saagColor}}>Save and exit</Text>
                    </Right>
                </Header>
                <View style={{marginLeft:10, marginRight:10}}>
                    <H1>
                        How many guests can stay?
                    </H1>
                    <Text note style={{marginTop:10}}>
                        Check that you have enough beds to
                        accommodate all your guests comfortably.
                    </Text>
                    <List>
                        <ListItem style={{marginTop:20}}>
                            <Left>
                                <Text>
                                    Number of guests 
                                </Text>
                            </Left>
                            <Right style={{flex:1, flexDirection:'row-reverse'}}>
                                <Icon style={{fontSize:25, color:'blue'}} type="AntDesign" name="pluscircleo" />
                                   <Text style={{marginLeft:30, marginRight:30, fontSize:20}}>{this.state.guestNumber}</Text>
                                <Icon style={{fontSize:25, color:'blue'}} type="AntDesign" name="minuscircleo" />
                            </Right>
                        </ListItem>
                        <ListItem style={{marginTop:20}}>
                            <Left>
                                <Text>
                                    Bedrooms for guests
                                </Text>
                            </Left>
                            <Right style={{flex:1, flexDirection:'row-reverse'}}>
                                <Icon style={{fontSize:25, color:'blue'}} type="AntDesign" name="pluscircleo" />
                                   <Text style={{marginLeft:30, marginRight:30, fontSize:20}}>{this.state.bedGuest}</Text>
                                <Icon style={this.state.bedGuest > 0 ? {fontSize:25, color:'blue'} : {fontSize:25}} type="AntDesign" name="minuscircleo" />
                            </Right>
                        </ListItem>
                        <ListItem style={{marginTop:20}}>
                            <Left>
                                <Text>
                                    Beds for guests
                                </Text>
                            </Left>
                            <Right style={{flex:1, flexDirection:'row-reverse'}}>
                                <Icon style={{fontSize:25, color:'blue'}} type="AntDesign" name="pluscircleo" />
                                   <Text style={{marginLeft:30, marginRight:30, fontSize:20}}>{this.state.bedForGuest}</Text>
                                <Icon style={this.state.bedForGuest > 1 ? {fontSize:25, color:'blue'} : {fontSize:25}} type="AntDesign" name="minuscircleo" />
                            </Right>
                        </ListItem>
                    </List>
                </View>
                <View style={{bottom:10, right:20, position:'absolute'}}>
                    <Button onPress={() => this.navigationCheck()} >
                        <Text>Next</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}