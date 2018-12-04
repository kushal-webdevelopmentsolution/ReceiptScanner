'use strict';

import React, {Component} from 'react';
import {Platform,
        RefreshControl,
        StyleSheet,
        Text,
        View,
        ScrollView,
        StatusBar,
        ActivityIndicator,
        AsyncStorage,
        Dimensions,
        Alert} from 'react-native';
import {createStackNavigator,
        SafeAreaView,
        StackActions,
        NavigationActions } from 'react-navigation';
import {Icon,
        List,
        ListItem } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import AppStatusBar from './AppStatusBar.js';
import CameraScanner from './Scanner.js';
import DocumentScanner from './DocumentScanner.js';
import ViewReceiptDetail from './ViewReceiptDetail.js';
import {getImages,deleteImage} from '../services/ImagesService.js';

const {width, height} = Dimensions.get('window');

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
         refreshing: false,   
         isLoading:false,
         images:[],   
       }
       this.resetTo = this.resetTo.bind(this);
       this.openActivityIndicator = this.openActivityIndicator.bind(this);
       this.closeActivityIndicator = this.closeActivityIndicator.bind(this);
       this.retriveImages = this.retriveImages.bind(this);
       this.viewImage = this.viewImage.bind(this);
       this.deleteImage = this.deleteImage.bind(this);
       this.confirmDelete = this.confirmDelete.bind(this);
       this.refreshListView = this.refreshListView.bind();
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
  componentDidMount() {
      this.props.navigation.setParams({ resetTo: this.resetTo });    
  }
  viewImage(image){
      this.openActivityIndicator();
      this.props.navigation.navigate('View',{
            image:image
      })
      this.closeActivityIndicator();
  }
  refreshListView(){
    this.setState({refreshing:true})
    this.retriveImages();    
    this.setState({refreshing:false}) //Stop Rendering Spinner
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
                  images[index].total = <View style={{flex:1, flexDirection:'row'}}>
                    <Text style={{fontSize:18,fontWeight:'bold',color:'#c6535b',textAlign:'left',paddingLeft:10,width:width/2}}>
                       {img.companyname}
                    </Text>
                    <Text style={{fontSize:18,right:0,left:5,fontWeight:'bold',color:'#c6535b',textAlign:'center',width:width/4,alignSelf: 'flex-end'}}>
                       ${img.totalamount}
                    </Text></View>
   
      })
      this.setState({images:images});
      this.closeActivityIndicator();
  }

  async deleteImage(id){
      this.openActivityIndicator(); 
      var Id = JSON.stringify({id:id});
      let deleteImg = await deleteImage(Id).then(function(response){
        return response;
      })
      let remainImages = this.state.images.filter(function(image) { return image.id != id });
      this.retriveImages();
      console.log("remainImages ",remainImages);
  }
  confirmDelete(id){
      Alert.alert(
        'DELETE',
        'Are you sure want to Delete ?',
        [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => {
                this.deleteImage(id);
                this.closeActivityIndicator();
            }},
        ],
        { cancelable: false }
      )      
  }        
  render() {
    return (
        <ScrollView style={styles.homeScreen}
            RefreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={()=>this.refreshListView()} />
            }>
            <ActivityIndicator 
                    style={styles.activityIndicator}
                    animating={this.state.isLoading}
                    size="large"
                    color="#c6535b" />
            <List containerStyle={{marginBottom: 10}}>
                {
                    this.state.images.map((l,index) => (
                        <Swipeout key={index} right={[{
                                                        text: 'DELETE',
                                                        autoClose:true,     
                                                        backgroundColor: '#c6535b',
                                                        onPress: () => { this.confirmDelete(l.id); }
                                                    }]} autoClose={true} backgroundColor= 'transparent'>            
                            <ListItem
                                roundAvatar
                                avatar={{uri:`data:image/jpeg;base64,${l.image}`}}
                                key={l.id}
                                title={l.total}
                                onPress={()=>this.viewImage(l.image)}
                            />
                        </Swipeout>
                    ))
                }
            </List>
            
           </ScrollView>
        
    );
  }
}

