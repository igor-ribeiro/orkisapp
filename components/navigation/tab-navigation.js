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
import { Actions } from 'react-native-router-flux';

import icons from '../../icons';
import routes from '../../routes';

export default (props) => {
    return (
        <View style={styles.navigationContainer}>
            {_.map(routes, (route, id) => {
                return (
                    <TouchableNativeFeedback
                        key={route.title}
                        background={TouchableNativeFeedback.SelectableBackground()}
                        onPress={Actions[route.id]}
                        >
                        <View style={[styles.navigationItem, route.id == props.sceneKey && styles.navigationItemActive]}>
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
