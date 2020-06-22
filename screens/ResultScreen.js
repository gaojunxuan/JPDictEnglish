import React from 'react';
import { View, Button, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, ActivityIndicator, Platform, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import { NavigationEvents } from '@react-navigation';
import Expo from 'expo';
import * as Icon from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import HideableView from '../components/HideableView';
import { VerbConjugationHelper } from '../helpers/VerbConjugationHelper'
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { NotebookHelper } from '../helpers/NotebookHelper';
import { QueryHelper } from '../helpers/QueryHelper';

const tileWidth = Dimensions.get("window").width - ((Platform.OS === 'android') ? 40 : 24);
var { windowWidth, windowHeight } = Dimensions.get('window');
var self;
export default class ResultScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title:  "结果",
            headerStyle: {
                backgroundColor: '#00b294',
            },
            headerRight: (
                <TouchableOpacity onPress={ params.isInNotebook ? () => self.removeFromNotebook() : () => self.addToNotebook() }>
                    <Icon.Ionicons name={ params.isInNotebook ? `${Platform.OS === 'ios' ? 'ios' : 'md'}-trash` : `${Platform.OS === 'ios' ? 'ios' : 'md'}-bookmark` } style={{ color: 'white', marginRight: 12 }} size={24}/>
                </TouchableOpacity>
            ),
            headerTintColor: 'white',
        };
    };

    constructor(props) {
        super(props);
        self = this;
        this.state = { result: [], kanji: [], isInNotebook: false, kanjiResult: {}, onlineResult: {}, verbResult: {}, keyword: "", hasKanji: true, hasSeeAlso: false, hasLoanWord: false, hasVerb: false, fadeInAnim: new Animated.Value(0), queryBusy: true };
    }

    queryKanjiResult(keyword) {
        keyword.forEach(element => {
            QueryHelper.queryKanji(element, (_array) => {
                var kanjiResult = this.state.kanjiResult;
                kanjiResult[_array[0].Kanji] = { kun: _array[0].KunReading, on: _array[0].OnReading }
                this.setState({ kanjiResult: kanjiResult });
            })
        });
    }

    addToNotebook() {
        this.props.navigation.setParams({ isInNotebook: true });
        NotebookHelper.add(this.state.result[0]);
    }

    removeFromNotebook() {
        this.props.navigation.setParams({ isInNotebook: false });
        NotebookHelper.remove(this.state.result[0]);
    }

    render() {
        var id = this.props.navigation.getParam("itemId", "0");
        var keyword = this.props.navigation.getParam('keyword', "");
        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'/>
                <NavigationEvents onDidFocus={() => {
                    QueryHelper.query(id, keyword, (_array)=>{
                        this.setState({ result: _array, keyword: _array[0].Keyword }); 
                        if(_array[0].Kanji == "" || _array[0].Kanji == null)
                        {
                            this.setState({ hasKanji: false });
                        }
                        else
                        {
                            var kanjiRegex = /[\u4e00-\u9fa5]+/g;
                            var kanjiFiltered = _array[0].Kanji.match(kanjiRegex);
                            var kanji = [];
                            kanjiFiltered.forEach(element => {
                                Array.from(element).forEach(element1 => kanji.push(element1));
                            });
                            this.setState({ kanji: Array.from(new Set(kanji)) });
                        }
                        if(_array[0].LoanWord != "")
                        {
                            this.setState({ hasLoanWord: true });
                        }
                        if(_array[0].SeeAlso != "")
                        {
                            this.setState({ hasSeeAlso: true });
                        }
                        var pos = String(_array[0].Pos);
                        if (pos.includes("五") | pos.includes("一") | pos.includes("サ") | pos.includes("カ") | pos.includes("動詞"))
                        {
                            this.setState( { hasVerb: true });
                            var keyword = this.state.keyword;
                            if (pos.includes("サ") && !keyword.endsWith("する"))
                            {
                                keyword += "する";
                            }
                            this.setState( { verbResult: {
                                Causative: VerbConjugationHelper.GetCausative(keyword, pos),
                                EbaForm: VerbConjugationHelper.GetEbaForm(keyword, pos),
                                Imperative: VerbConjugationHelper.GetImperative(keyword, pos),
                                MasuForm: VerbConjugationHelper.GetMasuForm(keyword, pos),
                                MasuNegative: VerbConjugationHelper.GetMasuNegative(keyword, pos),
                                NegativeCausative: VerbConjugationHelper.GetNegativeCausative(keyword, pos),
                                NegativeForm: VerbConjugationHelper.GetNegative(keyword, pos),
                                NegativeImperative: VerbConjugationHelper.GetNegativeImperative(keyword),
                                NegativePassive: VerbConjugationHelper.GetNegativePassive(keyword, pos),
                                NegativePotential: VerbConjugationHelper.GetNegativePotential(keyword, pos),
                                OriginalForm: keyword,
                                Passive: VerbConjugationHelper.GetPassive(keyword, pos),
                                PastNegative: VerbConjugationHelper.GetPastNegative(keyword, pos),
                                Potential: VerbConjugationHelper.GetPotential(keyword, pos),
                                TaForm: VerbConjugationHelper.GetTaForm(keyword, pos),
                                TeForm: VerbConjugationHelper.GetTeForm(keyword, pos),
                                Volitional: VerbConjugationHelper.GetVolitional(keyword, pos)
                            }});
                        }
                        this.queryKanjiResult(this.state.kanji);
                        this.setState({ queryBusy: false });
                        Animated.timing(
                            this.state.fadeInAnim,
                            {
                                toValue: 1,
                                duration: 300,
                            }
                        ).start(() => NotebookHelper.isInNotebook(this.state.result[0], () => this.props.navigation.setParams({ isInNotebook: true })));
                    });
                    
                }}>
                </NavigationEvents>
                <Swiper activeDotColor='#00b294'>
                    <ScrollView style={{flex: 1}}>
                        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', left: 0, right: 0, top: 0, bottom: 0  }}>
                            <ActivityIndicator animating={this.state.queryBusy} size="small" color="#00b294"/>                            
                        </View>
                        <Animated.View style={{paddingTop: 24, paddingLeft: 12, paddingRight: 12, paddingBottom: 24, opacity: this.state.fadeInAnim}}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{fontSize: 24, color: '#00b294', marginRight: 8}}>{this.state.keyword}</Text>
                                <TouchableOpacity  onPress={() => {
                                    Speech.speak(Object(this.state.result[0]).Reading, { language: "ja", rate: 0.5 })
                                }}>
                                    <Icon.Ionicons name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-volume-high`} color='#00b294' size={32}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop: 24}}>
                                <Text style={{color: 'gray', fontSize: 12}}>读音</Text>
                                <Text style={{fontSize: 20, marginTop: 8}}>{Object(this.state.result[0]).Reading}</Text>
                            </View>
                            <HideableView hide={!this.state.hasKanji} style={{marginTop: 24}}>
                                <Text style={{color: 'gray', fontSize: 12}}>汉字</Text>
                                <Text style={{fontSize: 20, marginTop: 8}}>{Object(this.state.result[0]).Kanji}</Text>
                            </HideableView>
                            <HideableView hide={!this.state.hasLoanWord} style={{marginTop: 24}}>
                                <Text style={{color: 'gray', fontSize: 12}}>外来语</Text>
                                <Text style={{fontSize: 20, marginTop: 8}}>{Object(this.state.result[0]).LoanWord}</Text>
                            </HideableView>
                            <HideableView hide={!this.state.hasSeeAlso} style={{marginTop: 24}}>
                                <Text style={{color: 'gray', fontSize: 12}}>另见</Text>
                                <Text style={{fontSize: 20, marginTop: 8}}>{Object(this.state.result[0]).SeeAlso}</Text>
                            </HideableView>
                            <View style={{marginTop: 24, marginRight: 12}}>
                                <Text style={{color: 'gray', fontSize: 12}}>释义</Text>
                                {this.state.result.map(({ Definition, Pos, DefinitionId }) => (
                                    <View key={DefinitionId} style={{flex: 1, flexDirection: 'row', marginTop: 8, alignItems: 'flex-start'}}>
                                        <Text style={{fontSize: 20, color: 'darkgray', marginRight: 4}}>{Pos}</Text>
                                        <Text style={{fontSize: 20, flex: 1, flexWrap: 'wrap', lineHeight: 28}}>{Definition}</Text>
                                    </View>
                                ))}
                            </View>
                            <HideableView hide={!this.state.hasKanji} style={{marginTop: 24, marginRight: 12}}>
                                <Text style={{color: 'gray', fontSize: 12}}>汉字详细</Text>
                                <View>
                                    {this.state.kanji.map((k) => (
                                        <TouchableBounce key={k} onPress={() => {
                                            this.props.navigation.push('Kanji', { keyword: k });
                                        }}>
                                            <View style={
                                                {
                                                    flex: 1, 
                                                    flexDirection: 'row', 
                                                    marginTop: 16, 
                                                    alignItems: 'center', 
                                                    borderRadius: 10,
                                                    shadowColor: 'black',
                                                    shadowRadius: 4,
                                                    shadowOffset:
                                                    {
                                                        height: 1
                                                    },
                                                    shadowOpacity: 0.2,
                                                    width: tileWidth,
                                                    height: 100,
                                                    backgroundColor: 'white',
                                                    borderColor: '#E9E9E9',
                                                    borderWidth: (Platform.OS === 'android') ? 1.2 : 0,
                                                    margin: (Platform.OS === 'android') ? 2 : 0
                                                }
                                            }>
                                                <Text style={{fontSize: 24, marginLeft: 12, flexWrap: 'wrap', lineHeight: 28, color: '#00b294'}}>{k}</Text>
                                                <View style={{ marginLeft: 12 }}>
                                                    <Text style={{ width: tileWidth - 64}}>{Object(this.state.kanjiResult[k]).kun}</Text>
                                                    <Text style={{ width: tileWidth - 64, marginTop: 4}}>{Object(this.state.kanjiResult[k]).on}</Text>
                                                </View>
                                            </View>
                                        </TouchableBounce>
                                    ))}
                                </View>
                                
                            </HideableView>
                            <HideableView hide={!this.state.hasVerb} style={{marginTop: 24}}>
                                <Text style={{color: 'gray', fontSize: 12}}>动词</Text>
                                <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap', marginTop: 12, marginBottom: 4}}>简体形肯定</Text>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>辞书形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.OriginalForm}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>て形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.TeForm}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>た形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.TaForm}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>假定（ば）形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.EbaForm}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>可能形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.Potential}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>被动（受身）形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.Passive}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>使役形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.Causative}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>命令形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.Imperative}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>意志形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.Volitional}</Text>
                                </View>

                                <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap', marginTop: 12, marginBottom: 4}}>简体形否定</Text>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>ない形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.NegativeForm}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>可能形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.NegativePotential}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>被动（受身）形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.NegativePassive}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>使役形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.NegativeCausative}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>命令形：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.NegativeImperative}</Text>
                                </View>
                                
                                <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap', marginTop: 12, marginBottom: 4}}>ます形</Text>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>肯定：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.MasuForm}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', marginTop: 4, alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 16, color: 'darkgray', marginRight: 4}}>否定：</Text>
                                    <Text style={{fontSize: 16, flex: 1, flexWrap: 'wrap'}}>{this.state.verbResult.MasuNegative}</Text>
                                </View>
                            </HideableView>
                        </Animated.View>
                    </ScrollView>
                </Swiper>
            </View>
            
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