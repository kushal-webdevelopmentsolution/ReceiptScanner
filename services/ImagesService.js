'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Dimensions, Alert} from 'react-native';

const token = 'Basic a3Jpc3RpOmt1c2hhbDIyMDk=';
const domain = "http://ec2-18-188-134-14.us-east-2.compute.amazonaws.com/api/receipt"
const headers = {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0,
                    'Authorization': token
                };
export const saveImages = (images) => {
    const URL = `${domain}/createimages`;
    return fetch(URL, {
                method: 'POST',
                headers: headers,
                body: images,
            })
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                Alert.alert(`Error: ${JSON.stringify(error)}`);
            });
}

export const deleteImage = (imageId) => {
    const URL = `${domain}/deleteimage`;
    return fetch(URL, {
                method: 'POST',
                headers: headers,
                body: imageId,
            })
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
                headers: headers,
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
                headers: headers,
                body: images,
            })
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




