'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Dimensions, Alert} from 'react-native';

const token = 'Basic a3Jpc3RpOmt1c2hhbDIyMDk=';
const domain = "http://ec2-18-188-134-14.us-east-2.compute.amazonaws.com/common/receipt"
export const signup = (user) => {
    const URL = `${domain}/createuser`;
    return fetch(URL, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: user,
            })
            .then((responseJson) => {
                
                return responseJson;
            })
            .catch((error) => {
                Alert.alert(`Error: ${JSON.stringify(error)}`);
            });
}

export const auth = (credential) => {
    const URL = `${domain}/auth`;
    return fetch(URL, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: credential,
            })
            .then((responseJson) => {
                
                return responseJson;
            })
            .catch((error) => {
                Alert.alert(`Error: ${JSON.stringify(error)}`);
            });
}


