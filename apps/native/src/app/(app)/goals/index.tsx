import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  const [priority, setPriority] = React.useState("high");

  const PriorityButton = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        priority === value && styles.priorityButtonActive,
      ]}
      onPress={() => setPriority(value)}
    >
      <Text style={styles.priorityButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Goal</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Name</Text>
            <TextInput style={styles.input} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Cost</Text>
              <TextInput style={styles.input} keyboardType="numeric" />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>End Date</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityGroup}>
              <PriorityButton value="high" label="High" />
              <PriorityButton value="medium" label="Medium" />
              <PriorityButton value="low" label="Low" />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebebeb",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: "#adadad",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#adadad",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfInput: {
    width: "48%",
  },
  priorityGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    width: "30%",
    height: 34,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#adadad",
    justifyContent: "center",
    alignItems: "center",
  },
  priorityButtonActive: {
    backgroundColor: "#ede3a8",
    borderColor: "#e6d987",
  },
  priorityButtonText: {
    fontSize: 13,
    color: "black",
  },
  confirmButton: {
    backgroundColor: "#ede3a8",
    borderRadius: 30,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
});
