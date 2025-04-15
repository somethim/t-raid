import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

export default () => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        inputMode="email"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title="Sign in"
        onPress={() => {
          void signIn("password", { email, password });
        }}
      />
    </View>
  );
};
