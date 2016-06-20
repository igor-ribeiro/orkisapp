'use strict';

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    ProgressBarAndroid
} from 'react-native';
import File from 'react-native-fs';
import _ from 'lodash';

import routes from '../../routes';

export default class SavedPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            orchids: [],
        };
    }

    render = () => {
        return (
            <View style={styles.container}>
                <View style={styles.toolbarContainer}>
                    <View style={styles.toolbarTitle}>
                        <Text style={styles.toolbarTitleText}>Orquídeas Salvas</Text>
                    </View>
                </View>

                {this.renderLoader()}

                <View style={styles.content}>
                    {this.renderSavedOrchids()}
                </View>
            </View>
        );
    }

    componentDidMount = () => {
        this.getFiles();
    }

    componentWillReceiveProps = (props) => {
        this.getFiles();
    }

    getFiles = () => {
        let orchids = [];

        this.setState({ isLoading: true });

        File
            .readDir(File.DocumentDirectoryPath)
            .then((files) => {
                const promises = files.map((file) => {
                    if (/.json$/.test(file.path)) {
                        return File.readFile(file.path);
                    }

                    return false;
                });

                Promise.all(promises)
                    .then((values) => {
                        let orchids = values
                            .filter((data) => data !== false)
                            .map((data) => JSON.parse(data));

                            this.setState({ orchids, isLoading: false });
                    });

            });
    }

    renderLoader = () => {
        if (! this.state.isLoading) {
            return <View></View>
        }

        return (
            <View style={styles.loaderContainer}>
                <ProgressBarAndroid  progress={0} indeterminate={true} color="orange"/>
            </View>
        );
    }

    renderSavedOrchids = () => {
        if (this.state.isLoading) {
            return <View></View>
        }

        const { orchids } = this.state;

        if (orchids.length == 0) {
            return <Text>Nenhuma orquídea salva</Text>
        }

        return orchids.map((orchid) => {
            return (
                <TouchableNativeFeedback
                    key={orchid.hash}
                    onPress={this.orchidDetails.bind(this, orchid.code)}
                    background={TouchableNativeFeedback.SelectableBackground()}
                    >
                    <View style={styles.orchidLink}>
                        <Text style={styles.orchidLinkText}>{orchid.name} ({orchid.scientific_name})</Text>
                    </View>
                </TouchableNativeFeedback>
            );
        });
    }

    orchidDetails = (code) => {
        const props = {
            code: { data: code },
            saved: true,
        };

        const route = Object.assign({}, routes['orchids-detail'], { props });
        const currentRoutes = this.props.navigator.getCurrentRoutes();

        if (_.find(currentRoutes, { title: route.title })) {
            this.props.navigator.jumpTo(route);
        } else {
            this.props.navigator.push(route);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    toolbarContainer: {
        backgroundColor: 'orange',
        height: 58,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },

    toolbarTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    toolbarTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    content: {
        padding: 20,
        flex: 1,
    },

    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    primaryTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    secondaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    subTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    orchidLink: {
        padding: 15,
    },

    orchidLinkText: {
        fontSize: 17,
    },

    paragraph: {
        marginBottom: 5,
    }
});
