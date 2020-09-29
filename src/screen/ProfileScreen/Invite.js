  
import React from 'react'
import { Container, H1, Text, Left, Body, Right, Content, List, Button, ListItem, Icon, Header } from 'native-base'
import { View, StyleSheet } from 'react-native'
import headStyle from '../styles/HeaderSetting';
import colors from '../../styles/colors';
// import Share from 'react-native-share'
export default class InviteFriends extends React.Component{
    static navigationOptions = () => ({
        // title: 'Contact Us',
        // headerTintColor: Colors.Green,
        headerStyle: {
          backgroundColor: 'transparent'
        }
      });
    openShare = async() =>{
        // const options = Platform.select({
        //     ios: {
        //       activityItemSources: [
        //         { // For sharing url with custom title.
        //           placeholderItem: { type: 'url', content: url },
        //           item: {
        //             default: { type: 'url', content: url },
        //           },
        //           subject: {
        //             default: title,
        //           },
        //           linkMetadata: { originalUrl: url, url, title },
        //         },
        //         { // For sharing text.
        //           placeholderItem: { type: 'text', content: message },
        //           item: {
        //             default: { type: 'text', content: message },
        //             message: null, // Specify no text to share via Messages app.
        //           },
        //           linkMetadata: { // For showing app icon on share preview.
        //              title: message
        //           },
        //         },
        //         { // For using custom icon instead of default text icon at share preview when sharing with message.
        //           placeholderItem: {
        //             type: 'url',
        //             content: icon
        //           },
        //           item: {
        //             default: {
        //               type: 'text',
        //               content: `${message} ${url}`
        //             },
        //           },
        //           linkMetadata: {
        //              title: message,
        //              icon: icon
        //           }
        //         },
        //       ],
        //     },
        //     default: {
        //       title,
        //       subject: title,
        //       message: `${message} ${url}`,
        //     },
        //   });
        // try {
        //         const result = await Share.open(option)
        //     if (result.action === Share.sharedAction) {
        //       if (result.activityType) {
        //         // shared with activity type of result.activityType
        //       } else {
        //         // shared
        //       }
        //     } else if (result.action === Share.dismissedAction) {
        //       // dismissed
        //     }
        //   } catch (error) {
        //     alert(error.message);
        //   }
    }

    goBack = () =>{
        this.props.navigation.goBack()
    }

    render(){
        return(
            <Container style={{backgroundColor:colors.white}}>
                 <Header transparent>
                    <Left>
                        <Icon style={{color:'black'}} type="AntDesign" name="arrowleft" onPress={() => this.props.navigation.goBack()} />
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content padder>
                    <List>
                        <ListItem noBorder>
                            <Left>
                                <Text style={{fontSize:40, marginTop:10}}>
                                    Earn $15 credit for future trips
                                </Text >
                            </Left>
                        </ListItem>
                        <ListItem noBorder>
                            <Left>
                                <Text style={{}} note>
                                    Share your link with people new to SAAG. We'll give them upto $30 off their first booking (and you'll get upto $15 in credit, too ).
                                </Text>
                            </Left>
                        </ListItem>
                            <View style={styles.ViewText}>
                                <Button style={{backgroundColor:colors.saagColor}} 
                                    // onPress={this.openShare}
                                >
                                    <Text style={{fontSize:15, color:'white'}}>Share your link</Text>
                                </Button>
                            </View>
                            <ListItem>
                                <Text style={{fontSize:20}}> Your travel credit </Text>
                            </ListItem>
                            <ListItem noBorder>
                                <Text style={{fontSize:20}}> Read terms and conditions </Text>
                            </ListItem>
                    </List>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    ViewText:{
        marginTop:'5%',
        marginLeft:15,
        marginBottom:'5%'
    }
})