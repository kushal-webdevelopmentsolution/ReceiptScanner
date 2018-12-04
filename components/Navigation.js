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
import Login from './login.js';
import Signup from './signup.js';
import Home from './Home.js';
import DocumentScanner from './DocumentScanner.js';
import ViewReceiptDetail from './ViewReceiptDetail.js';
/*const TabNavigation = createBottomTabNavigator({
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
)*/

const AppNavigation = createStackNavigator({
    Home:{
        screen:Home
    },
    Scanner:{
        screen:DocumentScanner
    },
    View: {
      screen:ViewReceiptDetail
    },
    Login:{
      screen:Login,
      navigationOptions:() => ({
        header:null
      })  
    },
})

const LoginNavigation = createStackNavigator({
    Login:{
      screen:Login,
      navigationOptions:() => ({
        header:null
      })  
    },
    Signup:{
      screen:Signup,
    },
    Home:{
      screen:AppNavigation,
      navigationOptions:() => ({
        header:null
      }) 
    }
});

export default class Navigations extends Component {
    
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
             this.setState({isLoggedin: false });
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
