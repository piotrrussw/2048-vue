new Vue({
    el: '#game',
    data: {
        score: 0,
        boardSize: 4,
        startTiles: 2,
        tiles: [],
    },
    methods: {
        restartGame(){
            console.log('game restarted');
            this.gameInit();
        },

        gameInit() {
            const startTiles = this.startTiles;
            const tilesLength = this.boardSize;
            this.tiles = [];
            this.updateScore(0);
            for(let i = 0; i < tilesLength; i++) {
                for(let j = 0; j < tilesLength; j++) {
                    this.tiles.push({
                        x: i,
                        y: j,
                        value: 0,
                        class: 'default'
                    });
                }
            }
            for(let i = 0; i < startTiles; i++) {
                this.addRandomTile();
            }
        },

        addTile(tile) {
            const tileIndex = this.tiles.findIndex(item => item.x === tile.x && item.y === tile.y) || -1;
            return this.tiles[tileIndex] = tile;
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
            const filteredTiles = this.tiles.filter(item => item.value === 0) || [];
            const availableX = filteredTiles.map(item => item.x);
            const availableY = filteredTiles.map(item => item.y);

            const posX = availableX.length ? availableX[Math.floor(Math.random()*availableX.length)] : -1;
            const posY = availableY.length ? availableY[Math.floor(Math.random()*availableY.length)] : -1;

            return posY !== -1 && posX !== -1  ? {
                x: posX,
                y: posY
            } : this.gameOver();
        },

        updateScore(score) {
            this.score = score;
        },

        gameOver() {
            alert('You lose');
        }
    }
});