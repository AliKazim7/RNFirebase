import React from 'react'
import { Text, View, Container, Content, Header, Item, Label, Input, Left, Body, Title, Right, Form, Button } from 'native-base'
import auth from '@react-native-firebase/auth'

export default class RegisterForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password:''
        }
    }

    handleChange = (key, text) =>{
        this.setState({
            [key] : text
        })
    }

    updateProfile = () => {
        auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() =>{
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              }
          
              if (error.code === 'auth/invalid-email') {
              }
          
              console.error(error);
        })
    }

    render(){
        return(
            <View>
                <Form >
                    <Item floatingLabel>
                        <Label>Email Address</Label>
                        <Input value={this.state.email} onChangeText={(text) => this.handleChange("email", text)} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input value={this.state.password} onChangeText={(text) => this.handleChange('password', text)} />
                    </Item>
                    <Button onPress={this.updateProfile}>
                        <Text style={{color:'white'}}>Update</Text>
                    </Button>
                </Form>
            </View>
        )
    }
}