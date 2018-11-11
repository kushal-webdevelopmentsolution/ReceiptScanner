import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import BottomToolbar from 'react-native-bottom-toolbar';

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
export default class BottomToolBar extends Component {

  render() {
    return (
      <View style={styles.container}>
        <BottomToolbar color='grey'>
            <BottomToolbar.Action
              title="Edit"
              onPress={(index, propsOfThisAction) =>
              console.warn(index + ' ' + JSON.stringify(propsOfThisAction))}
            />
            <BottomToolbar.Action
              title="Copy ULR"
              onPress={(index, propsOfThisAction) =>
              console.warn(index + ' ' + JSON.stringify(propsOfThisAction))}
            />
            <BottomToolbar.Action
              title="Delete"
              onPress={(index, propsOfThisAction) =>
              console.warn(index + ' ' + JSON.stringify(propsOfThisAction))}
            />
        </BottomToolbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'orange',
  },
});
