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
            const tileIndex = this.tiles.findIndex(item => item.x === tile.x && item.y === tile.y);
            return this.tiles.splice(tileIndex, 1, tile);
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
            const availablePos = filteredTiles.length ? filteredTiles[Math.floor(Math.random()*filteredTiles.length)] : -1;

            const x = availablePos.x;
            const y = availablePos.y;
            console.log(x, y);
            return availablePos !== -1 ? {
                x,
                y
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