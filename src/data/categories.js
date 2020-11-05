import { Icon } from 'native-base';
import colors from '../styles/colors';
import React from 'react'
const listing1Photo = require('./photos/listing1.png');
const listing2Photo = require('./photos/listing2.png');
const listing3Photo = require('./photos/listing3.png');
const listing4Photo = require('./photos/listing4.png');
const listing5Photo = require('./photos/listing5.png');
const listing6Photo = require('./photos/listing6.png');
const listing7Photo = require('./photos/listing7.png');
const listing8Photo = require('./photos/listing8.png');

const CategoriesList = [
  {
    title: 'Categories',
    boldTitle: false,
    showAddToFav: true,
    listings: [
      {
        id: 1,
        photo:'https://firebasestorage.googleapis.com/v0/b/saagg-e874a.appspot.com/o/categories%2Fcamping.png?alt=media&token=e1adc1b5-824c-49d2-9732-1813e8ef0874',
        title: 'HOME',
      },
      {
        id: 5,
        iconType:'AntDesign',
        iconName:'mobile1',
        title: 'MOBILE',
      },
      {
        id: 2,
        iconType:'AntDesign',
        iconName:'laptop',
        title: 'LAPTOP',
      },
      {
        id: 3,
        iconType:'FontAwesome5',
        iconName:'couch',
        title: 'COUCH',
      },
      {
        id: 4,
        iconType:'FontAwesome5',
        iconName:'biking',
        title: 'BIKES',
      },
      {
        id: 5,
        iconType:'Ionicons',
        iconName:'car-sport-sharp',
        title: 'CAR',
      },
      {
        id: 6,
        iconType:'FontAwesome5',
        iconName:'building',
        title: 'HOUSE',
      }
    ],
  },
];

export default CategoriesList;