import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import ResultScreen from '../screens/ResultScreen';
import TranslateScreen from '../screens/TranslateScreen';
import SearchScreen from '../screens/SearchScreen';
import NotebookScreen from '../screens/NotebookScreen';
import KanjiScreen from '../screens/KanjiScreen';
import NewsReaderScreen from '../screens/NewsReaderScreen';
import Colors from '../constants/Colors';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

const HomeStack = createStackNavigator();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={HomeScreen}/>
      <HomeStack.Screen name="NewsReader" component={NewsReaderScreen}/>
    </HomeStack.Navigator>
  );
}

const TranslateStack = createStackNavigator();
function TranslateStackNavigator() {
  return (
    <TranslateStack.Navigator initialRouteName="Translator">
      <TranslateStack.Screen name="Translator" component={TranslateScreen}/>
    </TranslateStack.Navigator>
  );
}

const SearchStack = createStackNavigator();
function SearchStackNavigator() {
  return (
    <SearchStack.Navigator initialRouteName="Search">
      <SearchStack.Screen name="Search" component={SearchScreen}/>
      <SearchStack.Screen name="Result" component={ResultScreen}/>
      <SearchStack.Screen name="Kanji" component={KanjiScreen}/>
    </SearchStack.Navigator>
  );
}

const NotebookStack = createStackNavigator();
function NotebookStackNavigator() {
  return (
    <NotebookStack.Navigator initialRouteName="Search">
      <NotebookStack.Screen name="Search" component={NotebookScreen}/>
      <NotebookStack.Screen name="Result" component={ResultScreen}/>
      <NotebookStack.Screen name="Kanji" component={KanjiScreen}/>
    </NotebookStack.Navigator>
  );
}
/*


const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
    Result: ResultScreen,
    Kanji: KanjiScreen
  }
)
SearchStack.navigationOptions = {
  tabBarLabel: '查词',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};

const NotebookStack = createStackNavigator(
  {
    Notebook: NotebookScreen,
    Result: ResultScreen,
    Kanji: KanjiScreen
  }
)
NotebookStack.navigationOptions = {
  tabBarLabel: '生词本',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bookmarks' : 'md-bookmarks'}
    />
  ),
};*/

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{ activeTintColor: '#00b294'}}>
      <BottomTab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-home" />,
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-search" />,
        }}
      />
      <BottomTab.Screen
        name="Notebook"
        component={NotebookStackNavigator}
        options={{
          title: 'Notebook',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-bookmarks" />,
        }}
      />
      <BottomTab.Screen
        name="Translator"
        component={TranslateStackNavigator}
        options={{
          title: 'Translator',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-globe" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

