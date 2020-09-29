import { Body, Container, Header, Icon, Right, Left } from 'native-base'
import React from 'react'
import {StyleSheet, FlatList,View } from 'react-native';
import FastImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Gallery from 'react-native-image-gallery'
import colors from '../styles/colors';
export default class ImageList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            photo:[]
        }
    }

    async componentDidMount(){
        this.setState({
            photo: this.props.route.params.photo
        })
    }

    render(){
        return(
            <Container style={styles.MainContainer}>
                <Header transparent>
                    <Left>
                        <Icon style={{color:'white'}} type="AntDesign" name="arrowleft" onPress={() => this.props.navigation.goBack()} />
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <FlatList 
                    data={this.state.photo}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                            <FastImage style={styles.imageThumbnail} source={ item && { uri: item }} />
                        </View>
                    )}
                    //Setting the number of column
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
      justifyContent: 'center',
      flex: 1,
      paddingTop: 30,
    },
    imageThumbnail: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
    },
  });