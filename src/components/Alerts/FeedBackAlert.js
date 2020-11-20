/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  Text,
  Modal,
  StyleSheet, ActivityIndicator
} from 'react-native';
import colors from '../../styles/colors';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Button } from 'native-base';

export default class FeedBackAlert extends Component {
  render() {
    const { animationType, modalVisible } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent
        visible={modalVisible}
      >
        <View style={styles.wrapper}>
          <View style={styles.loaderContainer}>
              <Text style={{fontSize:18,marginTop:20,marginBottom:20, color:'white', textAlign:'center'}}>
                  Thank you for your feedback.
              </Text>
              <Button style={{backgroundColor:colors.saagColor, marginTop:20}} onPress={() => this.props.onClose()}>
                  <Text style={{color:'white', fontSize:14}}>
                      Close
                  </Text>
              </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  loaderContainer: {
    width: 280,
    height: 160,
    // backgroundColor: colors.black,
    borderWidth:1,
    borderColor:'white',
    borderRadius: 15,
    position: 'absolute',
    left: '20%',
    top: '45%',
    marginLeft: -25,
    marginTop: -45,
  },
  loaderImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    position: 'relative',
    left: '50%',
    marginLeft: -35,
    top: '50%',
    marginTop: -35,
  },
});
