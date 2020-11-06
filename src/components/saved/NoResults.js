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

export default class NoResults extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      listing:[]
    }
  }

  onRefresh=()=>{
    console.log("refreshing")
    this.props.onReferesh()
  }

  render() {
    console.log("props come here", this.props)
  	return (
//     <View>
//       <ScrollView style={styles.scrollView}>
//         <Text style={styles.heading}>
// Saved
//         </Text>
//         <Text style={styles.description}>
// Not every day is filled with adventures, but you can start planning for the next one.
//         </Text>
//         <Text style={styles.description}>
// Tap the heart on any home to start saving your favorites here.
//         </Text>
//       <View style={styles.footer}>
//         <TouchableHighlight onPress={() => this.props.goHome()} style={styles.findHomesButton}>
//           <Text style={styles.findHomesButtonText}>
// Find Items
//           </Text>
//         </TouchableHighlight>
//       </View>
//       </ScrollView>
//     </View>
<View>
<ScrollView refreshControl={
  <RefreshControl onRefresh={this.props.onReferesh} refreshing={this.props.loading} />
} style={styles.scrollView}>
  <Text style={styles.heading}>
  Saved
  </Text>
  <Text style={styles.description}>
  Not every day is filled with adventures, but you can start planning for the next one..
  </Text>
  <Text style={styles.description}>
  Tap the heart on any home to start saving your favorites here.
  </Text>
</ScrollView>
<View style={styles.footer}>
  <TouchableHighlight style={styles.findHomesButton}>
    <Text style={styles.findHomesButtonText}>
    Find Items
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