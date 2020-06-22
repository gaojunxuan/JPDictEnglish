import React from 'react';
import { View, Button, Text, StyleSheet, Dimensions, ScrollView, Image, ImageBackground, StatusBar, ActivityIndicator, TouchableOpacity, TouchableHighlight, Animated, Slider, Platform } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Icon from '@expo/vector-icons';
import { SQLite } from 'expo-sqlite';
import { Audio } from 'expo-av';
import { SearchBar } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { HttpRequestHelper } from '../helpers/HttpRequestHelper';
import { QueryHelper } from '../helpers/QueryHelper';
import HideableView from '../components/HideableView';

const horizontalMargin = 20;
const slideWidth = 280;
const sliderWidth = Dimensions.get("window").width;
const windowWidth = Dimensions.get("window").width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 200;
const contentOffset = (sliderWidth - itemWidth) / 2;
const audioPlayer = new Audio.Sound();
const radioPlayer = new Audio.Sound();

const gutter = 12;
const swiperWidth = windowWidth - ( gutter * 4 );

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
        headerStyle: {
            backgroundColor: '#00b294',
        },
        headerTintColor: 'white',
    };

    constructor(props) {
        super(props);
        QueryHelper.prepareDb();
        this.state = { dailySentence: [], easyNews: [], radioNews: [], radioPosition: 0, radioPaused: true, radioLoaded: false };
        console.log(FileSystem.documentDirectory);
    }

    componentDidMount() {
        HttpRequestHelper.getDailySentences((result) => { this.setState({ dailySentence: result }) });
        HttpRequestHelper.getEasyNews((result) => this.setState({ easyNews: result }));
        HttpRequestHelper.getNHKRadioNews((result) => { this.setState({ radioNews: result })});
        radioPlayer.setOnPlaybackStatusUpdate((status)=> {
            this.setState({ radioPosition: status.positionMillis / status.playableDurationMillis, radioPaused: !status.isPlaying, radioLoaded: status.isLoaded });
        });
    }

    async onSlidingComplete(value) {
      var status = await radioPlayer.getStatusAsync();
      radioPlayer.setPositionAsync(value * status.durationMillis);
    }
    render () {
        var images = [ require('../assets/0.jpg'), require('../assets/1.jpg'), require('../assets/2.jpg') ];
        return (
           <ScrollView style={styles.container}>
               <StatusBar barStyle='light-content'/>
               <TouchableOpacity style={{ backgroundColor: '#d9d9d9', opacity: 0.5, borderRadius: 4, height: 36, marginLeft: 24, marginRight: 24, marginBottom: 24, justifyContent: 'center'}} activeOpacity={1} onPress={() => {
                   this.props.navigation.navigate('Search');
               }}>
                   <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon.Ionicons name={`ios-search`} size={14} color='gray'></Icon.Ionicons>
                        <Text style={{ fontSize: 14, marginLeft: 8, color: 'gray' }}>Tap to search</Text>
                   </View>
               </TouchableOpacity>
               <View style={styles.ineerContainer}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 24, marginBottom: 12}}>Japanese Proverbs</Text>
                    <View style={{ overflow: 'visible' }}>
                        <Swiper height={250} showsPagination={false}>
                            <ImageBackground imageStyle={{ borderRadius: 10 }} style={styles.carouselItem} source={images[0]}>
                                <ActivityIndicator animating={this.state.dailySentence.length < 1} size="small" color="white" style={{ position: 'absolute', alignSelf: 'center', marginTop: 125 }}/>
                                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginLeft: 24, marginRight: 24, lineHeight: 24 }}>{Object(this.state.dailySentence[0]).sentence}</Text>
                                <Text style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, textAlign: 'center', marginLeft: 32, marginRight: 32, marginTop: 8, lineHeight: 20 }}>{Object(this.state.dailySentence[0]).trans}</Text>
                                <View style={{ flexDirection: 'row', opacity: (this.state.dailySentence.length < 1 ? 0 : 1) }}>
                                    <TouchableOpacity disabled={this.state.dailySentence.length < 1} onPress={async() => {
                                        try {
                                            await audioPlayer.unloadAsync();
                                            await audioPlayer.loadAsync({ uri: Object(this.state.dailySentence[0]).audio });
                                            await audioPlayer.playAsync();
                                        } catch(error) {
                                            console.warn(error);
                                        }
                                    }}>
                                        <Icon.Ionicons name="ios-volume-high" color="white" size={26} style={{ marginTop: 8 }}>
                                        </Icon.Ionicons>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        
                            <ImageBackground imageStyle={{ borderRadius: 10 }} style={styles.carouselItem} source={images[1]}>
                                <ActivityIndicator animating={this.state.dailySentence.length < 2} size="small" color="white" style={{ position: 'absolute', alignSelf: 'center', marginTop: 125 }}/>
                                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginLeft: 24, marginRight: 24, lineHeight: 24 }}>{Object(this.state.dailySentence[1]).sentence}</Text>
                                <Text style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, textAlign: 'center', marginLeft: 32, marginRight: 32, marginTop: 8, lineHeight: 20 }}>{Object(this.state.dailySentence[1]).trans}</Text>
                                <View style={{ flexDirection: 'row', opacity: (this.state.dailySentence.length < 2 ? 0 : 1) }}>
                                    <TouchableOpacity disabled={this.state.dailySentence.length < 2} onPress={async() => {
                                        try {
                                            await audioPlayer.unloadAsync();
                                            await audioPlayer.loadAsync({ uri: Object(this.state.dailySentence[1]).audio });
                                            await audioPlayer.playAsync();
                                        } catch(error) {
                                            console.warn(error);
                                        }
                                    }}>
                                        <Icon.Ionicons name='ios-volume-high'  color="white" size={26} style={{ marginTop: 8 }}>
                                        </Icon.Ionicons>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>

                            <ImageBackground imageStyle={{ borderRadius: 10 }} style={styles.carouselItem} source={images[2]}>
                                <ActivityIndicator animating={this.state.dailySentence.length < 3} size="small" color="white" style={{ position: 'absolute', alignSelf: 'center', marginTop: 125 }}/>
                                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginLeft: 24, marginRight: 24, lineHeight: 24 }}>{Object(this.state.dailySentence[2]).sentence}</Text>
                                <Text style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, textAlign: 'center', marginLeft: 32, marginRight: 32, marginTop: 8, lineHeight: 20 }}>{Object(this.state.dailySentence[2]).trans}</Text>
                                <View style={{ flexDirection: 'row', opacity: (this.state.dailySentence.length < 3 ? 0 : 1) }}>
                                    <TouchableOpacity disabled={this.state.dailySentence.length < 3} onPress={async() => {
                                        try {
                                            await audioPlayer.unloadAsync();
                                            await audioPlayer.loadAsync({ uri: Object(this.state.dailySentence[2]).audio });
                                            await audioPlayer.playAsync();
                                        } catch(error) {
                                            console.warn(error);
                                        }
                                    }}>
                                        <Icon.Ionicons name="ios-volume-high" color="white" size={26} style={{ marginTop: 8 }}>
                                        </Icon.Ionicons>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </Swiper>
                    </View>
               </View>
               <View style={styles.ineerContainer}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 24, marginBottom: 16, marginTop: -12 }}>NHK News</Text>
                    <ScrollView horizontal={true} style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 12 }}>
                        <View style={{ flexDirection: 'row', paddingRight: 24 }}>
                            {this.state.easyNews.map((news) => (
                                <View key={news.newsId} style={{ flexDirection: 'row' }}>
                                    <View style={styles.shadowContainer}>
                                        <Image style={{ width: 140, height: 80, borderRadius: 8, }}source={{ uri: news.imageUri }} defaultSource={require('../assets/imgnotfound.png')}>
                                        </Image>
                                    </View>
                                    <View style={{ marginLeft: 12, marginRight: 16, marginTop: 4 }}>
                                        <Text style={{ fontSize: 18 }}>{news.title}</Text>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }} onPress={() => {
                                            this.props.navigation.navigate('NewsReader', { newsId: news.newsId, img: news.imageUri, title: news.title });
                                        }}>
                                            <Icon.Ionicons name='md-book' color='#00b294' size={18}></Icon.Ionicons>
                                            <Text style={{ color: '#00b294', fontSize: 16, marginLeft: 8}}>Read</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
               </View>
               
               <View style={styles.ineerContainer}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 24, marginBottom: 16, marginTop: 12 }}>NHK Radio News</Text>
                    <HideableView hide={!this.state.radioLoaded}>
                        <View style={{flexDirection: 'row', marginLeft: 26, marginRight: 24, alignItems: 'center'}}>
                            <TouchableOpacity style={{ flex: 0.05 }} onPress={async()=>{
                                    var status = await radioPlayer.getStatusAsync();
                                    if(status.isLoaded) {
                                        if(status.isPlaying) {
                                            await radioPlayer.pauseAsync();
                                        }
                                        else {
                                            await radioPlayer.playAsync();
                                        }
                                    }
                                }}>
                                <Icon.Ionicons size={32} color='#00b294' name={(this.state.radioPaused ? 'ios-play' : 'ios-pause')}></Icon.Ionicons>
                            </TouchableOpacity>
                            <Slider style={{flex: 0.95, marginLeft: 12}} minimumTrackTintColor='#00b294' value={this.state.radioPosition} onSlidingComplete={this.onSlidingComplete}>
                            </Slider>
                        </View>
                    </HideableView>
                    <ScrollView horizontal={true} style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 64 }}>
                        <View style={{ flexDirection: 'row', paddingRight: 24 }}>
                            {this.state.radioNews.map((news) => (
                                <TouchableBounce key={news.title} style={{ marginRight: 8 }} onPress={async()=>{
                                    try {
                                        await radioPlayer.unloadAsync();
                                        await radioPlayer.loadAsync({ uri: Object(news).soundurl });
                                        await radioPlayer.playAsync();
                                        this.setState({ radioPaused: false })
                                    } catch(error) {
                                        console.warn(error);
                                    }
                                }}>
                                    <View style={{ borderRadius: 8, backgroundColor: '#00b294', padding: 12, flexDirection: 'row' }}>
                                        <Icon.Ionicons name="ios-volume-high" color="white" size={32} style={{ marginTop: 8 }}/>
                                        <View style={{ justifyContent: 'center', marginLeft: 12 }}>
                                            <Text style={{ color: 'white', fontSize: 18 }}>{news.title}</Text>
                                            <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}>{news.startdate}</Text>
                                        </View>
                                    </View>
                                </TouchableBounce>
                            ))}
                        </View>
                    </ScrollView>
               </View>
           </ScrollView>
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {
            paddingTop: 32,
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white',
        },
        ineerContainer: {
            marginBottom: 12,
        },
        input: {
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            marginTop: 24,
            marginRight: 24,
            marginBottom: 24,
            paddingBottom: 8,
            fontSize: 18,
            justifyContent: 'flex-start',
        },
        carouselItem: { 
            marginTop: 12,
            width: swiperWidth, 
            height: itemHeight, 
            backgroundColor: '#00b294', 
            flexDirection: 'column',
            borderRadius: 10, 
            shadowColor: 'black',
            shadowRadius: 6,
            shadowOffset:
            {
                height: 2
            },
            shadowOpacity: 0.3,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
        },
        shadowContainer: {
            shadowColor: 'black',
            shadowRadius: 4,
            shadowOffset:
            {
                height: 1
            },
            shadowOpacity: 0.3,
        }
    }
)