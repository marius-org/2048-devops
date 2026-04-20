const GRID_SIZE = 4;
let board = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let gameOver = false;

function initBoard() {
    board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    score = 0;
    gameOver = false;
    updateScore();
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    const empty = [];
    for (let r = 0; r < GRID_SIZE; r++)
        for (let c = 0; c < GRID_SIZE; c++)
            if (board[r][c] === 0) empty.push({r, c});
    if (empty.length === 0) return;
    const {r, c} = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function renderBoard() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const tile = document.createElement('div');
            tile.className = `tile tile-${board[r][c]}`;
            tile.textContent = board[r][c] !== 0 ? board[r][c] : '';
            grid.appendChild(tile);
        }
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    document.getElementById('best').textContent = bestScore;
}

function slide(row) {
    let arr = row.filter(x => x !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr.splice(i + 1, 1);
        }
    }
    while (arr.length < GRID_SIZE) arr.push(0);
    return arr;
}

function move(direction) {
    if (gameOver) return;
    let moved = false;
    let newBoard = board.map(row => [...row]);

    if (direction === 'left') {
        for (let r = 0; r < GRID_SIZE; r++) {
            const slid = slide(board[r]);
            if (slid.join() !== board[r].join()) moved = true;
            newBoard[r] = slid;
        }
    } else if (direction === 'right') {
        for (let r = 0; r < GRID_SIZE; r++) {
            const slid = slide([...board[r]].reverse()).reverse();
            if (slid.join() !== board[r].join()) moved = true;
            newBoard[r] = slid;
        }
    } else if (direction === 'up') {
        for (let c = 0; c < GRID_SIZE; c++) {
            const col = board.map(row => row[c]);
            const slid = slide(col);
            for (let r = 0; r < GRID_SIZE; r++) {
                if (slid[r] !== board[r][c]) moved = true;
                newBoard[r][c] = slid[r];
            }
        }
    } else if (direction === 'down') {
        for (let c = 0; c < GRID_SIZE; c++) {
            const col = board.map(row => row[c]).reverse();
            const slid = slide(col).reverse();
            for (let r = 0; r < GRID_SIZE; r++) {
                if (slid[r] !== board[r][c]) moved = true;
                newBoard[r][c] = slid[r];
            }
        }
    }

    if (moved) {
        board = newBoard;
        addRandomTile();
        updateScore();
        renderBoard();
        checkGameOver();
    }
}

function checkGameOver() {
    for (let r = 0; r < GRID_SIZE; r++)
        for (let c = 0; c < GRID_SIZE; c++)
            if (board[r][c] === 0) return;

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (c < GRID_SIZE - 1 && board[r][c] === board[r][c + 1]) return;
            if (r < GRID_SIZE - 1 && board[r][c] === board[r + 1][c]) return;
        }
    }
    gameOver = true;
    document.getElementById('game-over').style.display = 'flex';
}

function submitScore() {
    const name = document.getElementById('player-name').value.trim();
    if (!name) {
        alert('Please enter your name!');
        return;
    }
    const highestTile = Math.max(...board.flat());
    fetch('/scores', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            player_name: name,
            score: score,
            highest_tile: highestTile
        })
    })
    .then(res => res.json())
    .then(() => {
        loadLeaderboard();
        document.getElementById('game-over').style.display = 'none';
        initBoard();
    });
}

function loadLeaderboard() {
    fetch('/scores')
        .then(res => res.json())
        .then(scores => {
            const tbody = document.getElementById('leaderboard-body');
            tbody.innerHTML = '';
            scores.forEach((s, i) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${s.player_name}</td>
                    <td>${s.score}</td>
                    <td>${s.highest_tile}</td>
                `;
                tbody.appendChild(row);
            });
        });
}

document.addEventListener('keydown', e => {
    const moves = {
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'ArrowUp': 'up',
        'ArrowDown': 'down'
    };
    if (moves[e.key]) {
        e.preventDefault();
        move(moves[e.key]);
    }
});

// Touch support for mobile
let touchStartX, touchStartY;
document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 'right' : 'left');
    } else {
        move(dy > 0 ? 'down' : 'up');
    }
});

window.onload = () => {
    initBoard();
    loadLeaderboard();
};