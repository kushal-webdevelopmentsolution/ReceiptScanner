import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View
} from 'react-native';

import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Scanner from 'react-native-document-scanner';
import {saveImages,sendImage,imgToText} from '../services/ImagesService.js';
import ViewReceiptDetail from './ViewReceiptDetail.js';
import AppStatusBar from './AppStatusBar.js';

export default class DocumentScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      flashEnabled: false,
      useFrontCam: false,
    };
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
  
  getTextFromImage(){
      var ocrData = new FormData();
          ocrData.append("base64Image",'data:image/jpeg;base64,' + this.state.image );
          ocrData.append("filetype"   , "JPG");
          ocrData.append("language"   , "eng");
          ocrData.append("apikey"  , "9cc43a763c88957");
          ocrData.append("scale", true);
          ocrData.append("isOverlayRequired", true);
          ocrData.append("detectOrientation",true);
          ocrData.append("isTable",true);
      
      imgToText(ocrData).then(res => {
            var Data = JSON.parse(res._bodyText);
            this.props.navigation.navigate('View',{
                details:Data.ParsedResults[0].ParsedText
            });
        })
  }    

  render() {
    return (
    <SafeAreaView style={styles.pageView} forceInset={{bottom:'never' }}>    
      <View style={styles.container}>
        
        {this.state.image ?
          <Image style={{ flex: 1, width: 300, height: 200 }} source={{ uri: `data:image/jpeg;base64,${this.state.image}`}} resizeMode="contain" /> :
          <Scanner
            useBase64
             onPictureTaken={data => this.setState({ image: data.croppedImage })}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={this.state.flashEnabled}
            useFrontCam={this.state.useFrontCam}
            brightness={0.2}
            saturation={0}
            quality={0.5}
            contrast={1.2}
            onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter, lastDetectionType })}
            detectionCountBeforeCapture={10}
            detectionRefreshRateInMS={50}
            style={styles.scanner}
          />
        }
        <Text style={styles.instructions}>
          ({this.state.stableCounter || 0} correctly formated rectangle detected
        </Text>
        <Text style={styles.instructions}>
          {this.renderDetectionType()}
        </Text>
        {this.state.image === null ?
          null :
          <TouchableOpacity style={styles.newPic} onPress={() => this.setState({ image: "" })}>
            <Text>Take another picture</Text>
          </TouchableOpacity>
          
        }
        {this.state.image === null ?
          null :
          <TouchableOpacity style={styles.newPic} onPress={() => this.getTextFromImage()}>
            <Text>Extract Text From Photo</Text>
          </TouchableOpacity>
        }
        <TouchableOpacity style={[styles.button, styles.left]} onPress={() => this.setState({ flashEnabled: !this.state.flashEnabled })}>
          <Text>📸 Flash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.right]} onPress={() => this.setState({ useFrontCam: !this.state.useFrontCam })}>
          <Text>📸 Front Cam</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  newPic: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    top: 20,
    bottom: 20,
    height: 40,
    width: 120,
    backgroundColor: '#FFF',
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
    width: 400,
    height: 200,
    borderColor: 'orange',
    borderWidth: 1
  }
});