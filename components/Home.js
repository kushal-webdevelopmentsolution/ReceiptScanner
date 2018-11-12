'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import AppStatusBar from './AppStatusBar.js';
import CameraScanner from './Scanner.js';
import DocumentScanner from './DocumentScanner.js';
import ViewReceiptDetail from './ViewReceiptDetail.js';


const instructions = Platform.select({
  ios: 'This is Home Page',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor:'#F5F5F5',
  },
  homeScreen:{
    flex:1,
  },
});


export default class Home extends Component {

  render() {
    return (
      <SafeAreaView style={styles.pageView} forceInset={{bottom:'never' }}>
        <View style={styles.homeScreen}>
          <Text> {instructions} </Text>
        </View>
      </SafeAreaView>
    );
  }
}

