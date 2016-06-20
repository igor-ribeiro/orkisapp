'use strict';

import React from 'react';
import {
    View,
    Text,
    ToolbarAndroid,
    StyleSheet,
    TouchableNativeFeedback,
    Image,
    ScrollView,
    ProgressBarAndroid,
    NetInfo
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import File from 'react-native-fs';

import routes from '../../routes';
import icons from '../../icons';

export default class OrchidsDetailPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orchid: undefined,
            isLoading: false,
        };
    }

    render = () => {
        const { orchid, isLoading } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.toolbarContainer}>
                    <TouchableNativeFeedback
                        onPress={Actions[this.props.back].bind(null, { direction: 'vertical' })}
                        background={TouchableNativeFeedback.SelectableBackground()}
                        >
                        <View style={styles.toolbarButton}>
                            <Image
                                source={{ uri: icons.back }}
                                style={styles.toolbarButtonImage}
                                />
                        </View>
                    </TouchableNativeFeedback>
                    {this.renderSaveButton()}
                </View>
                {this.renderLoader()}
                {this.renderContent()}
            </View>

        );
    }

    componentDidMount = () => {
        this.getOrchid(this.props.code);
    }

    componentWillReceiveProps = (props) => {
        if (props.code == this.props.code) {
            return;
        }

        this.getOrchid(props.code);
    }

    getOrchid = (code) => {
        code = this.parseCode(code);

        this.setState({ isLoading: true });

        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected && ! this.props.saved) {
                this.fetchOrchid(code);
            } else {
                this.getLocalOrchid(code);
            }
        });
    }

    parseCode = (code) => {
        console.log('parseCode', code);
        code = code.split(':');

        return {
            nurseryDocumet: code[0],
            orchidHash: code[1],
        };
    }

    fetchOrchid = (code) => {
        const url = `http://api.orkis.info/v1/orchids/${code.orchidHash}?_token=ca4b7ba955b5a042a4e22e907d839bbb`;
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };

        fetch(url)
            .then((response) => response.json())
            .then((response) => {
                const orchid = response.data;
                orchid.code = `${code.nurseryDocumet}:${code.orchidHash}`;

                this.setState({ orchid, isLoading: false });
            })
            .catch((error) => {
                this.setState({ isLoading: false });
            });
    }

    getLocalOrchid = (code) => {
        const path = `${File.DocumentDirectoryPath}/${code.orchidHash}.json`;

        File.readFile(path)
            .then((data) => {
                const orchid = JSON.parse(data);
                orchid.code = `${code.nurseryDocumet}:${code.orchidHash}`;

                this.setState({ orchid, isLoading: false });
            })
            .catch(() => {
                this.setState({ isLoading: false });
            })
    }

    goBack = () => {
        const current = this.props.navigator.state.presentedIndex;
        const routeStack = this.props.navigator.getCurrentRoutes();

        this.props.navigator.popToRoute(routeStack[current - 1]);
    }

    getName = (orchid) => {
        if (! orchid.name) {
            return orchid.scientific_name;
        }

        return `${orchid.name} (${orchid.scientific_name})`;
    }

    renderBackButton = () => {
        const { orchid, isLoading } = this.state;
    }

    renderSaveButton = () => {
        const { orchid, isLoading } = this.state;

        if (! orchid) {
            return <View></View>;
        }

        const saveOrSavedIcon = orchid.saved
            ?  icons.favoriteFilled
            : icons.favorite;

        return (
            <TouchableNativeFeedback
                onPress={this.saveOrRemove}
                background={TouchableNativeFeedback.SelectableBackground()}
                >
                <View style={styles.toolbarButton}>
                    <Image
                        source={{uri: saveOrSavedIcon}}
                        style={styles.toolbarButtonImage}
                        />
                </View>
            </TouchableNativeFeedback>
        );
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

    renderContent = () => {
        if (this.state.isLoading) {
            return <View></View>
        }

        return (
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
                {this.renderDetails()}
            </ScrollView>
        );
    }

    renderDetails = () => {
        const { orchid } = this.state;

        if (! orchid) {
            return <View><Text style={styles.primaryTitle}>Orquídea não encontrada.</Text></View>;
        }

        return (
            <View>
                <Text style={styles.primaryTitle}>{this.getName(orchid)}</Text>
                <Text>Origem: {orchid.origin}</Text>

                <Image
                    source={{ uri: orchid.image }}
                    style={styles.orchidImage}
                    />

                {this.renderDescription(orchid.description)}
                {this.renderInstructions(orchid.instructions)}
            </View>
        );
    }

    renderDescription = (description) => {
        description = JSON.parse(description);

        return (
            <View>
                <Text style={styles.secondaryTitle}>Descrição</Text>
                {description.map((text, i) => {
                    return <Text style={styles.paragraph} key={i}>{text}</Text>
                })}
            </View>
        );
    }

    renderInstructions = (instructions) => {
        instructions = JSON.parse(instructions);

        return (
            <View>
                <Text style={styles.secondaryTitle}>Instruções</Text>

                {instructions.map((item, i) => {
                    return (
                        <View key={item.title}>
                            <Text style={styles.subTitle}>{item.title}</Text>
                            <Text style={styles.paragraph}>{item.content}</Text>
                        </View>
                    )
                })}
            </View>
        );
    }

    saveOrRemove = () => {
        const orchid = this.state.orchid;

        if (! orchid.saved) {
            const path = `${File.DocumentDirectoryPath}/${orchid.hash}.json`;

            orchid.saved = true;

            console.log(orchid);

            File
                .writeFile(path, JSON.stringify(orchid), 'utf8')
                .then(() => {
                    this.setState({ orchid });
                })
        } else {
            const path = `${File.DocumentDirectoryPath}/${orchid.hash}.json`;

            orchid.saved = false;

            File
                .unlink(path)
                .then(() => {
                    this.setState({ orchid });
                });
        }

    }
};

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

    toolbarButton: {
        width: 58,
        alignItems: 'center',
        justifyContent: 'center',
    },

    toolbarButtonImage: {
        width: 32,
        height: 32,
    },

    content: {
        padding: 20,
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

    orchidImage: {
        flex: 1,
        height: 200,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        marginTop: 10,
        marginBottom: 10,
    },

    paragraph: {
        marginBottom: 5,
    },

    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
