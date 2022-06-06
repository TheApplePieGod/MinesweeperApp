import React from 'react';
import { Image, View, StyleSheet, ImageSourcePropType, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface Props {
    width: number;
    height: number;
    mineCount: number;
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

export const calcRequiredPadding = (length: number) => {
    return (length / 2) * (CELL_SIZE + CELL_MARGIN * 2)
}

class Cell extends React.Component<{ index: number; value: number; onClick: () => void; }> {
    shouldComponentUpdate(nextProps: any) {
        return this.props.value != nextProps.value;
    }

    render() {
        const value = this.props.value;
        const num = value & 15;
        const revealed = (value & 16) > 0;
        const flag = (value & 32) > 0;

        return (
            <View
                // key={props.index}
                style={{margin: CELL_MARGIN, flex: 0, width: CELL_SIZE, height: CELL_SIZE }}
                onTouchEnd={this.props.onClick}
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
    }
}

export const Board = (props: Props) => {
    const [board, setBoard] = React.useState<number[]>([]);
    const [firstClick, setFirstClick] = React.useState(true);

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
        if (!firstClick) return;

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

        setBoard([...board]);
        setFirstClick(false);
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

    const test = (index: number) => {
        handleFirstClick(board, index);
        reveal(board, index);
        setBoard([...board]);
    }

    const renderCell = (data: {item: number; index: number}) => {
        return (
            <Cell index={data.index} value={data.item} onClick={() => test(data.index)} />
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
        setBoard(newBoard);
        setFirstClick(true);
    }, [props]);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <FlatList
                style={{ width: "100%", height: "100%" }}
                data={board}
                // horizontal={false}
                renderItem={renderCell}
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
