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
            this.updateScore(0);
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

        mergeTiles() {

        },

        moveTile() {

        },

        updateScore(score) {
            this.score = score;
        },

        gameOver() {
            alert('You lose');
        }
    }
});