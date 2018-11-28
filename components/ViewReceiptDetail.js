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
import ScaledImage from 'react-native-scaled-image';
const {width, height} = Dimensions.get('window');
const imgScrollViewHeight = height - 150;
export default class ViewReceiptDetail extends Component {
  constructor(props) {
    super(props);
    this.state={
        image:this.props.navigation.state.params.image,
        imgHeight:imgScrollViewHeight
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
            <ScrollView style={styles.imageView}>    
                    <ScaledImage style={{width:width,height:this.state.imgHeight,resizeMode:'contain'}} source={{ uri:`data:image/jpeg;base64,${this.state.image}`}} />
            </ScrollView>
    );
  }
}

const styles = StyleSheet.create({   
  container: {
  },
  imageView:{
    paddingTop:5,
  },
  receiptContent:{
    paddingLeft:40,
    paddingRight:40,  
    fontWeight: 'bold',
    fontSize: 18,   
  }    
});