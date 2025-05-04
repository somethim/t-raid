import React, {useState, useEffect, useRef} from 'react';
import {useUser} from './UserContext';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LeaderboardScreen from './LeaderboardScreen';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import {CommonActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import GameOverScreen from './GameOverScreen';

import {
    View,
    Text,
    Button,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import QUESTIONS from './questions.json';
import {UserProvider} from './UserContext';

const Stack = createNativeStackNavigator();

const USERS = ["alice", "bob"];

function LobbyScreen({navigation}) {
    return (
        <LinearGradient
            colors={['#7D19EF', '#FFE135']}
            style={styles.lobbyContainer}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate('Leaderboard')}
                style={styles.leaderboardButton}
            >
                <Image
                    source={require('./components/ui/leaderboard.png')}
                    style={styles.leaderboardIcon}
                />
            </TouchableOpacity>

            <View style={styles.scoreContainer}>
                <Image
                    source={require('./components/ui/rf_point.png')}
                    style={styles.scoreIcon}
                />
                <Text style={styles.scoreText}>120</Text>
            </View>


            <Text style={styles.title}>Fiscal Frontiers</Text>

            <View style={styles.container}>


                <Image
                    source={require('./components/ui/start_point.png')}
                    style={styles.start_point}
                />

                <Text style={styles.subtitle}>Ready to test your knowledge?</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Match')}
                    style={styles.start_button}
                >
                    <Text style={styles.optionText}>Start Game</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}


function MatchScreen({route}) {
    const navigation = useNavigation();
    const {username} = useUser();
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const socket = useRef(null);
    const [gameOverInfo, setGameOverInfo] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [connected, setConnected] = useState(false);
    const [opponent, setOpponent] = useState(null);
    const [playerIndex, setPlayerIndex] = useState(null);
    const playerIndexRef = useRef(null);
    const [scores, setScores] = useState([0, 0]);
    const [timer, setTimer] = useState(10);
    const timerRef = useRef(null);
    const [wasCorrectAnswer, setWasCorrectAnswer] = useState(null);
    const [message, setMessage] = useState('Connecting to server...');
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const question = shuffledQuestions[currentQuestionIndex];

    function shuffleArray(array) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    useEffect(() => {
        socket.current = new WebSocket('ws://192.168.1.155:8080');
        socket.current.onopen = () => {
            setConnected(true);
            socket.current.send(JSON.stringify({type: 'join', username}));
            setMessage('Waiting for opponent...');
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'gameover':
                    console.log('Received gameover data:', data); // Проверьте полученные данные
                    setGameOverInfo({
                        yourScore: data.yourScore,
                        opponentScore: data.opponentScore,
                    });
                    break;
                case 'start':
                    setSelectedAnswerIndex(null);
                    setPlayerIndex(data.playerIndex);
                    playerIndexRef.current = data.playerIndex;
                    setOpponent(data.opponent);
                    setScores(data.scores);

                    const indices = data.questionOrder;
                    const ordered = indices.map(i => QUESTIONS[i]);
                    setShuffledQuestions(ordered);

                    setCurrentQuestionIndex(0);
                    setHasAnswered(false);
                    setMessage('Match started!');
                    startTimer();
                    break;
                case 'answer':
                    const myIndex = playerIndexRef.current;
                    if (data.playerIndex !== myIndex) {
                        setScores(data.scores);
                        setMessage(data.correct
                            ? '❌ Opponent answered correctly'
                            : 'Opponent answered incorrectly!');
                        return;
                    }

                    if (data.correct) {
                        setScores(data.scores);
                        setWasCorrectAnswer(true);
                        setMessage(`✅ Correct!`);
                    } else {
                        setScores(data.scores);
                        setWasCorrectAnswer(false);
                        setMessage('❌ Wrong!');
                    }
                    break;
                case 'next':
                    setCurrentQuestionIndex(data.questionIndex);
                    setHasAnswered(false);
                    setMessage('');
                    setWasCorrectAnswer(null);
                    setSelectedAnswerIndex(null);
                    startTimer();
                    break;
                default:
                    break;
            }
        };

        return () => {
            socket.current?.close();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startTimer = () => {
        setTimer(10);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setHasAnswered(true);
                    socket.current.send(JSON.stringify({type: 'answer', answerIndex: -1}));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    const handleBackToLobby = () => {
        setGameOverInfo(null);
        setScores([0, 0]);
        setCurrentQuestionIndex(0);

        // Переход в лобби
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Lobby'}],
            })
        );
    };

    const answer = (idx) => {
        if (hasAnswered) return;
        setHasAnswered(true);
        setSelectedAnswerIndex(idx);

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        if (!currentQuestion) {
            setMessage('No more questions.');
            return;
        }

        socket.current.send(JSON.stringify({type: 'answer', answerIndex: idx}));
    };

    return (
        <View style={styles.container}>
            {gameOverInfo && (
                <GameOverScreen gameOverInfo={gameOverInfo} onBackToLobby={handleBackToLobby}/>
            )}
            {!gameOverInfo && question && (
                <>
                    <Text style={{fontSize: 18, textAlign: 'center', marginBottom: 10}}>
                        Time left: {timer} sec
                    </Text>

                    <Text style={styles.question_text}>{question.question}</Text>
                    {question.options.map((opt, idx) => {
                        let buttonStyle = [styles.optionButton];
                        const correctIndex = question.answer;

                        if (hasAnswered) {
                            if (idx === correctIndex) {
                                buttonStyle.push(styles.correctButton);
                            } else if (idx === selectedAnswerIndex && idx !== correctIndex) {
                                buttonStyle.push(styles.wrongButton);
                            } else {
                                buttonStyle.push(styles.inactiveButton);
                            }
                        }

                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => answer(idx)}
                                disabled={hasAnswered}
                                style={buttonStyle}
                            >
                                <Text style={styles.optionText}>{opt}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    <Text>Scores: You - {scores[playerIndex]} | Opponent - {scores[1 - playerIndex]}</Text>
                </>
            )}
        </View>
    );
}

export default () => {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Lobby">
                    <Stack.Screen
                        name="Lobby"
                        options={{headerShown: false}}
                        component={LobbyScreen}
                    />
                    <Stack.Screen name="Match" options={{headerShown: false}} component={MatchScreen}/>
                    <Stack.Screen name="Leaderboard" options={{headerShown: false}} component={LeaderboardScreen}/>
                </Stack.Navigator>
                <StatusBar hidden={true}/>
            </NavigationContainer>
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    start_point: {
        width: 300,
        height: 300,
        marginTop: 0,
        marginBottom: 2,
        alignSelf: 'center',
        resizeMode: 'contain',
    },

    container_start: {
        justifyContent: 'center',
        padding: 20,
        color: '#FEF200',

    },

    leaderboardIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',

    },

    container: {
        justifyContent: 'center',
        padding: 2,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 50,
        fontWeight: '500',

    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
        color: '#FFFFFF'
    },

    scoreContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        zIndex: 2,
    },

    scoreIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        marginRight: 6,
    },

    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },

    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        color: '#000000',
        borderRadius: 8
    },
    item: {
        fontSize: 18,
        marginVertical: 5,
        color: '#000000'
    },

    start_button:
        {
            backgroundColor: '#FFFFFF',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginVertical: 10,
            alignItems: 'center',
            marginBottom: '30'

        },
    question_text: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
        color: '#000000'
    },
    optionButton: {
        backgroundColor: '#FEF200',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginVertical: 10,
        alignItems: 'center',
        marginBottom: '30'
    },
    optionInner: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    optionText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600'
    },
    correctButton: {
        backgroundColor: '#4CAF50'
    },
    wrongButton: {
        backgroundColor: '#F44336'
    },
    inactiveButton: {
        backgroundColor: '#D3D3D3'
    },
    lobbyContainer: {
        flex: 1,
        // backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    lobbyContent: {
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    leaderboardButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'transparent',
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        zIndex: 2
    },
});
