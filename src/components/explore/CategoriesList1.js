import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import HeartButton from '../buttons/HeartButton';
import colors from '../../styles/colors';
import { Thumbnail, Icon } from 'native-base';
import FastImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export default class CategoriesArray extends Component {
  constructor(props) {
    super(props);

    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape'
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });

    this.renderListings = this.renderListings.bind(this);
  }

  renderListings() {
  	const {
      listing, showSelected
    } = this.props;
    return listing.map((listing, index) => (
      <TouchableHighlight
        // style={styles.card}
        style={this.state.orientation === "portrait" ? styles.card : styles.cardLand}
        onPress={() => showSelected(listing.categoryName)}
        key={`listing-${index}`}
      >
        <View style={{alignItems:'center'}}>
            {/* <Icon  style={{fontSize: 30, marginTop:widthPercentageToDP('5%')}} type={listing.iconType} name={listing.iconName} /> */}
            <FastImage
                style={styles.image}
                resizeMode="contain"
                indicator={ProgressBar}
                source={listing.photo && { uri : listing.photo}}
            />
            <Text textBreakStrategy="highQuality" style={this.state.orientation === "portrait" ? [{ color: listing.color }, styles.listingType] : [{ color: listing.color }, styles.listingTypeLand]}>
                {listing.categoryName}{" "}
            </Text>
        </View>    
      </TouchableHighlight>
    ));
  }

  render() {
      const { title, boldTitle, seeAll } = this.props;
      console.log("props come here", this.props)
  	const titleStyle = boldTitle ? { fontSize: 22, fontWeight: '600' } : { fontSize: 18 };
    return (
    <View style={styles.wrapper}>
      <View style={styles.titleWrapper}>
        <Text  textBreakStrategy="highQuality" adjustsFontSizeToFit={true} style={[titleStyle, styles.title]}>
          {title}
        </Text>
        {/* <TouchableOpacity style={styles.seeAllBtn}>
          <Text textBreakStrategy="highQuality" adjustsFontSizeToFit={true} style={styles.seeAllBtnText}>
See all
          </Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingRight: 30 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {this.renderListings()}
      </ScrollView>
    </View>
  	);
  }
}

// Listings.propTypes = {
//   title: PropTypes.string.isRequired,
//   boldTitle: PropTypes.bool,
//   listings: PropTypes.array.isRequired,
//   showAddToFav: PropTypes.bool,
//   handleAddToFav: PropTypes.func,
//   showSelected: PropTypes.func,
//   seeAll: PropTypes.func,
//   favouriteListings: PropTypes.array,
// };

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 21,
    paddingRight: 21,
  },
  title: {
    color: colors.gray04,
  },
  seeAllBtn: {
  	marginTop: 2,
  	flexDirection: 'row',
  	alignItems: 'center',
  	justifyContent: 'space-between',
  },
  seeAllBtnText: {
  	color: colors.saagColor,
  	marginRight: 5,
  },
  scrollView: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 40,
    // backgroundColor:'green'
  },
  card: {
    marginRight: 6,
    marginLeft: 6,
    width: widthPercentageToDP('20%'),
    flexDirection: 'column',
    minHeight: 100,
    // backgroundColor:'grey',
    borderRadius:150
  },
  cardLand: {
    marginRight: 6,
    marginLeft: 6,
    width: widthPercentageToDP('20%'),
    flexDirection: 'column',
    minHeight: 100,
    // backgroundColor:'red',
    borderRadius:150
  },
  image: {
    width: 80,
    flex: 1,
    height: 50,
    borderRadius: 8,
    marginBottom: 7,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray04,
    marginTop: 2,
  },
   listingType: {
  	fontWeight: '700',
    fontSize: widthPercentageToDP('3%'),
    textAlign:'center',
    width:widthPercentageToDP('25%'),
    marginTop:10
  },
  listingTypeLand: {
   fontWeight: '700',
   fontSize: widthPercentageToDP('2%'),
   textAlign:'center',
   width:widthPercentageToDP('25%'),
   marginTop:10
 },
  addToFavoriteBtn: {
    position: 'absolute',
    right: 12,
    top: 7,
    zIndex: 2,
  },
  listingPrice: {
  	color: colors.gray04,
  	marginTop: 4,
  	marginBottom: 2,
  	fontSize: 12,
  	fontWeight: '300',
  },
});