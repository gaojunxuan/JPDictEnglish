import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, FlatList, TouchableHighlight, Alert, Platform, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { DictSchema } from '../models/dict'
import { SearchBar, Divider } from 'react-native-elements'
import { QueryHelper } from '../helpers/QueryHelper';

export default class SearchScreen extends React.Component {

    static navigationOptions = {
        title: '查词',
        headerStyle: {
            backgroundColor: '#00b294',
        },
        headerTintColor: 'white',
    };

    constructor(props) {
        super(props);
        this.state = { items: [], keyword: "" };
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'/>
                <NavigationEvents onDidFocus={() => {
                    if(this.searchBar != null) {
                        this.searchBar.focus();
                    }
                }}>
                </NavigationEvents>
                <SearchBar lightTheme ref={(input) => this.searchBar = input} clearButtonMode='while-editing' icon={{ name: 'search', style: { marginTop: (Platform.OS === "ios") ? 4 : 0, alignSelf: 'flex-start' } }} returnKeyType='search' placeholder='键入或粘贴' selectionColor='#00b294' searchIcon={{size: 36}} inputStyle={styles.searchBarInput} containerStyle={styles.searchBarContainer} onChangeText={(text)=>{
                    this.setState({ keyword: text });
                    text = text.replace(" ", "").replace(" ", "");
                    if (/\S/.test(text)) {
                        QueryHelper.fuzzyQuery(text, (_array) => {
                            this.setState({ items: _array });
                        });
                    }
                    else {
                        this.setState({ items: [] });
                    }
                }}>
                </SearchBar>
                <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
                    {this.state.items.map(({ ItemId, DefinitionId, Definition, Reading, Kanji }) => (
                        <TouchableHighlight key={DefinitionId} style={{ backgroundColor: 'white' }} underlayColor='#d9d9d9' onPress={()=>{
                          this.props.navigation.push('Result', { itemId: ItemId, keyword: Reading })
                        }}>
                            <View>
                                <Text style={{margin: 8, marginLeft: 12, fontSize: 16, fontWeight: 'bold'}}>{Reading}</Text>
                                <Text style={{marginLeft: 12, marginRight: 8, fontSize: 12, marginBottom: 4}}>{Definition.slice(0, 20)+"..."}</Text>
                                <Divider style={{ backgroundColor: '#d9d9d9', marginBottom: 0, marginLeft: 12, marginRight: 8 }}></Divider>
                            </View>
                        </TouchableHighlight>
                    ))}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        container: {
            paddingTop: 0,
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white'
        },
        ineerContainer: {
            marginBottom: 12,
        },
        item: {
            padding: 10,
            fontSize: 18,
            height: 44,
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
        searchBarInput: {
            height: 36,
            fontSize: 16,
            color: 'black',
            backgroundColor: 'white'
        },
        searchBarContainer: {
            justifyContent: 'center',
            backgroundColor: '#e9e9e9'
        }
    }
)