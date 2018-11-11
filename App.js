/**
 * Receipt Scanner
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Home from './components/Home.js';
import Scanner from './components/Scanner.js';
import BottomToolBar from './components/BottomToolBar.js';


var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;


const Router = createStackNavigator(
  {
    Home: Home,
  },
  {
    Scanner: Scanner,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends Component {
  render() {
    return (
        <Router style={styles.appView}/>
    );
  }
}

const styles = StyleSheet.create({
  appView:{
    flex:1
  },
});
