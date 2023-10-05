import { useCallback, useState, ReactElement } from "react";
import { Box } from "./Box";
import Button from 'react-bootstrap/Button';
import useSound from 'use-sound';
import mineExploded from './mine-exploded.mp3';

const sizes = {
    "small": {
        rows: 15,
        cols: 15,
        mines: 25,
        gridClass: "grid-board-small"
    },
    "big": {
        rows: 15,
        cols: 30,
        mines: 40,
        gridClass: "grid-board-big"
    }
};

const countMines = (grid: string[][], i: number, j: number, mines: Set<string>): {count: number, neighborsList: any[]} => {
    const neighbors = [`${i-1},${j-1}`, `${i-1},${j}`, `${i-1},${j+1}`, `${i},${j-1}`, `${i},${j+1}`, `${i+1},${j-1}`, `${i+1},${j}`, `${i+1},${j+1}`]
    let count = 0;
    neighbors.forEach(element => {
        if (mines.has(element)) {
            count += 1
        }
    });
    const m: number = grid.length;
    const n: number = grid[0].length;
    const neighborsList = neighbors.map( val => val.split(","))
        .map(val => [Number(val[0]), Number(val[1])])
        .filter( (val) => count === 0 && val[0] >= 0 && val[0] < m && val[1] >= 0 && val[1] < n)
    return { count, neighborsList };
}

const doReveal = (grid: string[][], i: number, j: number, minesSet: Set<string>) => {
    const {count} =  countMines(grid, i, j, minesSet)
    if (count > 0) {
        grid[i][j] = `${count}`;
    } else {
        let q = [[i, j]];
        const seen: Set<string> = new Set();
        while (q.length > 0) {
            const newq: any[] = [];
            q.forEach(pt => {
                const [x, y] = pt;
                if (!seen.has(`${x},${y}`)) {
                    seen.add(`${x},${y}`);
                    const {count, neighborsList} = countMines(grid, x, y, minesSet);
                    grid[x][y] = count === 0 ? "" : `${count}`;
                    neighborsList.forEach (neighb => {
                        const [u,v] = neighb;
                        if (!seen.has(`${u},${v}`)) {
                            newq.push(neighb);
                        }
                    })
                }
            })
            q = newq;
        }
    }
    
    return copyGrid(grid);
}

const copyGrid = (grid: string[][]) => {
    const newGrid = []
     for(let m=0; m < grid.length; m++){
        const newRow = []
        for (let n=0; n < grid[0].length; n++) {
            newRow.push(grid[m][n])            
        }
        newGrid.push(newRow);
     }
     return newGrid;
}

const getRandomMines = (mines: number, rows: number, cols: number): Set<string> => {
    const ret = [];
    for (let i = 0; i < mines; i++) {
        const m = Math.floor(Math.random() * rows);
        const n = Math.floor(Math.random() * cols);
        ret.push(`${m},${n}`);
    }
    return new Set(ret);
}

const initializeState = (rows: number, cols: number) => {
    const initState: string[][] = [];
    for (let row = 0; row < rows; row ++) {
        const gridrow: string[] = [];
        initState.push(gridrow)
        for (let col = 0; col < cols; col ++) {
            initState[row].push("H");
        }
    }
    return initState;
}

const noHiddenRemaining = (grid: string[][], minesCount: number) => {
    let hidden = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    for (let i=0; i< rows; i++) {
        for (let j=0; j< cols;j++) {
            if (grid[i][j] === "H") {
                hidden++;
            }
        }
    }
    return hidden === minesCount;
}

const showAllMines = (grid: string[][], minesSet: Set<string>) => {
    minesSet.forEach(mine => {
        const [x, y] = mine.split(",").map(a=>Number(a));
        grid[x][y] = "M";
    })
    
}

type GameSize = 'small' | 'big';

export function Grid() {
    const [size, setGameSize] = useState<GameSize>('small');
    const {rows, cols, mines, gridClass} = sizes[size];
    const [gridState, setGridState] = useState(() => initializeState(rows, cols));
    const [gameOver, setGameOver] = useState(false);
    const [minesSet, setMinesSet] = useState(() => getRandomMines(mines, rows, cols));
    const [playMineExploded] = useSound(mineExploded);


    const grid: ReactElement[][] = []
    for (let row = 0; row < rows; row ++) {
        const gridrow: ReactElement[] = [];
        grid.push(gridrow)
        for (let col = 0; col < cols; col ++) {
            grid[row].push(<Box value={gridState[row][col]} onClick={() => reveal(row, col)}/>)
        }
    }

    const reset = (size: GameSize) => {
        setGameSize(size);
        setGameOver(false);
        const {mines, rows, cols} = sizes[size];
        setGridState(initializeState(rows, cols));
        setMinesSet(getRandomMines(mines, rows, cols));
    }

    const reveal = useCallback((i: number, j: number) => {
        if (gridState[i][j] !== "H" || gameOver) {
            return;
        }
        if (minesSet.has(`${i},${j}`)) {
            gridState[i][j] = "M";
            setGameOver(true);
            playMineExploded();
            setGridState(copyGrid(gridState));
        } else {
            const newGrid = doReveal(gridState, i, j, minesSet);
            if (gridState[i][j] === "M") {
                setGameOver(true);
                playMineExploded();
            } else if (noHiddenRemaining(newGrid, mines)) {
                showAllMines(newGrid, minesSet);
                setGameOver(true);
            }
            setGridState(newGrid);
         }
    }, [gridState, gameOver, minesSet]);

    return (
        <>
            <div style={{display: "flex"}}>
                <Button style={{width: "100px", marginRight: "10px"}} variant="primary" onClick={()=>reset('small')}>Small</Button>
                <Button style={{width: "100px"}} variant="primary" onClick={()=>reset('big')}>Big</Button>
            </div>
            <br/>
            <div className={gridClass}>
                {grid}
            </div>
        </>
    );
}