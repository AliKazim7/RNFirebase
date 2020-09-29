import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text, Container, Header, Left, Body, Right, H1, List, ListItem, Button } from 'native-base'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Loader from '../../components/Loader'
import colors from '../../styles/colors'
export default class Listitems extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          formValid: true,
          validEmail: false,
          validFirstName: false,
          validLastName: false,
          validNewPass:false,
          emailAddress: '',
          password: '',
          result:[],
          newpassword:'',
          validPassword: false,
          loadingVisible: false,
        };
      }

      async componentDidMount(){
        // this.setState({
        //     loadingVisible: true
        // })
        //   if(this.props.route.params.documentAdded === true){
        //     const documentValue = await this.getApi(this.props.route.params.docID)
        //     if(documentValue){
        //         this.setState({
        //             loadingVisible: false,
        //             result:documentValue
        //         })
        //     }
        // } else {
        //     this.setState({
        //         loadingVisible: false
        //     })
        // }
      }

      async componentWillReceiveProps(nextProps){
        // this.setState({
        //     loadingVisible: true
        // })
        if(nextProps.route.params.documentAdded === true){
            const documentValue = await this.getApi(nextProps.route.params.docID)
            if(documentValue){
                this.setState({
                    loadingVisible: false,
                    result:documentValue
                })
            }
        } else {
            this.setState({
                loadingVisible: false
            })
        }
      }

      getApi = async(ID) =>{
        return new Promise((resolve, reject)=>{
            firestore()
            .collection('ItemList')
            .doc(ID)
            .get()
            .then(doc => {
                if (doc.exists) {
                    resolve(doc.data())
                }
            });
          })
      }

      handleNavigation = () =>{
        this.props.navigation.navigate('AddListDetail')
      }

      handlePress  = () =>{
        this.props.navigation.navigate('PreviewItemDetail', {
            result:this.state.result
        })
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
                            <Text style={{marginLeft:10}}>X</Text>
                        </TouchableOpacity>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <ScrollView>
                <List>
                    <ListItem noBorder>
                        <H1>Lets's set up your listing</H1>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Property and guests</Text>
                        </Left>
                        <Right style={{flex:1}} >
                            <Button style={{backgroundColor:colors.saagColor}}  onPress={() => this.handleNavigation()}>
                                <Text>
                                    CONTINUE
                                </Text>
                            </Button>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Location</Text>
                        </Left>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Title</Text>
                        </Left>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Photos</Text>
                        </Left>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Pricing</Text>
                        </Left>
                    </ListItem>
                    {/* <ListItem>
                        <Left>
                            <Text>Availability</Text>
                        </Left>
                    </ListItem> */}
                    <ListItem>
                        <Left>
                            <Text>Review</Text>
                        </Left>
                    </ListItem>
                </List>
                </ScrollView>
                {
                    this.state.result.id !== undefined
                    ?
                    <View style={{position:'absolute', bottom:10}}>
                        <Left style={{marginLeft:30}}>
                            <TouchableOpacity onPress={() => this.handlePress()}>
                                <Text>Preview</Text>
                            </TouchableOpacity>
                        </Left>
                    </View>
                    :
                    null
                }
            </Container>
        )
    }
}