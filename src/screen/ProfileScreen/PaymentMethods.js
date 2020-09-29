import React from 'react'
import { StyleSheet } from 'react-native'
import { Container, Content, H1, Card, CardItem, List, Left, Right, Text, Icon, ListItem, Body, Button, Header } from 'native-base'

export default class EditPaymentMethod extends React.Component{
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
                        <Button onPress={() => this.props.navigation.goBack()} transparent>
                            <Text>Back</Text>
                        </Button>
                    </Left>
                </Header>
                <Content padder>
                    <H1 style={style.headerText}>
                        Edit your payment methods
                    </H1>
                    <List>              
                        <ListItem style={style.listStyle}>
                            {/* <Left> */}
                                <Icon type="FontAwesome" name="credit-card-alt" />
                            {/* </Left> */}
                            <Body>
                                <Text style={{color:'black'}}>Google Pay</Text>
                            </Body>
                            <Right />
                        </ListItem>
                        <Button onPress={() => this.props.navigation.navigate('AddPayment')} transparent>
                            <Text style={{fontSize:15}}>
                                Add payment method
                            </Text>
                        </Button>
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