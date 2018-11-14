'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Dimensions, Alert} from 'react-native';

const token = 'Basic a3Jpc3RpOmt1c2hhbDIyMDk=';
const domain = "http://10.113.175.220:9800/api/receipt"
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


