/**
 * Receipt Scanner
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Login from './components/login.js';
import Signup from './components/signup.js';
import Home from './components/Home.js';
import CameraScanner from './components/Scanner.js';
import DocumentScanner from './components/DocumentScanner.js';
import ViewReceiptDetail from './components/ViewReceiptDetail.js';
import BottomToolBar from './components/BottomToolBar.js';


const SignupTab = createStackNavigator({
     Signup:{
      screen:Signup,  
    }
});
const LoginTab = createStackNavigator({
    Login:{
      screen:Login,  
    }
},
{
    initialRouteName: 'Login',
});
const HomeTab = createStackNavigator({
    Home:{
      screen:Home,
      navigationOptions:() => ({
        title: 'Home',
        headerStyle: {
            backgroundColor: '#c6535b',
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
            backgroundColor: '#c6535b',
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
    initialRouteName: 'Signup',
  }
);

const DocumentScannerTab = createStackNavigator({
    Scanner: {
      screen:DocumentScanner,
      navigationOptions:() => ({
        title: 'Scanner',
        headerStyle: {
            backgroundColor: '#c6535b',
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
            backgroundColor: '#c6535b',
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
  inactiveTintColor: '#000',
    labelStyle: {
      fontSize: 18,
      fontWeight:'bold',
    },
    style: {
      backgroundColor: '#c6535b',
      color: 'white',

    },
    }
  }
)

const LoginNavigation = createBottomTabNavigator({
  Login:{
    screen:LoginTab
  },    
  Signup: {
    screen: SignupTab
  }
},{
  tabBarOptions: { 
  activeTintColor: '#FFFFFF',
  inactiveTintColor: '#000',      
    labelStyle: {
      fontSize: 18,
      fontWeight:'bold',
    },
    style: {
      backgroundColor: '#c6535b',
      color: '#000',

    },
    }
  }
)


export default class App extends Component {
  render() {
    return (
        <LoginNavigation style={styles.appView}/>
        
    );
  }
}

const styles = StyleSheet.create({
  appView:{
    flex:1
  },
});
