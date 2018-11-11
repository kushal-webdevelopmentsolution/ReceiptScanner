import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Dimensions} from 'react-native';
import { Icon } from 'react-native-elements';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

export default class AppStatusBar extends Component {

  constructor(props){
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#000000" />
        <View style={styles.header}>
            <Icon name='menu' containerStyle={styles.menuIcon}/>
            <Text style={styles.welcome}>Home!</Text>
            <Icon name='plus' type='font-awesome' containerStyle={styles.plusIcon}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:.7,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop:30,
    backgroundColor:'#E9E9E9',
  },
  header: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
  },
  welcome: {
    flex:3.6,
    fontSize: 20,
    textAlign: 'center',
  },
   menuIcon: {
    flex:.7,
  },
   plusIcon: {
    flex:.7,
  },

});
