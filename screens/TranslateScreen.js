import React from 'react';
import { View, Button, TextInput, Text, StyleSheet, ScrollView, Clipboard, StatusBar, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import utf8 from 'utf8'
import { HttpRequestHelper } from '../helpers/HttpRequestHelper';

export default class TranslateScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { originText: "", srclang: "jp", resultText: "" };
    }
    
    static navigationOptions = {
        title: '翻译',
        headerStyle: {
            backgroundColor: '#00b294',
        },
        headerTintColor: 'white',
    };
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
                                width: 64,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                            <Text style={{ color: (this.state.srclang == "jp") ? 'white' : 'black' }}>日 → 中</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ srclang: "zh" })}} style={
                            { 
                                backgroundColor: (this.state.srclang == "zh") ? '#00b294' : 'lightgray',
                                borderRadius: 24,
                                height: 32,
                                width: 64,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{ color: (this.state.srclang == "zh") ? 'white' : 'black' }}>中 → 日</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ineerContainer}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf:'center'}}>原文</Text>
                            <View style={{marginLeft: 24, alignSelf: 'center', flexDirection: 'row'}}>
                                <View style={{ marginRight: 8 }}>
                                    <Button title="清空" color="#00b294" onPress={() => this.setState({originText: ""})}/>
                                </View>
                                <View>
                                    <Button title="翻译" color="#00b294" onPress={() => {
                                        if(this.state.originText != null && this.state.originText.trim() != "") {
                                            var dst = (this.state.srclang == "jp") ? "zh" : "jp";
                                            HttpRequestHelper.translate(utf8.encode(this.state.originText), this.state.srclang, dst, (result) => {
                                                var result_str = ""; 
                                                result["trans_result"].forEach(element => {
                                                    result_str += element["dst"];
                                                    result_str += "\n";
                                                });
                                                this.setState({ resultText: result_str.trim() });
                                                Keyboard.dismiss();
                                            }, (error) => { this.setState({ resultText: "错误"}) });
                                        }
                                    }}/>
                                </View>
                            </View>
                        </View>
                        <TextInput multiline underlineColorAndroid="transparent" scrollEnabled={false} style={styles.input} placeholder="输入或粘贴要翻译的内容" selectionColor='#00b294' onChangeText={(text) => this.setState({originText: text})} value={this.state.originText}>
                        </TextInput>
                    </View>
                    <View style={styles.ineerContainer}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf:'center'}}>结果</Text>
                            <View style={{marginLeft: 24, alignSelf: 'center'}}>
                                <Button title="复制" color="#00b294" onPress={() => Clipboard.setString(this.state.resultText)}/>
                            </View>
                        </View>
                        <TextInput multiline underlineColorAndroid="transparent" scrollEnabled={false} style={styles.input} editable={false} placeholder="翻译结果将显示在此处" selectionColor='#00b294' value={this.state.resultText}>
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