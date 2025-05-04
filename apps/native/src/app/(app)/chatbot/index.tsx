import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SendIcon } from "@zennui/icons";
import { ChatBotIcon } from "@/assets/svg/chat";
import { H4 } from "@zennui/native/typography";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatScreen() {
  // Initialize with dummy messages - 2 user messages and 3 bot messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey, can you explain what inflation is?",
      isUser: true,
      timestamp: new Date("2025-05-04T10:00:00Z"),
    },
    {
      id: "2",
      text: "Sure! Inflation is the rate at which the general level of prices for goods and services rises, leading to a decrease in purchasing power.",
      isUser: false,
      timestamp: new Date("2025-05-04T10:00:05Z"),
    },
    {
      id: "3",
      text: "What causes inflation?",
      isUser: true,
      timestamp: new Date("2025-05-04T10:01:00Z"),
    },
    {
      id: "4",
      text: "Inflation can be caused by demand-pull factors (too much demand), cost-push factors (rising production costs), or monetary factors like excessive money supply.",
      isUser: false,
      timestamp: new Date("2025-05-04T10:01:10Z"),
    },
    {
      id: "5",
      text: "Is inflation always bad?",
      isUser: true,
      timestamp: new Date("2025-05-04T10:02:00Z"),
    },
    {
      id: "6",
      text: "Not necessarily. Moderate inflation is normal in a growing economy, but high or unpredictable inflation can be harmful.",
      isUser: false,
      timestamp: new Date("2025-05-04T10:02:10Z"),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "This is a sample response from the chat bot.",
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      <View className="bg-white pt-[60px] p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <ChatBotIcon className="mr-2 h-6 w-6" />
          <H4 className="text-xl font-semibold text-gray-900">Raifi</H4>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`flex-row my-1 ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <View
              className={`max-w-[80%] p-3 rounded-3xl mb-1 ${
                message.isUser
                  ? "bg-[#FFC107] rounded-tr-sm"
                  : "bg-white rounded-tl-sm"
              }`}
            >
              <Text
                className={`text-base font-normal ${
                  message.isUser ? "text-white" : "text-gray-900"
                }`}
              >
                {message.text}
              </Text>
              <Text className="text-xs text-gray-400 mt-1 font-normal">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row p-4 bg-white border-t border-gray-200 items-end bottom-0">
        <TextInput
          className="flex-1 bg-gray-100 rounded-3xl p-3 mr-2 max-h-[100px] font-normal text-base text-gray-900"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          className="bg-[#FFC107] w-11 h-11 rounded-full justify-center items-center"
          onPress={sendMessage}
        >
          <SendIcon width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
