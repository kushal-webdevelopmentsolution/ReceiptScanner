import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  View,    
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  AsyncStorage
} from 'react-native';

import { createStackNavigator, SafeAreaView, createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation';
import { Icon,FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import {signup,auth} from '../services/UsersService.js';
var {height, width} = Dimensions.get('window');
export default class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state={
        email:null,
        password:null,
        isLoading:false
    }
    this.onSubmit = this.onSubmit.bind(this); 
    this.validateInputs = this.validateInputs.bind(this);
    this.openActivityIndicator = this.openActivityIndicator.bind(this);
    this.closeActivityIndicator = this.closeActivityIndicator.bind(this);
    this.emailExists = this.emailExists.bind(this);
    this.resetTo = this.resetTo.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);  
    this.validationMessage = {
                            email:'',
                            password:''
                          };
   
  }
  componentDidMount() {
      this.authenticateUser();
  }
  async authenticateUser(){
      var details =  await AsyncStorage.getItem('user').then(function(user){
             if(user !== null){
                return JSON.parse(user)
             }else{
                 return false;
             }
         })
         if(!details){
             
         }else{
            if(details.isLoggedin === 'true'){
               this.resetTo('Home');
            }
         }
  }    
  validateInputs(input,field){
      let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      
      if(!input && field==='email'){
          this.validationMessage.email= 'Enter Email address';
      }else if (input && field==='email' && !emailCheck.test(input)){
          this.validationMessage.email= 'Email address is not valid';
      }
      if(!input && field==='password'){
          this.validationMessage.password= 'Enter Password';
      }  
  }
  emailExists(){
      this.validationMessage.email = this.state.email + ' not Exists';
  }  
  openActivityIndicator(){
     this.setState({isLoading:true});
  }
  closeActivityIndicator(){
      this.setState({isLoading:false});
  }
  resetTo(route) {
        const navigateAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: route })],
        });
    this.props.navigation.dispatch(navigateAction);
  }       
  async onSubmit(){
      
      if(!this.state.isLoading){
        this.openActivityIndicator();
      }
      let user={
          email:this.state.email,
          password:this.state.password
      }
      console.log("user ", user);
      var authorize = await auth(JSON.stringify(user)).then(function(res){
                            let response = JSON.parse(res._bodyText);
                            return response;
                         })
      console.log("authorize ", authorize);
      if(authorize.rowCount === 0){
            this.emailExists();
            setTimeout(()=>{this.closeActivityIndicator()},3000);
            this.resetTo('Login')
      }else{
          authorize.rows[0].isLoggedin='true';
          var setUser = await AsyncStorage.setItem('user', JSON.stringify(authorize.rows[0]));
          AsyncStorage.getItem('user').then((user) => {
            console.log("User ",user);
          });
          console.log("setUser ", authorize.rows[0]);
          this.resetTo('Home');
      }
  } 
    
  render() {
    return ( 
                
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Image style={{width: 80, height: 80}} source={require('./img/receipt.png')} />
                    <Text h1 style={styles.headerText}>Receipt Scanner</Text>
                </View>
                <View style={styles.loginbox}>
                <FormLabel labelStyle={{color: '#c6535b',fontSize:16}}>Email</FormLabel>
                <FormInput
                    inputStyle={{color: '#c6535b'}}
                    placeholder='Email Address'
                    onChangeText={(email) => {
                        this.setState({email:email});
                        this.validateInputs(email,"email")
                }}/>
                { this.state.email ?
                <FormValidationMessage labelStyle={{color: '#c6535b'}}>{this.validationMessage.email}</FormValidationMessage> : null }
            
                <FormLabel labelStyle={{color: '#c6535b',fontSize:16}}>Password</FormLabel>
                <FormInput 
                    inputStyle={{color: '#c6535b'}}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(password) => {
                        this.setState({password:password});
                        this.validateInputs(password,"password")
                }}/>
                { this.state.password ?
                <FormValidationMessage labelStyle={{color: '#c6535b'}}>{this.validationMessage.password}</FormValidationMessage> : null }
        
                <View style={styles.buttonView}> 
                    <Button buttonStyle={{width:150,elevation:1}} fontWeight='bold' backgroundColor='#c6535b' onPress={this.onSubmit} title="Log In" />
                </View>
                <TouchableOpacity style={styles.registerLink} onPress={() => this.props.navigation.navigate('Signup')}>
                <Text style={{color: '#c6535b',fontSize:16,fontWeight:'700',textDecorationStyle:'solid',textDecorationLine:'underline'}}>Are you Registered ?</Text>
                </TouchableOpacity>

               </View>
            </View>
    );
  }
}

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor:'#c6535b',
  },    
  container: {
    flex: 1,
    backgroundColor: '#c6535b',
  },
  buttonView:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#c6535b'
  },
  loginbox:{
    marginLeft:15,
    marginRight:15,  
    height: 300,
    backgroundColor:'#F5F5F5',
  },
  headerText:{
      fontSize:36,
      fontWeight:'bold',
      justifyContent: 'center',
      alignItems: 'center',
      color:'#F5F5F5',
      elevation:1,
      paddingTop:10
  },
  headerView:{
      paddingTop:25,
      justifyContent: 'center',
      alignItems: 'center',
      top:0,
      bottom:0,
      height:220
  },
  registerLink:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
  }
    
});