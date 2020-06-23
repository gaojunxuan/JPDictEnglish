import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
//import { NavigationEvents } from 'react-navigation';

export default class NewsReaderScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { uri: "" };
        this.setNavigationOptions()
    }
    componentDidMount() {
      var newsId = this.props.route.params?.newsId ?? "0";
      var img = this.props.route.params?.img ?? "0";
      this.setState({ uri: `https://slwspfunc.azurewebsites.net/api/GetMobileNewsWithRuby?code=jA68hxddggHVtOQ8K6AQs4uWHMwDTkLioRYBVMCL5bHdwQLpqkrs6w==&id=${newsId}&img=${img}` })
    }
    setNavigationOptions() {
      this.props.navigation.setOptions({
        title: this.props.route.params?.title ?? 'News',
          headerStyle: {
              backgroundColor: 'white',
          },
          headerTintColor: 'black',
      });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f8f5e9' }}>
                <StatusBar barStyle='dark-content'></StatusBar>
                <WebView style={{ flex: 1, backgroundColor: '#f8f5e9' }} source={{uri: this.state.uri }}>

                </WebView>
            </View>
        );
    }
}