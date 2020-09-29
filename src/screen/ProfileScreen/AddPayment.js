import React from 'react'
import {Text, StyleSheet, Linking} from 'react-native'
import { Container, Content, H1, List, ListItem, Icon, Body, Right, Header, Left, Button } from 'native-base'

export default class AddPayment extends React.Component{

    render(){
        return(
            <Container>
                <Header transparent>
                    <Left>
                        <Icon type="AntDesign" name="arrowleft" onPress={() => this.props.navigation.goBack()} />
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content padder>
                    <H1 style={style.headerText}>
                        Pay with
                    </H1>
                    <Text style={{fontWeight:'normal', color:'rgba(0,0,0,0.6)'}}>Payment currency: <Text style={{color:'green'}}> GBP</Text> </Text>
                    <List>
                        <ListItem style={style.listStyle}>
                            <Icon type="FontAwesome" name="credit-card-alt" />
                            <Body style={{marginLeft:'5%'}}>
                                <Text>Credit or debit card</Text>
                            </Body>
                            <Right>
                                <Icon type="MaterialIcons" name="keyboard-arrow-right" />
                            </Right>
                        </ListItem>
                        <ListItem style={style.listStyle} onPress={() => Linking.openURL("https://www.paypal.com/")}>
                            <Icon type="FontAwesome" name="credit-card-alt" />
                            <Body style={{marginLeft:'5%'}}>
                                <Text>PayPal</Text>
                            </Body>
                            <Right>
                                <Icon type="MaterialIcons" name="keyboard-arrow-right" />
                            </Right>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        )
    }
}

const style = StyleSheet.create({
    headerText:{
        marginTop:'5%',
        marginBottom:'5%'
    },
    listStyle:{
        marginTop: '2.5%',   
    }
})