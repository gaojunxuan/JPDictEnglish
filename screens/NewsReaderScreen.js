import React from 'react';
import { View, Text, WebView, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';

export default class NewsReaderScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { uri: "" };
    }
    componentWillMount() {
      var newsId = this.props.navigation.getParam("newsId", "0");
      var img = this.props.navigation.getParam("img", "0");
      this.setState({ uri: `https://slwspfunc.azurewebsites.net/api/GetMobileNewsWithRuby?code=jA68hxddggHVtOQ8K6AQs4uWHMwDTkLioRYBVMCL5bHdwQLpqkrs6w==&id=${newsId}&img=${img}` })
    }
    static navigationOptions =  ({navigation}) => ({
        title: navigation.getParam("title", "新闻"),
        headerStyle: {
            backgroundColor: 'white',
        },
        headerTintColor: 'black',
    });
    render() {
        var newsId = this.props.navigation.getParam("newsId", "0");
        var img = this.props.navigation.getParam("img", "0");
        return (
            <View style={{ flex: 1, backgroundColor: '#f8f5e9' }}>
                <StatusBar barStyle='dark-content'></StatusBar>
                <WebView style={{ flex: 1, backgroundColor: '#f8f5e9' }} source={{uri: this.state.uri }}>

                </WebView>
            </View>
        );
    }
}