import React from 'react';
import { View, Text, Dimensions, Image, Shape } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const horizontalMargin = 20;
const slideWidth = 280;

const sliderWidth = Dimensions.get("window").width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 100;

export default class DailySentenceCarousel extends React.Component {
    _renderItem ({item, index}) {
        return (
            <View style={{width: 50, height: 50, backgroundColor: 'powderblue', alignSelf:'center'}} />
        );
    }
}