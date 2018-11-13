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
  Alert
} from 'react-native';

import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon,FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import Scanner from 'react-native-document-scanner';

export default class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state={
        fname:null,
        lname:null,
        email:null,
        password:null,
        confirm:null
    }
    this.onSubmit = this.onSubmit.bind(this); 
    this.validateInputs = this.validateInputs.bind(this);
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
    
  onSubmit(input){
      console.log("Input ", input);
  }    
  render() {
    return (
        <SafeAreaView style={styles.pageView} forceInset={{bottom:'never' }}>        
            <View style={styles.container}>
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
        
                <View style={styles.buttonView}> 
                    <Button style={{width:150}} onPress={this.onSubmit(this.state)} title="Sign Me" />
                </View>  
            </View>
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
    paddingTop:200  
  },
  buttonView:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center'
  }
});