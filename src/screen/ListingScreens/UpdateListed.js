import { Body, Container, Header, Left, List, Right, Text } from 'native-base'
import React from 'react'
import { AsyncStorage, ScrollView, TouchableOpacity } from 'react-native'
import InputField from '../../components/form/InputField'
import colors from '../../styles/colors'


export default class UpdateListItem extends React.Component{
    constructor(props){
      super(props)
      this.state ={
          listing:[],
          isModalVisible: false
      }
    }

    async componentDidMount(){
        const id = AsyncStorage.getItem("ID")
        console.log(id)
    }

    handleChange = (key, value) =>{

    }

    render(){
        return(
            <Container>
                <Header transparent>
                    <Left>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text>X</Text>
                        </TouchableOpacity>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <ScrollView>
                    <List style={{marginTop:30, marginLeft:20,marginRight:20}}>
                        <InputField
                            labelText="Location"
                            labelTextSize={28}
                            labelColor={colors.black}
                            textColor={colors.black}
                            borderBottomColor={colors.black}
                            inputType="email"
                            placeholder="Tokyo, Japan"
                            customStyle={{ marginBottom: 30 }}
                            onChangeText={(text) => this.handleChange('location', text)}
                            // value={this.state.location}
                            autoFocus
                        />
                    </List>
                </ScrollView>
            </Container>
        )
    }

}