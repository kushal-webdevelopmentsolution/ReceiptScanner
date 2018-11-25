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