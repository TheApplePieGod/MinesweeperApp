import React, { Dispatch, SetStateAction } from 'react';
import { Image, View, StyleSheet, ImageSourcePropType, GestureResponderEvent } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BoardState } from '../Screens/MainScreen';

interface Props {
    width: number;
    height: number;
    mineCount: number;
    state: BoardState;
    setState: Dispatch<SetStateAction<BoardState>>;
}

const CELL_MARGIN = 0;
const CELL_SIZE = 40;

const StyledImage = (props: { src: ImageSourcePropType }) => {
    return (
        <Image
            source={props.src}
            style={[
                styles.screen,
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
            style={{margin: CELL_MARGIN, flex: 0, width: CELL_SIZE, height: CELL_SIZE }}
            onTouchEnd={props.onClick}
        >
            <StyledImage src={
                revealed ? require("../assets/images/game/tile_revealed.png")
                            : require("../assets/images/game/tile_hidden.png")
            } />
            {revealed &&
                <StyledImage src={require("../assets/images/game/number_5.png")} />
            }
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.value == nextProps.value;
});

export const Board = (props: Props) => {
    const { state, setState } = props;

    const getSurroundingIndices = (index: number) => {
        const indices: number[] = [];
        const x = (index % props.width);
        const y = Math.floor(index / props.width);
        const up = y > 0;
        const left = x > 0;
        const down = y < props.height - 1;
        const right = x < props.width - 1;
        if (up) {
            indices.push(index - props.width)
            if (left)
                indices.push(index - props.width - 1)
            if (right)
                indices.push(index - props.width + 1)
        }
        if (down) {
            indices.push(index + props.width)
            if (left)
                indices.push(index + props.width - 1)
            if (right)
                indices.push(index + props.width + 1)
        }
        if (left)
            indices.push(index - 1)
        if (right)
            indices.push(index + 1)
        return indices
    }

    const handleFirstClick = (board: number[], index: number) => {
        const boardLen = props.width * props.height;
        if (isMine(board, index)) { // Move the mine somewhere else
            let i = -1;
            while (i == -1 || isMine(board, i))
                i = Math.floor(Math.random() * boardLen);
            setNum(board, index, 0);
            setMine(board, i);
        }

        // Populate numbers
        for (let i = 0; i < boardLen; i++) {
            if (isMine(board, i)) continue;
            let mineCount = 0;
            const surround = getSurroundingIndices(i);
            surround.forEach((s) => {
                mineCount += Number(isMine(board, s))
            });
            setNum(board, i, mineCount);
        }
    }

    const isMine = (board: number[], index: number) => {
        return (board[index] & 9) == 9;
    }

    const setMine = (board: number[], index: number) => {
        board[index] = 9;
    }

    const isRevealed = (board: number[], index: number) => {
        return (board[index] & 16) > 0;
    }

    const reveal = (board: number[], index: number) => {
        if (isRevealed(board, index)) return;
        if (hasFlag(board, index)) return;
        board[index] |= 16;

        // Reveal surrounding tiles
        const currentNum = getNum(board, index);
        if (currentNum == 0) {
            const surround = getSurroundingIndices(index);
            surround.forEach((i) => {
                reveal(board, i);
            });
        }
    }

    const hasFlag = (board: number[], index: number) => {
        return (board[index] & 32) > 0;
    }

    const setFlag = (board: number[], index: number) => {
        if (isRevealed(board, index)) return;
        if (hasFlag(board, index)) {
            board[index] &= ~32;
        } else {
            board[index] |= 32;
        }
    }

    const getNum = (board: number[], index: number) => {
        return board[index] & 15;
    }
    
    const setNum = (board: number[], index: number, value: number) => {
        board[index] = value;
    }

    const click = (index: number) => {
        if (globalThis.clickBlocked > 0) {
            globalThis.clickBlocked--;
            return;
        }

        setState((prevState) => {
            if (prevState.firstClick) {
                handleFirstClick(prevState.board, index);
                prevState.firstClick = false;
            }

            reveal(prevState.board, index);
            
            return { ...prevState };
        })
    }

    const renderCell = (data: {item: number; index: number}) => {
        return (
            <Cell value={data.item} onClick={() => click(data.index)} />
        );
    }

    React.useEffect(() => {
        const boardLen = props.width * props.height;
        const newBoard: number[] = Array(boardLen).fill(0);
        let minesLeft = props.mineCount;
        while (minesLeft > 0) {
            const index = Math.floor(Math.random() * boardLen);
            if (isMine(newBoard, index)) continue;
            setMine(newBoard, index);
            minesLeft--;
        }
        
        setState({
            board: newBoard,
            flagsLeft: props.mineCount,
            timeStarted: Date.now(),
            firstClick: true,
            flagEnabled: false
        });
    }, [props.width, props.height, props.mineCount]);

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onMoveShouldSetResponder={() => true}
            onResponderMove={(e) => console.log(e.nativeEvent.locationX)}
        >
            <FlatList
                style={{ width: CELL_SIZE * props.width, minHeight: CELL_SIZE * props.height }}
                data={state.board}
                renderItem={renderCell}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={props.width}
                getItemLayout={(data, index) => ({ length: CELL_SIZE, offset: CELL_SIZE * index, index })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0
    }
});
