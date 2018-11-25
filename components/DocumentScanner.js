import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,    
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  Alert    
} from 'react-native';

import { createStackNavigator, SafeAreaView, createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Scanner from 'react-native-document-scanner';
import ScaledImage from 'react-native-scaled-image';
import RNImageToPdf from 'react-native-image-to-pdf';
import {saveImages,sendImage,imgToText} from '../services/ImagesService.js';
import ViewReceiptDetail from './ViewReceiptDetail.js';
import AppStatusBar from './AppStatusBar.js';

const {width, height} = Dimensions.get('window');
const imgScrollViewHeight = height - 200; 
export default class DocumentScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      flashEnabled: false,
      useFrontCam: false,
      isLoading:false,
      imgHeight:height - 150,
      user:null,    
    };
      this.resetTo = this.resetTo.bind(this);
       this.openActivityIndicator = this.openActivityIndicator.bind(this);
       this.closeActivityIndicator = this.closeActivityIndicator.bind(this);
   }
   resetTo(route) {
    console.log('Route ', route);   
    const navigateAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
    });
    this.props.navigation.dispatch(navigateAction);
  }  
  static navigationOptions = ({navigation, styles}) => ({
        title: 'Scanner',
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
            <Icon name='home' 
                  type='font-awesome'
                  containerStyle={{paddingRight:20}} 
                  iconStyle={{fontSize:28,color:'#F5F5F5'}} 
                  onPress={() =>{
                                 navigation.state.params.resetTo('Home');
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
  async componentWillMount() {   
      this.openActivityIndicator();
      const navigation = this.props.naviation;
      const loggedInUser = await AsyncStorage.getItem('user').then(function(user){
             return JSON.parse(user);
      })
      this.setState({user:loggedInUser});
  }
  componentDidMount() {
      this.closeActivityIndicator();
      this.props.navigation.setParams({ resetTo: this.resetTo });
  }
  renderDetectionType() {
    switch (this.state.lastDetectionType) {
      case 0:
        return "Correct rectangle found"
      case 1:
        return "Bad angle found";
      case 2:
        return "Rectangle too far";
      default:
        return "No rectangle detected yet";
    }
  }
  
  async getTextFromImage(){
    this.openActivityIndicator();
      var ocrData = new FormData();    
          ocrData.append("base64Image",'data:image/jpeg;base64,' + this.state.image );
          ocrData.append("filetype"   , "JPG");
          ocrData.append("language"   , "eng");
          ocrData.append("apikey"  , "9cc43a763c88957");
          ocrData.append("scale", true);
          ocrData.append("isOverlayRequired", true);
          ocrData.append("detectOrientation",true);
          ocrData.append("isTable",true);
      
      var imageText = await imgToText(ocrData).then(res => {
            var resBody = JSON.parse(res._bodyText);
            var imgtext = "";
            console.log("resBody ",resBody);
            if(resBody.ParsedResults[0].ErrorMessage === ""){
              imgtext = resBody.ParsedResults[0].ParsedText;
            }else{
              imgtext = "";   
            }
            return imgtext;
      })
      console.log("ImageText ",imageText);
      if(imageText === ""){
          Alert.alert('Error occured, please try again later!!');
      }else{
          this.closeActivityIndicator();
           if(this.state.user.id){       
                var images = {};
                images.userId = this.state.user.id;
                images.image = this.state.image;
                images.imageText = imageText;
                images.pdf_url = null; 
                console.log("Images ",images);
                saveImages(JSON.stringify(images));
              /*this.props.navigation.navigate('View',{
                    details:imageText
                });*/
             }else{
                 Alert.alert('Session Timedout !!');
             } 
      }
  }    

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
                    style={styles.activityIndicator}
                    animating={this.state.isLoading}
                    size="large"
                    color="#c6535b" />  
        {this.state.image ? 
        
         <View style={{flex:1}}>
                <ScrollView style={styles.imageView}>    
                    <ScaledImage style={{width:width,height:this.state.imgHeight,resizeMode:'contain'}} source={{ uri:`data:image/jpeg;base64,${this.state.image}`}} />
                </ScrollView>
                <View style={styles.reTakeBtn}>
                    <TouchableOpacity style={styles.newPic} onPress={() => this.setState({ image: "" })}>
                        <Text style={styles.buttonText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.extractText} onPress={() => this.getTextFromImage()}>
                        <Text style={styles.buttonText}>Extract Text</Text>
                    </TouchableOpacity>
                </View>
          </View>:

          <View style={{flex:1}}>
                <Scanner
                    useBase64
                    onPictureTaken={data => this.setState({ image: data.croppedImage })}
                    overlayColor="rgba(255,130,0, 0.7)"
                    enableTorch={this.state.flashEnabled}
                    useFrontCam={this.state.useFrontCam}
                    brightness={0.4}
                    saturation={0}
                    quality={0.9}
                    contrast={1.2}
                    onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter, lastDetectionType })}
                    detectionCountBeforeCapture={10}
                    detectionRefreshRateInMS={50}
                    style={styles.scanner}
                />
                <View style={{height:55}}>    
                    <Text style={styles.instructions}>
                        ({this.state.stableCounter || 0} correctly formated rectangle detected
                    </Text>
                    <Text style={styles.instructions}>
                        {this.renderDetectionType()}
                    </Text>
                </View>
                <TouchableOpacity style={[styles.button, styles.left]} onPress={() => this.setState({ flashEnabled: !this.state.flashEnabled })}>
                    {this.state.flashEnabled ?
                        <Image style={{}} source={require('./img/flashOn.png')} />
                        : <Image style={{}} source={require('./img/flashOff.png')} />}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.right]} onPress={() => this.setState({ useFrontCam:     !this.state.useFrontCam })}>
                    <Image style={{}} source={require('./img/cameraFlipIcon.png')} />
                </TouchableOpacity>
          </View>  
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
   pageView: {
    flex: 1,
    backgroundColor:'#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  newPic: {
    flex:1,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#c6535b'
  },
  extractText: {
    flex:1,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#c6535b',
    borderLeftWidth:2,
    borderLeftColor:'#F5F5F5'  
  },
  buttonText:{
    fontSize:24,
    color:'#F5F5F5'
  },
  button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top:10,
    height: 40,
    width: 50,
  },
  left: {
    left: 20,
  },
  right: {
    right: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  scanner: {
    flex: 1,
    width: width,
    height: height,
    borderColor: 'orange',
    borderWidth: 1
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
   imageView:{   
   },
   reTakeBtn:{
       flex: 2,
       flexDirection: 'row',
       height:70,
       position:'absolute',
       left: 0,
       right: 0,
       bottom: 0
   }    
});