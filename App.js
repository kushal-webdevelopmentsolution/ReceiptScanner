/**
 * Receipt Scanner
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Home from './components/Home.js';
import CameraScanner from './components/Scanner.js';
import DocumentScanner from './components/DocumentScanner.js';
import ViewReceiptDetail from './components/ViewReceiptDetail.js';
import BottomToolBar from './components/BottomToolBar.js';


var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

const HomeTab = createStackNavigator({
    Home:{
      screen:Home,
      navigationOptions:() => ({
        title: 'Home',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:20,
        },
        /*headerRight: (
            <Icon name='plus' type='font-awesome' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} />
        ),
        headerLeft: (
            <Icon name='menu' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} /> 
        ),*/
      })
    },
    Scanner: {
      screen:DocumentScanner,
      navigationOptions:() => ({
        title: 'Scanner',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:20,
        },
        /*headerRight: (
            <Icon name='plus' type='font-awesome' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} />
        ),
        headerLeft: (
            <Icon name='menu' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} /> 
        ),*/
      })
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const DocumentScannerTab = createStackNavigator({
    Scanner: {
      screen:DocumentScanner,
      navigationOptions:() => ({
        title: 'Scanner',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:20,
        },
        /*headerRight: (
            <Icon name='plus' type='font-awesome' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} />
        ),
        headerLeft: (
            <Icon name='menu' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} /> 
        ),*/
      })
    },
    View: {
      screen:ViewReceiptDetail,
      navigationOptions:() => ({
        title: 'View',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:20,
        },
        /*headerRight: (
            <Icon name='plus' type='font-awesome' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} />
        ),
        headerLeft: (
            <Icon name='menu' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} /> 
        ),*/
      })
    } 
  });

const AppNavigation = createBottomTabNavigator({
  Home: {
    screen: HomeTab
  },
  Scanner: {
    screen: DocumentScannerTab,
  }
},{
  tabBarOptions: {
  title:'Receipt Scanner',    
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
)


export default class App extends Component {
  render() {
    return (
        <AppNavigation style={styles.appView}/>
    );
  }
}

const styles = StyleSheet.create({
  appView:{
    flex:1
  },
});
