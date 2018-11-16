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
      }else{
          this.validationMessage.email= '';
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
          resetTo('Login')
      }else{
          authorize.rows[0].isLoggedin='true';
          var setUser = await AsyncStorage.setItem('user', JSON.stringify(authorize.rows[0]));
          this.resetTo('Home');
      }
  } 
    
  render() {
    return (   
            <View style={styles.container}>
                <FormLabel labelStyle={{color: '#fff'}}>Email</FormLabel>
                <FormInput
                    inputStyle={{color: '#fff'}}
                    placeholder='Email Address'
                    onChangeText={(email) => {
                        this.setState({email:email});
                        this.validateInputs(email,"email")
                }}/>
                { this.state.email ?
                <FormValidationMessage labelStyle={{color: '#fff'}}>{this.validationMessage.email}</FormValidationMessage> : null }
            
                <FormLabel labelStyle={{color: '#fff'}}>Password</FormLabel>
                <FormInput 
                    inputStyle={{color: '#fff'}}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(password) => {
                        this.setState({password:password});
                        this.validateInputs(password,"password")
                }}/>
                { this.state.password ?
                <FormValidationMessage labelStyle={{color: '#fff'}}>{this.validationMessage.password}</FormValidationMessage> : null }
        
                <View style={styles.buttonView}> 
                    <Button style={{width:150}} onPress={this.onSubmit} title="Log In" />
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
    color:'#FFFFFF',  
    paddingTop:200  
  },
  buttonView:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center'
  }
});