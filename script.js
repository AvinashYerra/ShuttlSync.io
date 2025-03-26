class BadmintonGame {
    constructor() {
        this.teamAScore = 0;
        this.teamBScore = 0;
        this.isGameStarted = false;
        this.servingTeam = null; // Will be set after toss
        this.tossWinner = null; // Will store the winner of toss
        this.winner = null; // Will store the winner of the game
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        // Team names (fixed)
        this.teamANameDisplay = document.getElementById('teamAName');
        this.teamBNameDisplay = document.getElementById('teamBName');

        // Scores
        this.teamAScoreDisplay = document.getElementById('teamAScore');
        this.teamBScoreDisplay = document.getElementById('teamBScore');

        // Buttons
        this.startGameBtn = document.getElementById('startGame');
        this.resetGameBtn = document.getElementById('resetGame');
        this.tossButton = document.getElementById('tossButton');
        this.scoreButtons = document.querySelectorAll('.score-btn');

        // Court blocks
        this.courtBlocks = document.querySelectorAll('.court-block');

        // Toss result display
        this.tossResultDisplay = document.getElementById('tossResult');
    }

    addEventListeners() {
        this.tossButton.addEventListener('click', () => this.performToss());
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
        this.scoreButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleScore(e));
        });
    }

    performToss() {
        // Generate random result (0 or 1)
        const result = Math.random() < 0.5;
        this.tossWinner = result ? 'A' : 'B';
        
        // Display toss result
        this.tossResultDisplay.textContent = `Team ${this.tossWinner} won the toss!`;
        this.tossResultDisplay.style.display = 'block';
        
        // Enable start game button
        this.startGameBtn.disabled = false;
        
        // Disable toss button
        this.tossButton.disabled = true;
    }

    startGame() {
        this.isGameStarted = true;
        this.servingTeam = this.tossWinner; // Set serving team based on toss winner
        this.winner = null;

        document.querySelector('.game-setup').style.display = 'none';
        document.querySelector('.score-board').style.display = 'flex';
        
        // Highlight initial serving position
        this.updateServingPosition();
        this.updateServingIndicator();
    }

    resetGame() {
        this.teamAScore = 0;
        this.teamBScore = 0;
        this.isGameStarted = false;
        this.servingTeam = null;
        this.tossWinner = null;
        this.winner = null;

        this.updateDisplays();
        this.updateServingPosition();
        this.updateServingIndicator();
        
        // Reset UI elements
        document.querySelector('.game-setup').style.display = 'block';
        document.querySelector('.score-board').style.display = 'none';
        this.tossResultDisplay.style.display = 'none';
        this.tossButton.disabled = false;
        this.startGameBtn.disabled = true;
    }

    checkWinner() {
        if (this.teamAScore >= 21 && this.teamAScore - this.teamBScore >= 2) {
            this.winner = 'A';
            this.isGameStarted = false;
            return true;
        } else if (this.teamBScore >= 21 && this.teamBScore - this.teamAScore >= 2) {
            this.winner = 'B';
            this.isGameStarted = false;
            return true;
        }
        return false;
    }

    handleScore(event) {
        if (!this.isGameStarted) return;

        const team = event.target.dataset.team;
        const action = event.target.dataset.action;

        if (action === 'add') {
            if (team === 'A') {
                this.teamAScore++;
                // If Team A scores while serving, they continue serving
                // If Team A scores while Team B is serving, Team A gets to serve
                this.servingTeam = 'A';
            } else {
                this.teamBScore++;
                // If Team B scores while serving, they continue serving
                // If Team B scores while Team A is serving, Team B gets to serve
                this.servingTeam = 'B';
            }
        } else if (action === 'subtract') {
            if (team === 'A' && this.teamAScore > 0) {
                this.teamAScore--;
            } else if (team === 'B' && this.teamBScore > 0) {
                this.teamBScore--;
            }
        }

        this.updateDisplays();
        this.updateServingPosition();
        this.updateServingIndicator();

        // Check for winner after updating score
        if (this.checkWinner()) {
            this.announceWinner();
        }
    }

    announceWinner() {
        const winnerDisplay = document.createElement('div');
        winnerDisplay.className = 'winner-announcement';
        winnerDisplay.textContent = `Team ${this.winner} wins the game!`;
        document.querySelector('.score-board').appendChild(winnerDisplay);
        
        // Disable score buttons
        this.scoreButtons.forEach(button => button.disabled = true);
    }

    updateServingPosition() {
        // Remove active class from all blocks
        document.querySelectorAll('.court-block').forEach(block => {
            block.classList.remove('active');
        });

        // Get the serving team's score
        const servingScore = this.servingTeam === 'A' ? this.teamAScore : this.teamBScore;
        const isEvenScore = servingScore % 2 === 0;
        
        // For Team A: even score = right side (A1), odd score = left side (A2)
        // For Team B: even score = left side (B2), odd score = right side (B1)
        let servingPosition;
        if (this.servingTeam === 'A') {
            servingPosition = isEvenScore ? 1 : 0; // Right for even, left for odd
        } else {
            servingPosition = isEvenScore ? 0 : 1; // Left for even, right for odd
        }
        
        // Update serving position based on current server
        if (this.servingTeam === 'A') {
            const block = document.querySelector(`.team-a .court-block:nth-child(${servingPosition + 1})`);
            if (block) block.classList.add('active');
        } else {
            const block = document.querySelector(`.team-b .court-block:nth-child(${servingPosition + 1})`);
            if (block) block.classList.add('active');
        }
    }

    updateServingIndicator() {
        // Add serving indicator to team names
        this.teamANameDisplay.textContent = `Team A${this.servingTeam === 'A' ? ' 🏸' : ''}`;
        this.teamBNameDisplay.textContent = `Team B${this.servingTeam === 'B' ? ' 🏸' : ''}`;
    }

    updateDisplays() {
        this.teamAScoreDisplay.textContent = this.teamAScore;
        this.teamBScoreDisplay.textContent = this.teamBScore;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BadmintonGame();
}); 