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
  Alert,
  Modal,
  TouchableHighlight    
} from 'react-native';

import { createStackNavigator, SafeAreaView, createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation';
import { Icon,FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import Scanner from 'react-native-document-scanner';
import ScaledImage from 'react-native-scaled-image';
import DatePicker from 'react-native-datepicker';
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
      enableDatePicker:false,    
      isLoading:false,
      imgHeight:height - 150,
      user:null,
      amountModal:false,
      companyName:null,
      totalAmount:null,
      imageText:null,
      business_date: new Date()
    };
      this.resetTo = this.resetTo.bind(this);
      this.openActivityIndicator = this.openActivityIndicator.bind(this);
      this.closeActivityIndicator = this.closeActivityIndicator.bind(this);
      this.setAmountModalVisible = this.setAmountModalVisible.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.setDate = this.setDate.bind(this);
  }
  resetTo(route) {
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
            if(resBody.IsErroredOnProcessing){    
                 Alert.alert(resBody.ErrorDetails+" Retake Photo Again !!");
            }else{
                imgtext = resBody.ParsedResults[0].ParsedText;
            }
            return imgtext;
      })
      if(imageText === ""){
          Alert.alert('Error occured, please try again later!!');
      }else{
          this.closeActivityIndicator();
           this.setState({imageText:imageText});
           var strArray = imageText.split('\n');
           strArray.map((str)=>{
              if(str.toLowerCase().includes('total')
              || str.toLowerCase().includes('available balance')
              || str.toLowerCase().includes('transaction amount')
              || str.toLowerCase().includes('amount')
              || str.toLowerCase().includes('cash')){
                   console.log("Amount String",str);
                  // console.log("Out Side Amount ",str.match(/[+-]?\d+(?:\.\d+)?/g)[0]);
                   let amount = str.match(/[+-]?\d+(?:\.\d+)?/g);
                   if (amount != null) {
                       try{
                        console.log("Amount ",str.match(/[+-]?\d+(?:\.\d+)?/g)[0]);
                        this.setState({companyName:strArray[0]});
                        this.setState({totalAmount:str.match(/[+-]?\d+(?:\.\d+)?/g)[0]});        
                        this.setAmountModalVisible(!this.state.amountModal)
                       }catch(err){
                           console.log("Error ",err);
                       }
                   }else{
                      //Alert.alert("Oops! Amount not read from Photo, Please Retake Photo");
                   }
                  
              }   
           })
          
      }
  }
  
  onSubmit(){
      if(this.state.user.id){       
         var images = {};
         images.userId = this.state.user.id;
         images.image = this.state.image;
         images.imageText = this.state.imageText;
         images.pdf_url = null;
         images.business_date = this.state.business_date;           
         images.companyName = this.state.companyName.trim();
         images.totalAmount = this.state.totalAmount;
         console.log(images);      
         saveImages(JSON.stringify(images));
         this.setAmountModalVisible(!this.state.amountModal);
         this.timeoutCheck = setTimeout(() => {
            this.props.navigation.navigate('Home');
         }, 2000);  
         
      }else{
         Alert.alert('Session Timedout !!');
      } 
  }

  setAmountModalVisible(visible) {
    this.setState({amountModal: visible});
  }
  setDate(newDate) {
    this.setState({business_date: newDate})
      this.setState({enableDatePicker:false});
  }

  render() {
    return (
      <View style={styles.container}>  
        {this.state.image ? 
        
         <View style={{flex:1}}>
                <ScrollView style={styles.imageView}>    
                    <ScaledImage style={{width:width,height:this.state.imgHeight,resizeMode:'contain'}} source={{ uri:`data:image/jpeg;base64,${this.state.image}`}} />
                    <ActivityIndicator 
                    style={styles.activityIndicator}
                    animating={this.state.isLoading}
                    size="large"
                    color="#c6535b" />
                </ScrollView>
                <View style={styles.reTakeBtn}>
                    <TouchableOpacity style={styles.newPic} onPress={() => this.setState({ image: "",isLoading:false })}>
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
                    brightness={0}
                    saturation={0}
                    quality={0.9}
                    contrast={1.3}
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
        <Modal
          animationType="slide"
          transparent={false}
          presentationStyle="pageSheet"
          visible={this.state.amountModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.outerreceiptbox}>
             <View style={styles.receiptbox}>
                <FormLabel labelStyle={{color: '#c6535b',fontSize:16}}>Company Name</FormLabel>
                <FormInput
                    inputStyle={{color: '#c6535b'}}
                    placeholder='Company Name'
                    value={this.state.companyName}
                    onChangeText={(companyname) => this.setState({companyName:companyname})}/>
            
                <FormLabel labelStyle={{color: '#c6535b',fontSize:16}}>Total Amount</FormLabel>
                <FormInput
                    inputStyle={{color: '#c6535b'}}
                    placeholder="Amount"
                    value={this.state.totalAmount}
                    onChangeText={(total) => this.setState({totalAmount:total})}/>
                
                <FormLabel labelStyle={{color: '#c6535b',fontSize:16}}>Business Date</FormLabel>
                <DatePicker
                    style={{width: 200}}
                    date={this.state.business_date}
                    mode="date"
                    placeholder="select date"
                    format="MM-DD-YYYY"
                    minDate="01-01-1990"
                    maxDate={ new Date()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => {this.setState({business_date: date})}}
                />
                
                <View style={{marginTop:22,flex:1,flexDirection: 'row',}}>
                    <Button buttonStyle={{width:150,height:50,elevation:1}} fontWeight='bold' backgroundColor='#c6535b' onPress={() => this.setAmountModalVisible(!this.state.amountModal)} title="Close" />
                    <Button buttonStyle={{width:150,height:50,elevation:1}} fontWeight='bold' backgroundColor='#c6535b' onPress={() => this.onSubmit()} title="Submit" />
                </View>
             </View>
         </View>
        </Modal>
      </View>     
    )
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
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
  },
  outerreceiptbox:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    paddingLeft:15,
    paddingRight:15
  },
  receiptbox:{
    marginLeft:15,
    marginRight:15,  
    height: 250,
    width:width,
    backgroundColor:'#F5F5F5', 
  }
});