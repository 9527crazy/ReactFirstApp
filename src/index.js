import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

const M = 3;

function Square(props) {
    return (
        <button className='square' style={{color: props.color}} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], lines: lines[i]};
        }
    }
    return {winner: null, lines: null};
}

class Board extends React.Component {
    rederSquare(i) {
        let color;
        debugger
        if (this.props.line && this.props.line.includes(i)) {
            color = 'red';
        } else {
            color = 'black';
        }
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                color={color}
                onClick={() => this.props.onClick(i)}
            />);
    }

    render() {
        let n = 0;
        let board = [];
        for (let i = 0; i < M; i++) {
            let boardRow = [];
            for (let j = 0; j < M; j++, n++) {
                boardRow.push(this.rederSquare(n));
            }
            board.push(<div className='board-row' key={i}>{boardRow}</div>);
        }
        return (
            <div>{board}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(M * M).fill(null),
                row: null,
                col: null
            }],
            stepNumber: 0,
            xIsNext: true,
            startToEnd: true
        };
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                row: parseInt(i / M) + 1,
                col: i % M + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    changeOrder() {
        this.setState({
            startToEnd: !this.state.startToEnd,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        const winner = result.winner;
        const lines = result.lines;
        const moves = history.map((step, move) => {

            const desc = move ? 'GO to move #' + move + '(' + step.row + ',' + step.col + ')' : 'GO to game start';
            if (step === current) {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>
                    </li>
                );
            } else {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
        });
        let orderableMoves = this.state.startToEnd ? moves : moves.reverse();
        let status;
        if (winner) {
            status = 'Winner:' + winner;
        } else if (!winner && this.state.stepNumber === M * M) {
            status = 'MATCH!';
        } else {
            status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        squares={current.squares}
                        line={lines}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <button onClick={() => {
                        this.changeOrder()
                    }}>↑↓
                    </button>
                    <ol>{orderableMoves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
