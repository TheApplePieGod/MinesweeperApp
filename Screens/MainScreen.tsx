import React from 'react';
import { Animated, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from '../Components/Themed';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Layout from '../Constants/Layout';
import { Board } from '../Components/Board';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { GameUI } from '../Components/GameUI';

declare global {
    var clickBlocked: number;
}

export interface BoardState {
    board: number[];
    flagsLeft: number;
    timeStarted: number;
    firstClick: boolean;
    flagEnabled: boolean;
    width: number;
    height: number;
    mineCount: number;
}

const MainScreen = ({ navigation }: NativeStackScreenProps<any>) => {
    const [boardState, setBoardState] = React.useState<BoardState>({
        board: [],
        flagsLeft: 99,
        timeStarted: 0,
        firstClick: true,
        flagEnabled: false,
        width: 16,
        height: 16,
        mineCount: 40
    });

    const [flagAnim, setFlagAnim] = React.useState(new Animated.Value(1));

    const toggleFlagMode = () => {
        Animated.timing(flagAnim, {
            toValue: boardState.flagEnabled ? 0.2 : 1,
            duration: 80,
            useNativeDriver: true
        }).start();
        setBoardState({ ...boardState, flagEnabled: !boardState.flagEnabled });
    }

    return (
        <React.Fragment>
            <View style={styles.container}>
                <ReactNativeZoomableView
                    maxZoom={2.0}
                    minZoom={0.3}
                    zoomStep={0.0}
                    initialZoom={1}
                    movementSensibility={2.0}
                    bindToBorders={false}
                    visualTouchFeedbackEnabled={false}
                    doubleTapDelay={0}
                    style={{ width: Layout.window.width }}
                    onShiftingEnd={() => globalThis.clickBlocked = 1}
                    onZoomAfter={() => globalThis.clickBlocked = 2}
                >
                    <Board
                        state={boardState}
                        setState={setBoardState}
                    />
                </ReactNativeZoomableView>
            </View>
            <View style={styles.footer}>
                <TouchableHighlight onPress={() => navigation.push("Info")}>
                    <FontAwesome
                        name="info-circle"
                        size={25}
                        color={"white"}
                    />
                </TouchableHighlight>
                <GameUI state={boardState} setState={setBoardState} />
                <TouchableWithoutFeedback onPress={() => toggleFlagMode()}>
                    <Animated.Image
                        source={require("../assets/images/game/flag.png")}
                        style={[styles.flag, { opacity: flagAnim }]}
                    />
                </TouchableWithoutFeedback>
            </View>
        </React.Fragment>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        position: "absolute",
        bottom: 0,
        height: "8%",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100
        //paddingTop: 5,
    },
    flag: {
        width: 25,
        height: 25,
        borderRadius: 5,
        backgroundColor: "white"
    }
});
