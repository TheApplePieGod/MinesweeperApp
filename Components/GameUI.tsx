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
        if (state.timeStarted == 0) return "00:00";
        const curTime = state.timeEnded > 0 ? state.timeEnded : Date.now();
        const totalSeconds = Math.floor((curTime - state.timeStarted) / 1000.0);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
 
    React.useEffect(() => {
        const handle = setInterval(() => setTime(formatTime()), 100);
        return () => clearInterval(handle);
    }, [state.timeStarted, state.timeEnded]);

    return (
        <View style={styles.container}>
            <MonoText style={styles.text}>{Math.max(state.flagsLeft, 0).toString().padStart(5, "0")}</MonoText>
            <TouchableHighlight onPress={() => resetBoard(state, setState)}>
                <Image
                    source={require("../assets/images/game/face_happy.png")}
                    style={[
                        { width: 30, height: 30 }
                    ]}
                />
            </TouchableHighlight>
            <MonoText style={styles.text}>{time}</MonoText>
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
        fontSize: 22,
        paddingHorizontal: 10
    }
});
