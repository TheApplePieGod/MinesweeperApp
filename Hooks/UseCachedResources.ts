import { FontAwesome } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    // Load any resources or data that we need prior to rendering the app
    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                // Load fonts
                await Font.loadAsync({
                    ...FontAwesome.font,
                    'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
                    'digital-7': require('../assets/fonts/Digital7.ttf'),
                    'source-code-pro': require('../assets/fonts/SourceCodePro-Bold.ttf'),
                });

                // Preload hot game images
                await Promise.all([
                    require("../assets/images/game/flag.png"),
                    require("../assets/images/game/mine.png"),
                    require("../assets/images/game/tile_hidden.png"),
                    require("../assets/images/game/tile_revealed.png"),
                ].map(i => Asset.fromModule(i).downloadAsync()));
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
}
