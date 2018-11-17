/**
 * Receipt Scanner
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Login from './components/login.js';
import Signup from './components/signup.js';
import Home from './components/Home.js';
import CameraScanner from './components/Scanner.js';
import DocumentScanner from './components/DocumentScanner.js';
import ViewReceiptDetail from './components/ViewReceiptDetail.js';
import BottomToolBar from './components/BottomToolBar.js';
import Navigations from './components/Navigation.js';

export default class App extends Component {

  render() {
     
     return (
       <Navigations style={styles.appView} />
    )
  }
}

const styles = StyleSheet.create({
   pageView: {
    flex: 1,
    backgroundColor:'#c6535b',
    color:'#FFFFFF'   
  },
  appView:{
    flex:1,  
  },
});
