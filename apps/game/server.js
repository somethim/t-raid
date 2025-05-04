const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const QUESTIONS = require('./questions.json');

let waitingPlayer = null;
let matches = [];
let playerScores = {};  // Храним общие очки игроков

function shuffleIndices(length) {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
}

function createMatch(player1, player2) {
    const match = {
        players: [player1, player2],
        currentQuestionIndex: 0,
        scores: [0, 0],
        streaks: [0, 0], // <- добавлено
        answeredPlayers: [],
        shuffledIndices: shuffleIndices(QUESTIONS.length)
    };
    matches.push(match);
    return match;
}

function findMatchBySocket(ws) {
    return matches.find(match => match.players.some(p => p.ws === ws));
}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            const player = { ws, username: data.username };

            if (waitingPlayer === null) {
                waitingPlayer = player;
                ws.send(JSON.stringify({ type: 'waiting', message: 'Waiting for opponent...' }));
            } else {
                const opponent = waitingPlayer;
                const match = createMatch(player, opponent);

                match.players.forEach((p, index) => {
                    const opponentName = match.players[1 - index].username;
                    p.ws.send(JSON.stringify({
                        type: 'start',
                        playerIndex: index,
                        opponent: opponentName,
                        scores: match.scores,
                        questionOrder: match.shuffledIndices // 👈 отправляем порядок
                    }));
                });

                waitingPlayer = null;
            }
        }

        if (data.type === 'answer') {
            const match = findMatchBySocket(ws);
            if (!match) return;

            const playerIndex = match.players.findIndex(p => p.ws === ws);
            if (match.answeredPlayers.includes(playerIndex)) return;

            match.answeredPlayers.push(playerIndex);
            const chosenIndex = data.answerIndex;
            const questionIndex = match.shuffledIndices[match.currentQuestionIndex];
            const correctAnswer = QUESTIONS[questionIndex].answer;
            const correct = chosenIndex === correctAnswer && chosenIndex !== -1;

            if (correct) {
                match.scores[playerIndex] += 1;
            }

            // Уведомляем обоих игроков о результате
            match.players.forEach(p => {
                p.ws.send(JSON.stringify({
                    type: 'answer',
                    playerIndex,
                    correct,
                    scores: match.scores,
                }));
            });

            // Если оба ответили или хотя бы один правильно
            const bothAnswered = match.answeredPlayers.length === 2;
            if (correct || bothAnswered) {
                setTimeout(() => {
                    match.currentQuestionIndex++;
                    match.answeredPlayers = [];

                    if (match.currentQuestionIndex < QUESTIONS.length) {
                        match.players.forEach(p => {
                            p.ws.send(JSON.stringify({
                                type: 'next',
                                questionIndex: match.currentQuestionIndex
                            }));
                        });

                    } else {
                        // Завершение игры
                        match.players.forEach((p, index) => {
                            p.ws.send(JSON.stringify({
                                type: 'gameover',
                                yourScore: match.scores[index],
                                opponentScore: match.scores[1 - index],
                            }));

                            // Обновляем общий счет игрока
                            if (!playerScores[p.username]) {
                                playerScores[p.username] = 0;
                            }
                            playerScores[p.username] += match.scores[index];
                        });

                        // Удаление матча
                        matches = matches.filter(m => m !== match);
                    }
                }, 500);
            }
        }

        if (data.type === 'getLeaderboard') {
            // Отправляем таблицу лидеров игроку
            const leaderboard = Object.entries(playerScores)
                .sort((a, b) => b[1] - a[1]) // Сортируем по убыванию очков
                .map(([username, score]) => ({ username, score }));

            ws.send(JSON.stringify({ type: 'leaderboard', leaderboard }));
        }
    });

    ws.on('close', () => {
        if (waitingPlayer?.ws === ws) {
            waitingPlayer = null;
        }

        // Удаляем матч, если игрок вышел
        const match = findMatchBySocket(ws);
        if (match) {
            match.players.forEach(p => {
                if (p.ws !== ws) {
                    p.ws.send(JSON.stringify({
                        type: 'gameover',
                        yourScore: match.scores[match.players.findIndex(p2 => p2.ws === p.ws)],
                        opponentScore: match.scores[match.players.findIndex(p2 => p2.ws === ws)],
                        message: 'Opponent disconnected.'
                    }));
                }
            });

            matches = matches.filter(m => m !== match);
        }
    });
});
