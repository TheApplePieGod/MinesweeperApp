import { ColorSchemeName, Pressable } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinkingConfiguration from './LinkingConfiguration';
import NotFoundScreen from '../Screens/NotFoundScreen';
import MainScreen from '../Screens/MainScreen';
import InfoModalScreen from '../Screens/InfoModalScreen';

const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
* A root stack navigator is often used for displaying modals on top of all other content.
* https://reactnavigation.org/docs/modal
*/
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Info" component={InfoModalScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default Navigation;