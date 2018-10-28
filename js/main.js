const game = new Vue({
    el: '#game',
    data: {
        score: 0,
        boardSize: 4,
        startTiles: 2,
        tiles: [],
        gameRunning: true,
    },

    created() {
        this.gameInit();
    },

    methods: {
        gameInit() {
            this.gameRunning = true;
            this.createEmptyTiles();
            this.updateScore();
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
            let  moved = false;
            this.tiles.forEach(row => {
                const valueArr = row.map(item => item.value);
                const mergedArr = this.valueMerge(valueArr);

                for(let i = 0; i < valueArr.length; i++) {
                    if(valueArr[i] !== mergedArr[i]) moved = true;
                }

                mergedArr.forEach((item, i) => {
                    row[i].value = item;
                    item ? row[i].class = `tile-${item}` : row[i].class = 'default';
                });
            });
            return moved; //if none was shifted return true
        },

        moveRight() {
            let moved = false;
            this.tiles.forEach(row => {
                const valueArr = row.map(item => item.value).reverse();
                const mergedArr = this.valueMerge(valueArr).reverse();

                for(let i = 0, j = mergedArr.length - 1; i < valueArr.length; i++, j--) {
                    if(valueArr[j] !== mergedArr[i]) moved = true;
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

                for(let i = 0; i < valueArr.length; i++) {
                    if(valueArr[i] !== mergedArr[i]) moved = true;
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

                for(let i = 0; i < valueArr.length; i++) {
                    if(valueArr[i] !== mergedArr[i]) moved = true;
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

        canContinue: function (arr) {
            console.log(arr);
            let movableRows = 0;
            let movableColumns = 0;
            //function which returns column of array.
            const getColumns = (board, n) => board.map(x => x[n].value);
            const rows = arr.map(rowArr => rowArr.map(item => item.value));
            let columns = [];
            for (let i = 0; i < arr.length; i++) {
                columns.push(getColumns(arr, i));
            }

            rows.forEach(item => { //checking if any row can be merged
                const mergedArr = this.valueMerge(item);
                let equal = true;
                for (let i = 0; i < item.length; i++) {
                    item[i] !== mergedArr[i] || item[i] === 0 ? equal = false : null;
                }
                !equal ? movableRows++ : null;
            });

            columns.forEach(item => {
                const mergedArr = this.valueMerge(item);
                let equal = true;
                for (let i = 0; i < item.length; i++) {
                    item[i] !== mergedArr[i] || item[i] === 0 ? equal = false : null;
                }
                !equal ? movableColumns++ : null;
            });

            return movableColumns > 0 || movableRows > 0; //if both are 0, the game is over
        },

        updateScore() {
            const tilesArr = this.tiles;
            const flattedArr = tilesArr.flat();
            const score = flattedArr.length ? flattedArr.map(item => item.value).reduce((previousValue, currentValue) => previousValue + currentValue) : 0;
            let lose = true;


            flattedArr.forEach((item, i, arr) => {
                if(item.value === 0 || (i < arr.length - 1 && item.value === arr[i + 1].value)) {
                    lose = false;
                }
            });

            this.score = score;
            !this.canContinue(tilesArr) ? this.gameOver() : null;
        },

        gameOver() {
            this.gameRunning = false;
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