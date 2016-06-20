'use strict';

import React  from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Navigator
} from 'react-native';
import _ from 'lodash';

import routes from './routes';
import TabNavigation from './components/navigation/tab-navigation';

class OrkisApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            route: routes.camera,
        };
    }

    render = () => {
        return (
            <Navigator
                initialRoute={routes.camera}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
                navigationBar={this.navigationBar()}
                onWillFocus={this.onWillFocus}
                />
        );
    }

    configureScene = () => {
        return {
            ...Navigator.SceneConfigs.FadeAndroid,
            gestures: {},
        };
    }

    renderScene = (route, navigator) => {
        const Component = route.component;

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Component route={route} navigator={navigator} {...route.props}/>
                </View>
            </View>
        );
    }

    navigationBar = () => {
        const routesToShow = _.filter(routes, 'onMenu');

        if (this.state.route.showNav == false) {
            return null;
        }

        return <TabNavigation changeTab={this.changeTab} currentRoute={this.state.route} routes={routesToShow}/>;
    }

    changeTab = (route, id, navigator) => {
        if (route.id == this.state.route.id) {
            return;
        }

        const currentRoutes = navigator.getCurrentRoutes();

        if (_.find(currentRoutes, { id: route.id })) {
            navigator.jumpTo(route);
        } else {
            navigator.push(route);
        }
    }

    onWillFocus = (route) => {
        this.setState({ route });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e6e6e6',
        flex: 1,
    },

    content: {
        flex: 1,
    },
});

AppRegistry.registerComponent('orkisapp', () => OrkisApp);
