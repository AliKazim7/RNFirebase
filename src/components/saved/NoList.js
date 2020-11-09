import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import colors from '../../styles/colors';

export default class NoLists extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      listing:[]
    }
  }
  render() {
  	return (
    <View>
      <ScrollView refreshControl={
        <RefreshControl onRefresh={this.props.onRefresh} refreshing={this.props.loading}/>
      } style={styles.scrollView}>
        <Text style={styles.heading}>
Lists
        </Text>
        <Text style={styles.description}>
No item listed.
        </Text>
        <Text style={styles.description}>
You can list item from the Profile tab.
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableHighlight onPress={this.props.goBack} style={styles.findHomesButton}>
          <Text style={styles.findHomesButtonText}>
List Items
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  	);
  }
}

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  heading: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 40,
    color: colors.gray04,
    marginTop: 70,
    paddingLeft: 20,
    paddingRight: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray04,
    paddingLeft: 20,
    paddingRight: 20,
  },
  footer: {
  	position: 'absolute',
  	width: '100%',
  	height: 80,
  	bottom: 0,
  	borderTopWidth: 1,
  	borderTopColor: colors.gray05,
  	paddingLeft: 20,
  	paddingRight: 20,
  },
  findHomesButton: {
  	paddingTop: 15,
  	paddingBottom: 15,
  	marginTop: 16,
  	borderRadius: 3,
  	backgroundColor: colors.saagColor,
  },
  findHomesButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});