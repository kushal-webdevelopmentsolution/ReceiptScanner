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
import Scanner from 'react-native-document-scanner';
import {signup} from '../services/UsersService.js';
var {height, width} = Dimensions.get('window');
export default class Signup extends Component {
  
  constructor(props) {
    super(props);
    this.state={
        fname:null,
        lname:null,
        email:null,
        password:null,
        confirm:null,
        isLoading:false
    }
    this.onSubmit = this.onSubmit.bind(this); 
    this.validateInputs = this.validateInputs.bind(this);
    this.openActivityIndicator = this.openActivityIndicator.bind(this);
    this.closeActivityIndicator = this.closeActivityIndicator.bind(this);
    this.emailExists = this.emailExists.bind(this);
    this.resetTo = this.resetTo.bind(this);  
    this.validationMessage = {
                            fname:'',
                            lname:'',
                            email:'',
                            password:'',
                            confirm:''
                          };
  }
    
  validateInputs(input,field){
      let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      if(input && field==='fname'){
          this.validationMessage.fname='Enter First Name';
      }
      if(!input && field==='lname'){
          this.validationMessage.lname= 'Enter Last Name';
      }
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
      if(!input && field==='confirm'){
          this.validationMessage.confirm= 'Enter Confirm Password';
      }else if(input && field==='confirm' && (input !== this.state.password)){
          this.validationMessage.confirm= 'Confirm Password not match';
      }else{
          this.validationMessage.confirm= '';
      }
      
  }
  emailExists(){
      this.validationMessage.email = this.state.email + ' already Exists';
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
      console.log('isLoading ',this.state.isLoading);
      if(!this.state.isLoading){
        this.openActivityIndicator();
      }
      let user={
          fname:this.state.fname,
          lname:this.state.lname,
          email:this.state.email,
          password:this.state.password
      }
      
      var registerUser = await signup(JSON.stringify(user))
                        .then(function(res){
                            let response = JSON.parse(res._bodyText);
                            return response;
                         })
      if(registerUser.constraint === "users_pkey"){
            this.emailExists();
            setTimeout(()=>{this.closeActivityIndicator()},3000);
      }else{
          user.isLoggedin='true';
          var setUser = await AsyncStorage.setItem('user', JSON.stringify(user));
          this.resetTo('Home');
      }
  }    
  render() {
    return (
        <SafeAreaView style={styles.pageView} forceInset={{bottom:'never' }}>
            <ScrollView style={styles.container}>
                <ActivityIndicator 
                    style={styles.activityIndicator}
                    animating={this.state.isLoading}
                    size="large"
                    color="#c6535b" />
                <FormLabel>First Name</FormLabel>
                <FormInput
                    placeholder='Frist Name'
                    onChangeText={(fname) => {
                            fname = fname.replace(/[0-9]/g, '');
                            this.setState({fname:fname.replace(/[0-9]/g, '')});
                            this.validateInputs(fname,"fname")
                    }} />
                {  (!this.state.fname || this.state.fname === '') ?
                <FormValidationMessage>{this.validationMessage.fname}</FormValidationMessage> : null }
                <FormLabel>Last Name</FormLabel>
                <FormInput 
                    placeholder='Last Name'
                    onChangeText={(lname) => {
                        this.setState({lname:lname});
                        this.validateInputs(lname,"lname")
                }}/>
                { (!this.state.lname || this.state.lname === '') ?
                <FormValidationMessage>{this.validationMessage.lname}</FormValidationMessage> : null }
                <FormLabel>Email</FormLabel>
                <FormInput 
                    placeholder='Email Address'
                    onChangeText={(email) => {
                        this.setState({email:email});
                        this.validateInputs(email,"email")
                }}/>
                { this.state.email ?
                <FormValidationMessage>{this.validationMessage.email}</FormValidationMessage> : null }
                
                <FormLabel>Password</FormLabel>
                <FormInput 
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(password) => {
                        this.setState({password:password});
                        this.validateInputs(password,"password")
                }}/>
                { this.state.password ?
                <FormValidationMessage>{this.validationMessage.password}</FormValidationMessage> : null }
            
                <FormLabel>Confirm Password</FormLabel>
                <FormInput 
                    secureTextEntry={true}
                    placeholder="Confirm Password"
                    onChangeText={(confirm) => {
                        this.setState({confirm:confirm});
                        this.validateInputs(confirm,"confirm")
                }}/>
                { this.state.confirm ?
                <FormValidationMessage>{this.validationMessage.confirm}</FormValidationMessage> : null }
            <View style={styles.buttonView}> 
                <Button style={{width:150}} onPress={this.onSubmit} title="Sign Me" />
            </View>
                
            </ScrollView>
        </SafeAreaView>
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
    backgroundColor: '#FFF',
  },
  buttonView:{
      flex:1,
      marginTop:30,
      justifyContent: 'center',
      alignItems: 'center'
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