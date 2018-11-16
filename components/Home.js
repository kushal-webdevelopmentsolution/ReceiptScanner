'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView, StatusBar,ActivityIndicator,AsyncStorage} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation';
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
  activityIndicator: {
      justifyContent: 'center',
      alignItems: 'center',
      position:'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
   }  
});

export default class Home extends Component {
   constructor(props){
       super(props);
       this.state={
         isLoading:false
       }
       this.resetTo = this.resetTo.bind(this);
       this.openActivityIndicator = this.openActivityIndicator.bind(this);
       this.closeActivityIndicator = this.closeActivityIndicator.bind(this);
   }
   resetTo(route) {
    const navigateAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
    });
    this.props.navigation.dispatch(navigateAction);
  }  
  static navigationOptions = ({navigation}) => ({
        title: 'Home',
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
                                 navigation.state.params.resetTo('Home');
                                }}
            />
        ),
       /*headerLeft: (
            <Icon name='menu' containerStyle={styles.menuIcon} onPress={() => console.log('hello')} /> 
        ),*/
      })    
  openActivityIndicator(){
     this.setState({isLoading:true});
  }
  closeActivityIndicator(){
      this.setState({isLoading:false});
  }
  componentWillMount() {
      this.openActivityIndicator();
      const navigation = this.props.naviation;
  }
  /*componentWillUpdate(){
      this.openActivityIndicator();
  }*/
  componentDidUpdate(){
      
  }
  componentDidMount() {
      this.closeActivityIndicator();
      this.props.navigation.setParams({ resetTo: this.resetTo });    
  }
  render() {
    return (
        <ScrollView style={styles.homeScreen} >
            <ActivityIndicator 
                    style={styles.activityIndicator}
                    animating={this.state.isLoading}
                    size="large"
                    color="#c6535b" />
            <Text> {instructions} </Text>
        </ScrollView>
    );
  }
}

