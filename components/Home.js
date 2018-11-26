'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView, StatusBar,ActivityIndicator,AsyncStorage,Dimensions} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation';
import { Icon,List,ListItem } from 'react-native-elements';
import AppStatusBar from './AppStatusBar.js';
import CameraScanner from './Scanner.js';
import DocumentScanner from './DocumentScanner.js';
import ViewReceiptDetail from './ViewReceiptDetail.js';
import {getImages} from '../services/ImagesService.js';

const {width, height} = Dimensions.get('window');
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
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
       this.viewImage = this.viewImage.bind(this);
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
      this.props.navigation.setParams({ resetTo: this.resetTo });    
  }
  
  viewImage(text){
      this.openActivityIndicator();
      this.props.navigation.navigate('View',{
            details:text
      })
      this.closeActivityIndicator();
  }

  async retriveImages(){     
     const userId = await AsyncStorage.getItem('user').then((user)=>{
          return {userId:JSON.parse(user).id};
      }) 
      const imageslist = await getImages(JSON.stringify(userId)).then(function(img){
        return img;
      })
      var images = JSON.parse(imageslist._bodyText).rows;
     
      images.map((img,index)=>{
          var strArray = img.imagetext.split('\n');
          strArray.map((str)=>{
              if(str.includes('Total') || str.includes('Available Balance') || str.includes('Transaction Amount') || str.includes('Amount')){
                  
                  images[index].total = <View style={{flex:1, flexDirection:'row'}}>
                    <Text style={{fontSize:18,fontWeight:'bold',color:'#c6535b',textAlign:'left',paddingLeft:10,width:width/2}}>
                       {strArray[0].split('\t')[0]}
                    </Text>
                    <Text style={{fontSize:18,right:5,fontWeight:'bold',color:'#c6535b',textAlign:'center',width:width/3,alignSelf: 'flex-end'}}>
                       ${str.match(/[+-]?\d+(?:\.\d+)?/g).map(Number)}
                    </Text></View>
              }   
          })
      })
      this.setState({images:images});
      this.closeActivityIndicator();
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
                            title={l.total}
                            onPress={()=>this.viewImage(l.imagetext)}
                        />
                    ))
                }
            </List>
            
           </ScrollView>
        
    );
  }
}

