'use strict';

import React, {Component} from 'react';
import {Platform,StyleSheet,Text,Alert,View,PixelRatio,TouchableOpacity,Image} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { RNCamera as Camera } from "react-native-camera";
import RNTesseractOcr from 'react-native-tesseract-ocr';
import ImagePicker from 'react-native-image-picker';
import AppStatusBar from './AppStatusBar.js';
import Images from '../modal/Images.js';
import Transactions from '../modal/Transactions.js';
import {saveImages,sendImage,imgToText} from '../services/ImagesService.js';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class Scanner extends Component {
    
 state = {
    avatarSource: null,
    videoSource: null,
    textFromImage:"No Text Right Now" 
  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        
        
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          
       
        var ocrData = new FormData();
          ocrData.append("base64Image",'data:image/jpeg;base64,' + response.data );
          ocrData.append("filetype"   , "JPG");
          ocrData.append("language"   , "eng");
          ocrData.append("apikey"  , "9cc43a763c88957");
          ocrData.append("scale", true);
          ocrData.append("isOverlayRequired", true);
          ocrData.append("detectOrientation",true);
          ocrData.append("isTable",true);
      
        /*let ocrData = {
            "base64Image":'data:image/jpeg;base64,' + response.data,
            "language":"eng",
            "filetype":"JPG",
            "apikey":"9cc43a763c88957",
            "scale":true,
            "isOverlayRequired":true,
            "detectOrientation":true,
            "isTable":true
        }*/  
        imgToText(ocrData).then(res => {
            var Data = JSON.parse(res._bodyText);
            this.setState({
                    textFromImage: Data.ParsedResults[0].ParsedText
                });
            console.log(Data.ParsedResults[0].ParsedText);
        })
         
        this.setState({
          avatarSource: source
        });
      }
    });
  }

  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      
      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
       
        this.setState({
          videoSource: response.uri
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
          { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
            <Image style={styles.avatar} source={this.state.avatarSource} />
          }
          </View>
        </TouchableOpacity>
        <Text style={{margin: 2, textAlign: 'justify'}}>{this.state.textFromImage}</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});

export default createStackNavigator({
  Scanner: {
    screen: Scanner
  },
}, {
  headerMode: 'none',
});

