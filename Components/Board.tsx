import React, { Dispatch, SetStateAction } from 'react';
import { Image, View, StyleSheet, ImageSourcePropType, GestureResponderEvent, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BoardState } from '../Screens/MainScreen';

interface Props {
    state: BoardState;
    setState: Dispatch<SetStateAction<BoardState>>;
}

const CELL_MARGIN = 0;
const CELL_SIZE = 40;
const NUM_COLORS = ["", "#001ea5", "#07992b", "#c64509", "#8a30a3", "#542a37", "#1fc4c6", "#090a0a", "#292b2b"]

const StyledImage = (props: { src: ImageSourcePropType }) => {
    return (
        <Image
            source={props.src}
            style={[
                styles.image,
                { width: CELL_SIZE, height: CELL_SIZE }
            ]}
        />
    );
}

const Cell = React.memo((props: { value: number; onClick: () => void; }) => {
    const value = props.value;
    const num = value & 15;
    const revealed = (value & 16) > 0;
    const flag = (value & 32) > 0;

    // TODO: text instead of image
    return (
        <View
            style={styles.cell}
            onTouchEnd={props.onClick}
        >
            {revealed ?
                <View
                    style={[styles.cellBackground, { backgroundColor: num == 9 ? "red" : "#b5b5b5" }]}
                />
                :
                <StyledImage src={require("../assets/images/game/tile_hidden.png")} />
            }
            {(revealed && num > 0 && num < 9) &&
                <Text style={[styles.cellText, { color: NUM_COLORS[num] }]} >
                    {num}
                </Text>
            }
            {(revealed && num == 9) &&
                <StyledImage src={require("../assets/images/game/mine.png")} />
            }
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.value == nextProps.value;
});

const getSurroundingIndices = (index: number, width: number, height: number) => {
    const indices: number[] = [];
    const x = (index % width);
    const y = Math.floor(index / width);
    const up = y > 0;
    const left = x > 0;
    const down = y < height - 1;
    const right = x < width - 1;
    if (up) {
        indices.push(index - width)
        if (left)
            indices.push(index - width - 1)
        if (right)
            indices.push(index - width + 1)
    }
    if (down) {
        indices.push(index + width)
        if (left)
            indices.push(index + width - 1)
        if (right)
            indices.push(index + width + 1)
    }
    if (left)
        indices.push(index - 1)
    if (right)
        indices.push(index + 1)
    return indices
}

const isMine = (state: BoardState, index: number) => {
    return (state.board[index] & 9) == 9;
}

const setMine = (state: BoardState, index: number) => {
    state.board[index] = 9;
}

const isRevealed = (state: BoardState, index: number) => {
    return (state.board[index] & 16) > 0;
}

const reveal = (state: BoardState, index: number) => {
    if (isRevealed(state, index)) return;
    if (hasFlag(state, index)) return;
    state.board[index] |= 16;

    // Reveal surrounding tiles
    const currentNum = getNum(state, index);
    if (currentNum == 0) {
        const surround = getSurroundingIndices(index, state.width, state.height);
        surround.forEach((i) => {
            reveal(state, i);
        });
    }
}

const hasFlag = (state: BoardState, index: number) => {
    return (state.board[index] & 32) > 0;
}

const setFlag = (state: BoardState, index: number) => {
    if (isRevealed(state, index)) return;
    if (hasFlag(state, index)) {
        state.board[index] &= ~32;
    } else {
        state.board[index] |= 32;
    }
}

const getNum = (state: BoardState, index: number) => {
    return state.board[index] & 15;
}

const setNum = (state: BoardState, index: number, value: number) => {
    state.board[index] = value;
}

export const resetBoard = (state: BoardState, setState: Dispatch<SetStateAction<BoardState>>) => {
    const boardLen = state.width * state.height;
    state.board = Array(boardLen).fill(0);
    let minesLeft = state.mineCount;
    while (minesLeft > 0) {
        const index = Math.floor(Math.random() * boardLen);
        if (isMine(state, index)) continue;
        setMine(state, index);
        minesLeft--;
    }
    
    setState({
        ...state,
        flagsLeft: state.mineCount,
        timeStarted: Date.now(),
        firstClick: true,
        flagEnabled: false
    });
}

export const Board = (props: Props) => {
    const { state, setState } = props;
    const { width, height, mineCount } = props.state;

    const handleFirstClick = (state: BoardState, index: number) => {
        if (isMine(state, index)) { // Move the mine somewhere else
            let i = -1;
            while (i == -1 || isMine(state, i))
                i = Math.floor(Math.random() * state.board.length);
            setNum(state, index, 0);
            setMine(state, i);
        }

        // Populate numbers
        for (let i = 0; i < state.board.length; i++) {
            if (isMine(state, i)) continue;
            let mineCount = 0;
            const surround = getSurroundingIndices(i, width, height);
            surround.forEach((s) => {
                mineCount += Number(isMine(state, s))
            });
            setNum(state, i, mineCount);
        }
    }

    const click = (index: number) => {
        if (globalThis.clickBlocked > 0) {
            globalThis.clickBlocked--;
            return;
        }

        setState((prevState) => {
            if (prevState.firstClick) {
                handleFirstClick(prevState, index);
                prevState.firstClick = false;
            }

            reveal(prevState, index);
            
            return { ...prevState };
        })
    }

    const renderCell = (data: {item: number; index: number}) => {
        return (
            <Cell value={data.item} onClick={() => click(data.index)} />
        );
    }

    React.useEffect(() => {
        resetBoard(state, setState);
    }, []);

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onMoveShouldSetResponder={() => true}
            onResponderMove={(e) => console.log(e.nativeEvent.locationX)}
        >
            <FlatList
                style={{ width: CELL_SIZE * width, minHeight: CELL_SIZE * height }}
                data={state.board}
                renderItem={renderCell}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={width}
                getItemLayout={(data, index) => ({ length: CELL_SIZE, offset: CELL_SIZE * index, index })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0
    },
    cell: {
        margin: CELL_MARGIN,
        flex: 0,
        width: CELL_SIZE,
        height: CELL_SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    cellBackground: {
        position: "absolute",
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderColor: "black",
        borderBottomWidth: 1.5,
        borderRightWidth: 1.5
    },
    cellText: {
        fontFamily: "source-code-pro",
        fontSize: 30
    }
});
