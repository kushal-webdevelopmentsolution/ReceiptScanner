'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView, StatusBar,ActivityIndicator,AsyncStorage} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation';
import { Icon,List,ListItem } from 'react-native-elements';
import AppStatusBar from './AppStatusBar.js';
import CameraScanner from './Scanner.js';
import DocumentScanner from './DocumentScanner.js';
import ViewReceiptDetail from './ViewReceiptDetail.js';
import {getImages} from '../services/ImagesService.js';


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
   },
   Icon:{
       fontSize:14,
       color:'#F5F5F5',
   },    
});

export default class Home extends Component {
   constructor(props){
       super(props);
       this.state={
         isLoading:false,
         images:[],   
       }
       this.resetTo = this.resetTo.bind(this);
       this.openActivityIndicator = this.openActivityIndicator.bind(this);
       this.closeActivityIndicator = this.closeActivityIndicator.bind(this);
       this.retriveImages = this.retriveImages.bind(this);
   }
   resetTo(route) { 
    const navigateAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
    });
    this.props.navigation.dispatch(navigateAction);
  }  
  static navigationOptions = ({navigation, styles}) => ({
        title: 'Home',
        headerStyle: {
            backgroundColor: '#c6535b',
        },
        headerLayoutPreset: 'center',
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:20,
        },
        headerRight: (
            <Icon name='camera' 
                  type='font-awesome'
                  containerStyle={{paddingRight:20}} 
                  iconStyle={{fontSize:28,color:'#F5F5F5'}} 
                  onPress={() =>{
                                 navigation.state.params.resetTo('Scanner');
                                }}
            />
        ),
       headerLeft: (
            <Icon name='sign-out' 
                  type='font-awesome'
                  containerStyle={{paddingLeft:20}} 
                  iconStyle={{fontSize:28,color:'#F5F5F5'}} 
                  onPress={() =>{
                                 AsyncStorage.removeItem('user');
                                 navigation.state.params.resetTo('Login');
                                }}
            />
        ),
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
      this.retriveImages();
  }
  componentWillUpdate(){
      
  }
  componentDidUpdate(){
      
  }
  componentDidMount() {
      this.closeActivityIndicator();
      this.props.navigation.setParams({ resetTo: this.resetTo });    
  }

  async retriveImages(){
     const userId = await AsyncStorage.getItem('user').then((user)=>{
          return {userId:JSON.parse(user).id};
      }) 
      const imageslist = await getImages(JSON.stringify(userId)).then(function(img){
        return img;
      })
      var images = JSON.parse(imageslist._bodyText).rows;
      this.setState({images:images});
  }
  render() {
    return (
        <ScrollView style={styles.homeScreen} >
            <ActivityIndicator 
                    style={styles.activityIndicator}
                    animating={this.state.isLoading}
                    size="large"
                    color="#c6535b" />
            <List containerStyle={{marginBottom: 20}}>
                {
                    this.state.images.map((l) => (
                        <ListItem
                            roundAvatar
                            avatar={{uri:`data:image/jpeg;base64,${l.image}`}}
                            key={l.id}
                            title={'First Image'}
                        />
                    ))
                }
            </List>
        </ScrollView>
    );
  }
}

