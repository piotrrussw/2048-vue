new Vue({
    el: '#game',
    data: {
        score: 0,
        gameIsRunning: false,
    },
    methods: {
        restartGame(){
            console.log('game restarted');
            this.gameIsRunning = false;
            this.startGame();
        },
        startGame() {
            this.gameIsRunning = true;
        }
    }
});