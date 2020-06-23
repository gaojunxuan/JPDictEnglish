import React from 'react';
import { View, Button, TextInput, Text, StyleSheet, ScrollView, Clipboard, StatusBar, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import utf8 from 'utf8'
import { HttpRequestHelper } from '../helpers/HttpRequestHelper';
import Colors from '../constants/Colors';

export default class TranslateScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { originText: "", srclang: "jp", resultText: "" };
        this.setNavigationOptions();
    }
    
    setNavigationOptions() {
      this.props.navigation.setOptions({
        title: 'Translator',
          headerStyle: {
              backgroundColor: Colors.tintColor,
          },
          headerTintColor: 'white',
      });
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <ScrollView style={[styles.container, { flex: 1 }]} keyboardShouldPersistTaps='handled'>
                    <StatusBar barStyle='light-content'/>
                    <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                        <TouchableOpacity onPress={() => { this.setState({ srclang: "jp" })}} style={
                            { 
                                backgroundColor: (this.state.srclang == "jp") ? '#00b294' : 'lightgray',
                                borderRadius: 24,
                                height: 32,
                                width: 72,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                            <Text style={{ color: (this.state.srclang == "jp") ? 'white' : 'black' }}>JP → EN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ srclang: "en" })}} style={
                            { 
                                backgroundColor: (this.state.srclang == "en") ? '#00b294' : 'lightgray',
                                borderRadius: 24,
                                height: 32,
                                width: 72,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{ color: (this.state.srclang == "en") ? 'white' : 'black' }}>EN → JP</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ineerContainer}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf:'center'}}>Oringinal</Text>
                            <View style={{marginLeft: 24, alignSelf: 'center', flexDirection: 'row'}}>
                                <View style={{ marginRight: 8 }}>
                                    <Button title="Clear" color="#00b294" onPress={() => this.setState({originText: ""})}/>
                                </View>
                                <View>
                                    <Button title="Translate" color="#00b294" onPress={() => {
                                        if(this.state.originText != null && this.state.originText.trim() != "") {
                                            var dst = (this.state.srclang == "jp") ? "en" : "jp";
                                            HttpRequestHelper.translate(utf8.encode(this.state.originText), this.state.srclang, dst, (result) => {
                                                var result_str = ""; 
                                                result["trans_result"].forEach(element => {
                                                    result_str += element["dst"];
                                                    result_str += "\n";
                                                });
                                                this.setState({ resultText: result_str.trim() });
                                                Keyboard.dismiss();
                                            }, (error) => { this.setState({ resultText: "Error"}) });
                                        }
                                    }}/>
                                </View>
                            </View>
                        </View>
                        <TextInput multiline underlineColorAndroid="transparent" scrollEnabled={false} style={styles.input} placeholder="Type or paste in the text to translate" selectionColor='#00b294' onChangeText={(text) => this.setState({originText: text})} value={this.state.originText}>
                        </TextInput>
                    </View>
                    <View style={styles.ineerContainer}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf:'center'}}>Translated</Text>
                            <View style={{marginLeft: 24, alignSelf: 'center'}}>
                                <Button title="Copy" color="#00b294" onPress={() => Clipboard.setString(this.state.resultText)}/>
                            </View>
                        </View>
                        <TextInput multiline underlineColorAndroid="transparent" scrollEnabled={false} style={styles.input} editable={false} placeholder="Your result will appear here" selectionColor='#00b294' value={this.state.resultText}>
                        </TextInput>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create(
    {
        container: {
            paddingTop: 32,
            paddingLeft: 24,
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white'
        },
        ineerContainer: {
            marginBottom: 48,
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
        }
    }
)