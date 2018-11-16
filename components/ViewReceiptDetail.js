import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { createStackNavigator, SafeAreaView, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Scanner from 'react-native-document-scanner';

export default class ViewReceiptDetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const details = this.props.navigation.state.params.details;
    console.log("Details ", this.props.navigation.state.params.details);
    return (
            <ScrollView style={styles.container}>
                <Text>{details.toString()}</Text>
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
    flex: 1,
  }
});