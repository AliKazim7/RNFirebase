import React from 'react'
import { StyleSheet } from 'react-native'
import { Container, Content, H1, Card, CardItem, List, Left, Right, Text, Icon, ListItem, Header, Button, Body } from 'native-base'

export default class PaymentScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

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
                <Content>
                    <List>  
                        <ListItem noBorder>
                            <Left>
                                <H1 style={style.headerText}>
                                    Payments and payouts
                                </H1>    
                            </Left>    
                        </ListItem>            
                        <ListItem onPress={() => this.props.navigation.navigate('EditPayment')} style={style.listStyle}>
                            <Left>
                                <Text style={{color:'black'}}>Payment Methods</Text>
                            </Left>
                            <Right>
                                <Icon type="FontAwesome" name="credit-card-alt" />
                            </Right>
                        </ListItem>
                        <ListItem style={style.listStyle}>
                            <Left>
                                <Text style={{color:'black'}}>Payout preferences</Text>
                            </Left>
                            <Right>
                                <Icon type="FontAwesome" name="credit-card-alt" />
                            </Right>
                        </ListItem>
                        <ListItem style={style.listStyle}>
                            <Left>
                                <Text style={{color:'black'}}>Credits & Coupons</Text>
                            </Left>
                            <Right>
                                <Icon type="FontAwesome" name="credit-card-alt" />
                            </Right>
                        </ListItem>
                        <ListItem style={style.listStyle}>
                            <Left>
                                <Text style={{color:'black'}}>Currency</Text>
                            </Left>
                            <Right>
                                <Icon type="FontAwesome" name="credit-card-alt" />
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
        marginTop: '5%',
        marginBottom: '1%'
    },
    listStyle:{
        marginTop: '2.5%',   
    }
})