'use strict';

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
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
            code,
        };

        const route = Object.assign({}, routes['orchids-detail'], { props });
        const currentRoutes = this.props.navigator.getCurrentRoutes();

        if (_.find(currentRoutes, { id: route.id })) {
            this.props.navigator.jumpTo(_.find(currentRoutes, { id: route.id }));
        } else {
            this.props.navigator.push(route);
        }
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
