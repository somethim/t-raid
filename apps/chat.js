import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "axios";

export default function Chat() {
  const [input, setInput] = useState("");
  const content =
    "You are a professional financial assistant integrated into a mobile banking app. Your role is to assist users with any questions related to personal and business finance, including credit cards, personal loans, mortgages, refinancing, credit scoring, interest calculations, repayment schedules, and loan eligibility. You are highly knowledgeable in consumer and corporate credit, banking regulations, financial planning, and risk assessment. You can perform accurate and detailed financial calculations. Respond clearly and concisely, using simple terms whenever possible. Always be polite and professional. If a user's question is outside the financial domain, gently redirect them back to banking-related topics. When appropriate, include examples or short calculations to help users understand financial concepts.";
  const systemMessage = {
    role: "system",
    content: content,
  };
  const [messages, setMessages] = useState([systemMessage]);
  const [loading, setLoading] = useState(false);
  const API_KEY = "insecure";
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: updatedMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      const botMessage = response.data.choices[0].message;
      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error("Error with OpenAI request:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {" "}
      <ScrollView style={styles.chat}>
        {" "}
        {messages
          .filter((msg) => msg.role !== "system")
          .map((msg, index) => (
            <Text
              key={index}
              style={msg.role === "user" ? styles.user : styles.bot}
            >
              {" "}
              {msg.content}{" "}
            </Text>
          ))}{" "}
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={input}
        onChangeText={setInput}
      />{" "}
      <Button
        title={loading ? "Loading..." : "Send"}
        onPress={sendMessage}
        disabled={loading}
      />{" "}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 50 },
  chat: { flex: 1, marginBottom: 10 },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#E1E1E1",
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
});
