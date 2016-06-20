'use strict';

import React from 'react';
import {
    View,
    TouchableNativeFeedback,
    Text,
    StyleSheet,
    Image,
} from 'react-native';
import _ from 'lodash';

import icons from '../../icons';

export default (props) => {
    // if (props.currentRoute.showNav == false) {
    //     return <View></View>
    // }

    return (
        <View style={styles.navigationContainer}>
            {_.map(props.routes, (route, id) => {
                return (
                    <TouchableNativeFeedback
                        key={route.title}
                        onPress={props.changeTab.bind(null, route, id, props.navigator)}
                        background={TouchableNativeFeedback.SelectableBackground()}
                        >
                        <View style={[styles.navigationItem, route.title == props.currentRoute.title && styles.navigationItemActive]}>
                            <Image 
                                source={{ uri: icons[route.icon] }}
                                style={{ width: 32, height: 32, }}
                            />
                            <Text>{route.title}</Text>
                        </View>
                    </TouchableNativeFeedback>
                );
            })}
        </View>
    );
};

const styles =  StyleSheet.create({
    navigationContainer: {
        backgroundColor: 'orange',
        height: 64,
        flexDirection: 'row',
    },

    navigationItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navigationItemActive: {
        backgroundColor: 'rgba(0, 0, 0, .2)',
    },
});
