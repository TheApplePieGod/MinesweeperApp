import { Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from '../Components/Themed';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Layout from '../Constants/Layout';
import { Board, calcRequiredPadding } from '../Components/Board';

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
                //bindToBorders={true}
                visualTouchFeedbackEnabled={false}
                panBoundaryPadding={calcRequiredPadding(16)}
                style={{ width: Layout.window.width }}
            >
                <Board width={30} height={30} mineCount={30} />
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
