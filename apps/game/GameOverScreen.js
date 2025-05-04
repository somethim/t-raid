import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const GameOverScreen = ({gameOverInfo, onBackToLobby}) => {
    const hasGameData = gameOverInfo &&
        gameOverInfo.yourScore !== undefined &&
        gameOverInfo.opponentScore !== undefined;

    const getResultText = () => {
        if (!hasGameData) return '';

        if (gameOverInfo.yourScore > gameOverInfo.opponentScore) {
            return 'You win! 🎉';
        } else if (gameOverInfo.yourScore < gameOverInfo.opponentScore) {
            return 'You lose! 😞';
        } else {
            return 'It\'s a tie! 🤝';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>🏁 Game Over</Text>

                {hasGameData && (
                    <>
                        <View style={styles.scoreRow}>
                            <View style={styles.scoreBox}>
                                <Text style={styles.scoreLabel}>You</Text>
                                <Text style={styles.scoreValue}>{gameOverInfo.yourScore}</Text>
                            </View>
                            <Text style={styles.vs}>VS</Text>
                            <View style={styles.scoreBox}>
                                <Text style={styles.scoreLabel}>Opponent</Text>
                                <Text style={styles.scoreValue}>{gameOverInfo.opponentScore}</Text>
                            </View>
                        </View>
                        <Text style={styles.resultText}>{getResultText()}</Text>
                    </>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={onBackToLobby}
                >
                    <Text style={styles.buttonText}>Back to Lobby</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: "row",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        height: "70%",
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '90%',
        height: "70%",
        maxWidth: 350,
        alignItems: 'center',
        // Тень для Android
        elevation: 4,
        // Тень для iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    scoreBox: {
        backgroundColor: '#F8F8F8',
        padding: 12,
        borderRadius: 8,
        width: '40%',
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    vs: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    resultText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#444',
        marginVertical: 15,
    },
    button: {
        backgroundColor: '#7D19EF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GameOverScreen;
