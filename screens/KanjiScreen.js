import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Animated, Platform, StatusBar } from 'react-native';
import * as Svg from 'react-native-svg';
//import { NavigationEvents } from 'react-navigation';
import { QueryHelper } from '../helpers/QueryHelper';

const tileWidth = Dimensions.get("window").width - 64;

export default class KanjiScreen extends React.Component {
    static navigationOptions =  {
        title:  "汉字",
        headerStyle: {
            backgroundColor: '#00b294',
        },
        headerTintColor: 'white',
    };
    constructor(props) {
        super(props);
        this.state = { kanjiResult: {}, radicalResult: [], keyword: "", queryBusy: true, fadeInAnimation: new Animated.Value(0) };
    }

    queryKanji(keyword) {
        QueryHelper.queryKanji(keyword, (_array) => {
            var queryresult = _array[0];
            var result = { kun: queryresult.KunReading, on: queryresult.OnReading, strokes: queryresult.Strokes, grade: queryresult.Grade, jlpt: queryresult.Jlpt };
            this.setState({ kanjiResult: result });
        });
        //QueryHelper.queryRadical(keyword, (_array) => this.setState({ radicalResult: _array }));
        Animated.timing(
            this.state.fadeInAnimation,
            {
                toValue: 1,
                duration: 300
            }
        ).start();
    }
/*
<NavigationEvents onDidFocus={() => {
                    var keyword = this.props.navigation.getParam("keyword", "一");
                    this.setState({ keyword: keyword });
                    this.queryKanji(keyword);
                    this.setState({ queryBusy: false });
                }}>
                </NavigationEvents>
*/
    render() {
        return (
            <ScrollView style={styles.container}>
                <StatusBar barStyle='light-content'/>
                
                <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', left: 0, right: 0, top: 0, bottom: 0  }}>
                    <ActivityIndicator animating={this.state.queryBusy} size="small" color="#00b294"/>                            
                </View>
                <Animated.View style={{ flexDirection: 'row', marginLeft: 12, marginRight: 10, marginTop: 24, opacity: this.state.fadeInAnimation }}>
                    <Text style={{ fontSize: 48, color: '#00b294', fontWeight: '300'}}>{this.state.keyword}</Text>
                    <View style={{ marginLeft: 12, flexDirection: 'row', flexWrap: 'wrap', width: tileWidth, paddingRight: (Platform.OS === 'android') ? 2 : 0}}>
                        {this.state.radicalResult.map(({ SVGPath, Order }) => (
                            <View key={Order} style={{ width: 52, height: 52, backgroundColor: 'white', borderColor: 'lightgray', borderWidth: 1.2, padding: 4, justifyContent: 'center', alignItems: 'center', margin: 2}}>
                                <Svg height={42} width={42}>
                                    <Svg.Path scale={0.4} strokeWidth={2} stroke='#00b294' fillOpacity={0} d={SVGPath}></Svg.Path>
                                </Svg>
                            </View>
                            
                        ))}
                    </View>
                </Animated.View>
                <Animated.View style={{ marginLeft: 12, marginRight: 12, marginTop: 24, opacity: this.state.fadeInAnimation }}>
                    <View>
                        <Text style={{ color: 'gray', fontSize: 12}}>音读</Text>
                        <Text style={{ fontSize: 16, marginTop: 8}}>{this.state.kanjiResult.on}</Text>
                    </View>
                    <View style={{ marginTop: 12}}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>训读</Text>
                        <Text style={{ fontSize: 16, marginTop: 8}}>{this.state.kanjiResult.kun}</Text>
                    </View>
                    <View style={{ marginTop: 12}}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>笔画数</Text>
                        <Text style={{ fontSize: 16, marginTop: 8}}>{this.state.kanjiResult.strokes}</Text>
                    </View>
                    <View style={{ marginTop: 12}}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>年级</Text>
                        <Text style={{ fontSize: 16, marginTop: 8}}>{this.state.kanjiResult.grade}</Text>
                    </View>
                    <View style={{ marginTop: 12}}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>JLPT</Text>
                        <Text style={{ fontSize: 16, marginTop: 8}}>{this.state.kanjiResult.jlpt}</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});