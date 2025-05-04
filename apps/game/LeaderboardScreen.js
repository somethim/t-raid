import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // иконка стрелки
import { StatusBar } from "expo-status-bar";
import { WS_URL } from "./config";

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const [leaderboard, setLeaderboard] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket(WS_URL);
    socket.current.onopen = () => {
      console.log("Connected to server");
      fetchLeaderboard();
    };
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "leaderboard") {
        setLeaderboard(data.leaderboard);
      }
    };
    return () => {
      socket.current?.close();
    };
  }, []);

  const fetchLeaderboard = () => {
    if (socket.current) {
      socket.current.send(JSON.stringify({ type: "getLeaderboard" }));
    }
  };

  return (
    <>
      <StatusBar hidden={true} />

      <View style={styles.screenWrapper}>
        <View style={styles.leaderboardCard}>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
            >
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Global Leaderboard</Text>
          </View>

          {leaderboard.length > 0 ? (
            <>
              {/* Podium section */}
              <View style={styles.podiumSection}>
                <View style={styles.podiumContainer}>
                  {leaderboard[1] && (
                    <View style={[styles.podiumItem, styles.podiumItem2]}>
                      <Image
                        source={require("./components/ui/second_place.png")}
                        style={styles.podiumIcon}
                      />
                      <Text style={styles.podiumUser}>
                        {leaderboard[1].username}
                      </Text>
                      <Text style={styles.podiumScore}>
                        {leaderboard[1].score} pts
                      </Text>
                    </View>
                  )}
                  {leaderboard[0] && (
                    <View style={[styles.podiumItem, styles.podiumItem1]}>
                      <Image
                        source={require("./components/ui/first_place.png")}
                        style={styles.podiumIcon}
                      />
                      <Text style={styles.podiumUser}>
                        {leaderboard[0].username}
                      </Text>
                      <Text style={styles.podiumScore}>
                        {leaderboard[0].score} pts
                      </Text>
                    </View>
                  )}
                  {leaderboard[2] && (
                    <View style={[styles.podiumItem, styles.podiumItem3]}>
                      <Image
                        source={require("./components/ui/third_place.png")}
                        style={styles.podiumIcon}
                      />
                      <Text style={styles.podiumUser}>
                        {leaderboard[2].username}
                      </Text>
                      <Text style={styles.podiumScore}>
                        {leaderboard[2].score} pts
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Lower section */}
              <View style={styles.rowsSection}>
                <FlatList
                  data={leaderboard.slice(3)}
                  renderItem={({ item, index }) => (
                    <View style={styles.rowCard}>
                      <Text style={styles.rowText}>
                        #{index + 4} {item.username} {item.score} pts
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.username}
                />
              </View>
            </>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40, fontSize: 16 }}>
              No scores yet. Be the first to play!
            </Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: "#D1C8DB",
    justifyContent: "flex-start", // Чтобы контент начинался с верхней части экрана
    alignItems: "stretch", // Заставляет содержимое растягиваться по ширине
    margin: 0,
    padding: 0, // Убираем любые отступы
    // paddingTop: 40, // Добавляем небольшой отступ сверху для компенсации статус-бара
  },

  leaderboardCard: {
    flex: 1, // Растягиваем на весь экран
    backgroundColor: "#FFFFFF",
    // borderRadius: 30,
    overflow: "hidden",
    margin: 0, // Убираем маргин по краям
    padding: 0, // Убираем паддинг
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    // marginVertical: 20,
    textAlign: "center",
    color: "#FFFFFF",
    backgroundColor: "#7D19EF",
    paddingTop: 40, // Убедись, что добавлен минимальный отступ сверху
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
  },

  podiumSection: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    alignItems: "flex-end",
  },
  podiumItem: {
    alignItems: "center",
    width: 100,
    height: 190,
    paddingLeft: 30,
    paddingRight: 30,
  },
  podiumItem1: {
    marginBottom: 20,
  },
  podiumItem2: {
    marginBottom: 10,
    marginLeft: 10,
  },
  podiumItem3: {
    marginBottom: 0,
    marginRight: 20,
  },
  podiumIcon: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 6,
  },
  podiumUser: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    color: "#000",
  },
  podiumScore: {
    fontSize: 12,
    color: "#555",
  },
  rowsSection: {
    flex: 1,
    backgroundColor: "#D1C8DB",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 16,
    paddingLeft: 0, // Убираем отступы слева
    paddingRight: 0, // Убираем отступы справа
    paddingBottom: 0, // Убираем отступы снизу
  },

  rowCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  rowText: {
    fontSize: 16,
    color: "#000",
  },
});
