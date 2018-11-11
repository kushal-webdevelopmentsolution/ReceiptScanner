'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Dimensions} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import AppStatusBar from './AppStatusBar.js';
import Camera from './Scanner.js';



const instructions = Platform.select({
  ios: 'This is Home Page',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor:'#F5F5F5',
  },
  homeScreen:{
    flex:1,
  },
});


class Home extends Component {

  render() {
    return (
      <SafeAreaView style={styles.pageView} forceInset={{ top: 'never',bottom:'never' }}>

        <View style={styles.homeScreen}>
          <Text> {instructions} </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const HomeTab = createBottomTabNavigator({
  Home: {
    screen: Home,
  },
  Camera: {
    screen: Camera,
  },
},{
  tabBarOptions: {
  activeTintColor: '#FFFFFF',
    labelStyle: {
      fontSize: 18,
      fontWeight:'bold',
    },
    style: {
      backgroundColor: '#f4511e',
      color: 'white',

    },
    }
  }
);

HomeTab.navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize:20,
    },
    headerRight: (
        <Icon name='plus' type='font-awesome' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} />
      ),
    headerLeft: (
        <Icon name='menu' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} /> 
      ),
  };

export default createStackNavigator({
  Home: {
    screen: HomeTab
  },
}, {
  //headerMode: 'none',
});

