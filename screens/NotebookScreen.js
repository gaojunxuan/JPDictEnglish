import React from 'react';
import { View, Button, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, ActivityIndicator, Platform, StatusBar } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import Expo from 'expo';
import { SQLite } from 'expo-sqlite';
import { NavigationEvents } from '@react-navigation';

const tileWidth = Dimensions.get("window").width - 26;
var { windowWidth, windowHeight } = Dimensions.get('window');
export default class NotebookScreen extends React.Component {
    static navigationOptions = {
        title: '生词本',
        headerStyle: {
            backgroundColor: '#00b294',
        },
        headerTintColor: 'white',
    };
    constructor(props) {
        super(props);
        this.db = SQLite.openDatabase('note.db');
        this.state = { result: [] }
    }
    render() {
        
        return (            
            <View style={styles.container}>
                <StatusBar barStyle='light-content'/>
                <NavigationEvents onDidFocus={() => {
                    if(this.db != null) {
                        this.db.transaction(tx => {
                            tx.executeSql(
                                `select * from Note;`,
                                [],
                                (_, { rows: { _array } }) => {
                                    this.setState({ result: _array });
                                }
                            )
                        });
                    }
                }}>
                </NavigationEvents>
                <ScrollView>
                    <View style={{ paddingLeft: 12 }}>
                        {this.state.result.map(({ItemId, Definition, Pos, Keyword, Reading, Kanji}) => (
                            <TouchableBounce key={ItemId} onPress={() => {
                                this.props.navigation.push('Result', { itemId: ItemId, keyword: Reading });
                            }}>
                                <View style={
                                    {
                                        flex: 1, 
                                        marginTop: 16, 
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        borderRadius: 10,
                                        shadowColor: 'black',
                                        shadowRadius: 4,
                                        shadowOffset:
                                        {
                                            height: 1
                                        },
                                        shadowOpacity: 0.2,
                                        width: tileWidth,
                                        height: 112,
                                        backgroundColor: 'white',
                                        borderColor: '#E9E9E9',
                                        borderWidth: (Platform.OS === 'android') ? 1.2 : 0,
                                        margin: (Platform.OS === 'android') ? 2 : 0
                                    }
                                }>
                                    <Text style={{fontSize: 24, marginLeft: 12, flexWrap: 'wrap', lineHeight: 28, color: '#00b294'}}>{Keyword}</Text>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={{ width: tileWidth - 64, color: 'gray', marginLeft: 2 }}>{Reading}</Text>
                                        <Text style={{ width: tileWidth - 64, marginTop: 8, fontSize: 16, marginLeft: 2 }} numberOfLines={2}>{Definition}</Text>
                                    </View>
                                </View>
                            </TouchableBounce>
                        ))}
                    </View>
                </ScrollView>
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