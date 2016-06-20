'use strict';

import React from 'react';
import { View, Text, AppRegistry } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import CameraPage from './pages/camera/camera-page';
import SavedPage from './pages/saved/saved-page';
import OrchidsDetailPage from './pages/orchids/orchids-detail-page';

import NavBar from './components/navigation/tab-navigation';

class OrkisApp extends React.Component {
    render = () => {
        return (
            <Router>
                <Scene key="root" navBar={NavBar}>
                    <Scene key="camera" component={CameraPage} title="Ler QR Code" initial={true} hideNavBar={false} direction="horizontal"/>
                    <Scene key="saved" component={SavedPage} title="Orquídeas Salvas" hideNavBar={false} direction="horizontal"/>
                    <Scene key="details" component={OrchidsDetailPage} title="Orquídea" hideNavBar={true} direction="vertical" type="reset"/>
                </Scene>
            </Router>
        );
    }
}

AppRegistry.registerComponent('orkisapp', () => OrkisApp);
