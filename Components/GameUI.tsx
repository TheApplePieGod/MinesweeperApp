import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Image } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { BoardState } from "../Screens/MainScreen";
import { resetBoard } from "./Board";
import { MonoText } from "./Themed";

interface Props {
    state: BoardState;
    setState: Dispatch<SetStateAction<BoardState>>;
}

export const GameUI = (props: Props) => {
    const { state, setState } = props;

    const [time, setTime] = React.useState("");

    const formatTime = () => {
        const totalSeconds = Math.floor((Date.now() - state.timeStarted) / 1000.0);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
 
    React.useEffect(() => {
        const handle = setInterval(() => setTime(formatTime()), 100);
        return () => clearInterval(handle);
    }, [state.timeStarted]);

    return (
        <View style={styles.container}>
            <MonoText style={styles.text}>{state.flagsLeft.toString().padStart(5, "0")}</MonoText>
            <TouchableHighlight onPress={() => resetBoard(props.state, props.setState)}>
                <Image
                    source={require("../assets/images/game/face_happy.png")}
                    style={[
                        { width: 35, height: 35 }
                    ]}
                />
            </TouchableHighlight>
            <MonoText style={styles.text}>{formatTime()}</MonoText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        padding: 2,
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        alignItems: "center"
    },
    text: {
        color: "red",
        fontSize: 20,
        paddingHorizontal: 10
    }
});
