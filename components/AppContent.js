import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

export default class AppContent extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text> {instructions} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height:deviceHeight/2,
    borderWidth:4,
    borderColor:'red',
  },
});
