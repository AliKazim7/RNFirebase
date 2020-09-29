/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  Text,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import colors from '../../styles/colors';
import iPhoneSize from '../../helpers/utils';

const size = iPhoneSize();
let cardSize = 100;
let cardMargin = 8;

if (size === 'small') {
  cardSize = 90;
  cardMargin = 4;
} else if (size === 'large') {
  cardSize = 115;
}

export default class Categories extends Component {
  get Categories() {
    const { categories,pressCom } = this.props;
    return categories.map((category, index) => (
      <TouchableHighlight
        style={styles.card}
        key={`category-item-${index}`}
        onPress={ () => pressCom(category.name)}
      >
        {category.icon}
        <Text textBreakStrategy="highQuality" adjustsFontSizeToFit={true} style={styles.image}>
          {category.name}
        </Text>
      </TouchableHighlight>
    ));
  }

  render() {
    const { categories } = this.props
  	return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      horizontal
      showHorizontalScrollIndicator={false}
    >
      <TouchableHighlight style={styles.card}>
        <Text textBreakStrategy="highQuality" adjustsFontSizeToFit={true}>Categories</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.card}>
        <Text textBreakStrategy="highQuality" adjustsFontSizeToFit={true}>Trending</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.card}>
        <Text textBreakStrategy="highQuality" adjustsFontSizeToFit={true}>Featured</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.card}>
        <Text textBreakStrategy="highQuality" adjustsFontSizeToFit={true}>Wanted</Text>
      </TouchableHighlight>
    </ScrollView>
  	);
  }
}

const styles = StyleSheet.create({
  wrapper: {
  	flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop:50,
    // marginLeft:15,
    width: wp('22%'),
    // backgroundColor:'red',
    // height: cardSize,
    marginRight: cardMargin,
    // marginLeft: cardMargin,
  },
  image: {
    flex: 1,
    fontSize:15,
    width: undefined,
    height: undefined,
    borderBottomWidth:2,
    borderBottomColor:colors.darkOrange
  },
});
