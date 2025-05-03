import { useInsets } from "@/hooks/use-insets";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAsyncHandler } from "@zenncore/hooks";
import { LoadingIcon } from "@zennui/icons";
import {
  field,
  type FormConfig,
  FormSubmitButton,
  InferredForm,
  type InferredFormFields,
} from "@zennui/native/form";
import { Text } from "@zennui/native/text";
import type { SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { z } from "zod";
import { H1, H4 } from "@zennui/native/typography";
import { Header } from "@/components/general/header";
import { useState } from "react";

type AuthMode = "sign-in" | "register";

const getAuthFormConfig = (t: ReturnType<typeof useTranslation>["t"]) => {
  return {
    email: field({
      shape: "text",
      constraint: z
        .string({ required_error: t("email.required") })
        .email(t("email.invalid")),
      type: "email",
      placeholder: t("email.placeholder"),
      autoCapitalize: "none",
      labelHidden: true,
      autoCorrect: false,
      className: "rounded-none border-0 px-0 text-2xl text-foreground",
      classList: {
        label: "text-3xl color-primary",
        message: "text-lg",
        input: {
          input: "text-2xl placeholder:text-foreground-dimmed/40",
        },
      },
    }),
    password: field({
      shape: "text",
      constraint: z
        .string({ required_error: t("password.required") })
        .min(8, t("password.short")),
      placeholder: t("password.placeholder"),
      type: "password",
      autoCapitalize: "none",
      autoCorrect: false,
      labelHidden: true,
      autoComplete: "password",
      className: "rounded-none border-0 px-0 text-2xl text-foreground",
      classList: {
        label: "text-3xl color-primary",
        message: "text-lg",
        input: {
          input: "text-2xl placeholder:text-foreground-dimmed/40",
          passwordDecorator: "size-6",
        },
      },
    }),
  } satisfies FormConfig;
};

export default () => {
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const { signIn } = useAuthActions();
  const { handle: handleAuth, isPending } = useAsyncHandler(signIn);
  const { t } = useTranslation("", { keyPrefix: "auth" });
  const { bottom } = useInsets({
    applyNavbarBottomOffset: false,
  });

  const config = getAuthFormConfig(t);

  const toggleAuthMode = () => {
    setAuthMode(authMode === "sign-in" ? "register" : "sign-in");
  };

  const handleFormSubmit: SubmitHandler<
    InferredFormFields<typeof config>
  > = async (data) => {
    try {
      await handleAuth("traid", {
        email: data.email,
        password: data.password,
        flow: authMode,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `${authMode} failed`;
      let formattedError: string;

      if (authMode === "sign-in") {
        switch (true) {
          case errorMessage.includes("InvalidAccountId"):
            formattedError = t("email-not-found");
            break;
          case errorMessage.includes("InvalidSecret"):
            formattedError = t("incorrect-password");
            break;
          case errorMessage.includes("TooManyFailedAttempts"):
            formattedError = t("too-many-failed-attempts");
            break;
          default:
            formattedError = t("sign-in-error");
            break;
        }
      } else {
        switch (true) {
          case errorMessage.includes("DuplicateAccount"):
            formattedError = t("email-already-exists");
            break;
          default:
            formattedError = t("register-error");
            break;
        }
      }

      toast.error(formattedError);
    }
  };

  const getPageTitle = () => {
    return authMode === "sign-in" ? t("sign-in.title") : t("register.title");
  };

  const getWelcomeText = () => {
    return authMode === "sign-in"
      ? t("sign-in.welcome")
      : t("register.welcome");
  };

  const getGreetText = () => {
    return authMode === "sign-in" ? t("sign-in.greet") : t("register.greet");
  };

  const getButtonText = () => {
    if (isPending) {
      return authMode === "sign-in"
        ? t("sign-in.signing-in")
        : t("register.registering");
    }
    return authMode === "sign-in"
      ? t("sign-in.sign-in")
      : t("register.register");
  };

  const getToggleText = () => {
    if (authMode === "sign-in") {
      return (
        <>
          {t("sign-in.dont-have-account")}
          <Text className="font-body-bold text-xl">
            {t("sign-in.register")}
          </Text>
        </>
      );
    } else {
      return (
        <>
          {t("register.already-have-account")}
          <Text className="font-body-bold text-xl">
            {t("register.sign-in")}
          </Text>
        </>
      );
    }
  };

  return (
    <View className="flex-row h-full" style={{ backgroundColor: "#FFE135" }}>
      <Header title={getPageTitle()} variant="primary" />
      <View className="bg-[#FFFDFF] h-full">
        <H1 className="px-6 pt-6 color-primary">{getWelcomeText()}</H1>
        <H4 className="px-6 mb-4 color-primary">{getGreetText()}</H4>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 30, paddingBottom: bottom }}
        >
          <View className="gap-6 px-6">
            <InferredForm
              config={config}
              onSubmit={(data) => handleFormSubmit(data)}
              className="gap-4"
              key={authMode} // Force remount when mode changes
            >
              <FormSubmitButton
                disabled={isPending}
                className="w-full flex-row gap-2 border-0"
                style={{
                  backgroundColor: "#FFCC00",
                }}
              >
                {isPending && (
                  <View className="animate-spin">
                    <LoadingIcon className="text-foreground" />
                  </View>
                )}
                <Text className="font-normal">{getButtonText()}</Text>
              </FormSubmitButton>

              <Pressable onPress={toggleAuthMode}>
                <Text className="self-start text-xl color-primary">
                  {getToggleText()}
                </Text>
              </Pressable>
            </InferredForm>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
