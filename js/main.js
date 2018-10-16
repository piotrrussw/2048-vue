const game = new Vue({
    el: '#game',
    data: {
        score: 0,
        boardSize: 4,
        startTiles: 2,
        tiles: [],
    },

    events: {
        moveDown(){
            console.log('moveDown');
        }
    },

    methods: {
        restartGame(){
            console.log('game restarted');
            this.gameInit();
        },

        gameInit() {
            this.updateScore();
            this.createEmptyTiles();
            for(let i = 0; i < this.startTiles; i++) {
                this.addRandomTile();
            }
        },

        createEmptyTiles() {
            this.tiles = [];
            const tilesLength = this.boardSize;
            for(let i = 0; i < tilesLength; i++) {
                let tileRow = [];
                for(let j = 0; j < tilesLength; j++) {
                    tileRow.push({
                        x: j,
                        y: i,
                        value: 0,
                        class: 'default'
                    });
                }
                this.tiles.push(tileRow);
            }
        },

        addTile(tile) {
            return this.tiles[tile.y] ? this.tiles[tile.y].splice(tile.x, 1, tile) : null;
        },

        addRandomTile() {
            const value = Math.random() < 0.8 ? 2 : 4;
            const position = this.randomCell() || [];
            this.addTile({
                x: position.x,
                y: position.y,
                value,
                class: `tile-${value}`
            });
        },

        randomCell() {
            const flattedTiles = this.tiles.flat();
            const filteredTiles = flattedTiles.filter(item => item.value === 0) || [];
            const availablePos = filteredTiles.length ? filteredTiles[Math.floor(Math.random()*filteredTiles.length)] : -1;

            const x = availablePos.x;
            const y = availablePos.y;

            return availablePos !== -1 ? {
                x,
                y
            } : this.gameOver();
        },

        moveLeft() {
            let moved = false;
            this.tiles.forEach(row => {
                const valueArr = row.map(item => item.value);
                const mergedArr = this.valueMerge(valueArr);
                if(!(valueArr.length === mergedArr.length && valueArr.every((value, index) => value === mergedArr[index]))) {
                    moved = true;
                }
                mergedArr.forEach((item, i) => {
                    row[i].value = item;
                    item ? row[i].class = `tile-${item}` : row[i].class = 'default';
                });
            });
            return moved;
        },

        moveRight() {
            let moved = false;
            this.tiles.forEach(row => {
                const valueArr = row.map(item => item.value).reverse();
                const mergedArr = this.valueMerge(valueArr).reverse();
                if(!(valueArr.length === mergedArr.length && valueArr.every((value, index) => value === mergedArr[index]))) {
                    moved = true;
                }
                mergedArr.forEach((item, i) => {
                    row[i].value = item;
                    item ? row[i].class = `tile-${item}` : row[i].class = 'default';
                });
            });
            return moved;
        },

        moveUp() {
            let moved = false;
            for(let i = 0; i < 4; i++) {
                let valueArr = [];
                for(let j = 0; j < 4; j++) {
                    valueArr.push(this.tiles[j][i].value);
                }
                const mergedArr = this.valueMerge(valueArr);
                if(!(valueArr.length === mergedArr.length && valueArr.every((value, index) => value === mergedArr[index]))) {
                    moved = true;
                }
                mergedArr.forEach((item,index) => {
                    this.tiles[index][i].value = item;
                    item ? this.tiles[index][i].class = `tile-${item}` : this.tiles[index][i].class = 'default';
                });
            }
            return moved;
        },

        moveDown() {
            let moved = false;
            for(let i = 0; i < 4; i++) {
                let valueArr = [];
                for(let j = 0; j < 4; j++) {
                    valueArr.push(this.tiles[j][i].value);
                }
                const mergedArr = this.valueMerge(valueArr.reverse());
                if(!(valueArr.length === mergedArr.length && valueArr.every((value, index) => value === mergedArr[index]))) {
                    moved = true;
                }
                mergedArr.reverse().forEach((item,index) => {
                    this.tiles[index][i].value = item;
                    item ? this.tiles[index][i].class = `tile-${item}` : this.tiles[index][i].class = 'default';
                });
            }
            return moved;
        },

        valueMerge(arr) {
            let ret = [];
            let cleanArr = [];
            arr.forEach(item => item ? cleanArr.push(item) : null);
            for(let i = 0; i < cleanArr.length; i++) {
                if(cleanArr[i + 1] && cleanArr[i] === cleanArr[i + 1]) {
                    ret.push(cleanArr[i] + cleanArr[i + 1]);
                    i++;
                } else {
                    ret.push(cleanArr[i]);
                }
            }
            for(let i = 0; i < 4; i++) {
                i >= ret.length ? ret.push(0) : null;
            }
            return ret;
        },

        updateScore() {
            const flattedArr = this.tiles.flat();
            const score = flattedArr.length ? flattedArr.map(item => item.value).reduce((previousValue, currentValue) => previousValue + currentValue) : 0;
            this.score = score;
        },

        gameOver() {
            alert('You lose');
        },

        detectKey(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    if(this.moveLeft()) {
                        this.addRandomTile();
                        this.updateScore();
                    }
                    break;
                case 'ArrowUp':
                    if(this.moveUp()) {
                        this.addRandomTile();
                        this.updateScore();
                    }
                    break;
                case 'ArrowRight':
                    if(this.moveRight()) {
                        this.addRandomTile();
                        this.updateScore();
                    }
                    break;
                case 'ArrowDown':
                    if(this.moveDown()) {
                        this.addRandomTile();
                        this.updateScore();
                    }
                    break;
                default:
                    break;
            }
        }
    }
});

window.addEventListener('keydown', function(e) {
    game.detectKey(e);
});