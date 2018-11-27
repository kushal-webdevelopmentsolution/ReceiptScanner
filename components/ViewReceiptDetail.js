import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  View,       
  Dimensions
} from 'react-native';

import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Scanner from 'react-native-document-scanner';
const {width, height} = Dimensions.get('window');
export default class ViewReceiptDetail extends Component {
  constructor(props) {
    super(props);
    this.state={
        lines:this.props.navigation.state.params.details.split('\n')
    }  
  }

  static navigationOptions = ({navigation, styles}) => ({
        title: 'View',
        headerStyle: {
            backgroundColor: '#c6535b',
        },
        headerLayoutPreset: 'center',
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:20,
        },
        headerBackTitle:'Back',
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
                                                    
            <Icon name='md-arrow-round-back' 
                  type='ionicon'
                  containerStyle={{paddingLeft:20}} 
                  iconStyle={{fontSize:28,color:'#F5F5F5'}} 
                  onPress={() => navigation.goBack()}
            />
        ),
      })    
      
  
  render() {
    return (
            <ScrollView contentContainerStyle={styles.container}>
                {this.state.lines.map(function(line,index){
                   return (<Text key={index} style={styles.receiptContent}>{line}</Text>)
                })}
            </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor:'#F5F5F5',
  },    
  container: {
  },
  receiptContent:{
    paddingLeft:40,
    paddingRight:40,  
    fontWeight: 'bold',
    fontSize: 18,   
  }    
});