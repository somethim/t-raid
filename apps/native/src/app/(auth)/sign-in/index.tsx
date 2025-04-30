import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Text } from "@zennui/native/text";
import { Link } from "expo-router";
import { View } from "@zennui/native/slot";
import { TextInput } from "react-native";
import { Button } from "@zennui/native/button";
import { useTranslation } from "react-i18next";

export default () => {
  const { signIn } = useAuthActions();
  const { t } = useTranslation("");
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
        color={"primary"}
        onPress={() => signIn("t-raid", { email, password })}
      >
        <Text
          className={"pointer-events-none border-0 font-header text-foreground"}
        >
          {t("routes.login")}
        </Text>
      </Button>

      <Link href={"/sign-up"} asChild>
        <Button color={"secondary"}>
          <Text
            className={
              "pointer-events-none border-0 font-header text-foreground"
            }
          >
            {t("routes.register")}
          </Text>
        </Button>
      </Link>
    </View>
  );
};
