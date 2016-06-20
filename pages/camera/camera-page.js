'use strict';

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BarcodeScanner from 'react-native-barcode-scanner-universal';
import _ from 'lodash';

import routes from '../../routes';

export default class CameraPage extends React.Component {
    render = () => {
        return (
            <View style={styles.cameraContainer}>
                <BarcodeScanner onBarCodeRead={this.readQRCode} style={styles.camera}></BarcodeScanner>
            </View>
        );
    }

    componentWillReceiveProps = (props) => {
        if (props.route.id !== 'camera') {
            this.setState({ active: false });
        } else {
            this.setState({ active: true });
        }
    }

    readQRCode = (code) => {
        const props = {
            code: code.data,
            back: 'camera',
        };

        Actions.details(props);
    }
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        alignSelf: 'stretch',
    },

    camera: {
        flex: 1,
    },
});
