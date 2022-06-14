import { StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from '../Components/Themed';

const InfoModalScreen = ({ navigation }: NativeStackScreenProps<any>) => {
    return (
        <View style={styles.container}>
            <Text>Info</Text>
        </View>
    );
}

export default InfoModalScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
