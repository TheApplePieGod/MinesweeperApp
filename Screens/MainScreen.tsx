import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from '../Components/Themed';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Layout from '../Constants/Layout';
import { Board } from '../Components/Board';

declare global {
    var clickBlocked: number;
}

const MainScreen = ({ navigation }: NativeStackScreenProps<any>) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Screen</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
                    width={16}
                    height={16}
                    mineCount={40}  
                />
            </ReactNativeZoomableView>
        </View>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
