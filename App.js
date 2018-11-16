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
import Navigation from './components/BottomToolBar.js';

const HomeTab = createStackNavigator({
    Home:{
      screen:Home,
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
        headerRight: (
            <Icon name='sign-out' 
                  type='font-awesome' 
                  containerStyle={styles.menuIcon} 
                  onPress={() =>{
                                 AsyncStorage.removeItem('user');
                                 const navigateAction = StackActions.reset({
                                                            index: 0,
                                                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                                                        });
                                 this.props.navigation.dispatch(navigateAction);
                                }} />
        ),
        /*headerLeft: (
            <Icon name='menu' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} /> 
        ),*/
      })
    },
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

const LoginNavigation = createStackNavigator({
    Login:{
      screen:Login,
      navigationOptions:() => ({
        header:null
      })  
    },
    Signup:{
      screen:Signup,
      navigationOptions:() => ({
        header:null
      }) 
    },
    Home:{
      screen:AppNavigation,
      navigationOptions:() => ({
        header:null
      }) 
    }
});

export default class App extends Component {
    
  constructor(props){
      super(props);
      this.state={
          isLoggedin:false,
      }
      this.view = this.view.bind(this);
      this.renderView = this.renderView.bind(this);
  }
  async view (){
         var details =  await AsyncStorage.getItem('user').then(function(user){
             if(user !== null){
                return JSON.parse(user)
             }else{
                 return false;
             }
         })
         console.log('Details ',details);
         if(!details){
             
         }else{
             if(details.isLoggedin === 'true'){
                this.setState({isLoggedin: true });
            }
         }
      return details.isLoggedin;
  }
      
  componentWillMount(){
  }  
  async componentDidMount() {
    const renderComponent = await this.view();
  }
  
  renderView() {
    if(!this.renderComponent){
        return <LoginNavigation style={styles.appView}/>;
    }else{
        return <AppNavigation style={styles.appView}/>;
    }
  };    
  render() {
     
     return (
       <SafeAreaView style={styles.pageView} forceInset={{bottom:'never' }}>      
        {this.renderView()}
       </SafeAreaView>
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
