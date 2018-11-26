'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Dimensions, Alert} from 'react-native';

const token = 'Basic a3Jpc3RpOmt1c2hhbDIyMDk=';
const domain = "http://10.113.175.220:9800/api/receipt"
export const saveImages = (images) => {
    const URL = `${domain}/createimages`;
    return fetch(URL, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: images,
            })//.then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                Alert.alert(`Error: ${JSON.stringify(error)}`);
            });
}

export const getImages = (user) => {
    const URL = `${domain}/getimages`;
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
                console.log("responseJson ",responseJson);
                return responseJson;
            })
            .catch((error) => {
                Alert.alert(`Error: ${JSON.stringify(error)}`);
            });
}

export const sendImage = (images) => {
    const URL = `${domain}/detectTextFromImage`;
    return fetch(URL, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: images,
            })//.then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
            });
}

export const imgToText = (images) => {
    const URL = `https://api.ocr.space/parse/image`;
    return fetch(URL, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'multipart/form-data',
                },
                body: images,
            })
            .then((responseJson) => {
                //Alert.alert(responseJson._bodyText);
                console.log(JSON.parse(responseJson._bodyText));
                return responseJson;
            })
            .catch((error) => {
                Alert.alert("Error "+error);
                console.log(error);
            });
}




