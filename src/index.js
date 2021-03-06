import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={(props.winner) ? "square winner" : "square"}
    onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={(this.props.winner) ? this.props.winner.includes(i) : false}
      />
    );
  }

  render() {
    let result= [];
      result.push(
        new Array(3).fill().map( (el, i) => {
          return (<div className="board-row"> {
            new Array(3).fill().map( (e, j) => {
              return (this.renderSquare((i*3) + j))
            })
          }
          </div>)
        })
      )
    return (result);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moves: 0,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      reverseMoves: 0,

    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // const moves = current.moves;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          selection: i,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let row = (Math.floor(step.selection / 3) + 1);
      let col = (4 - ((3 * row) - step.selection)) + 0;
      const desc = move ?
        'Go to move #' + move + ' (' + row + ', ' + col + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}
          className={ move === this.state.stepNumber ? 'current' : ''}
          >{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner[0];
    } else if (this.state.stepNumber === 9) {
      status = "Game is a draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={(winner) ? winner[1]: [] }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{
            (this.state.reverseMoves) ?
            moves.reverse() : moves
          }</ol>
          <br />
          <button className="reverseMovesButton" onClick={() => this.reverseMoveList()}>
            Reverse Move List
          </button>
        </div>
      </div>
    );
  }

  reverseMoveList() {
    console.log('this.state.reverseMoves', this.state.reverseMoves);
    this.setState({
      reverseMoves: (this.state.reverseMoves) ? 0 : 1
    })
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],lines[i]];
    }
  }
  return null;
}
