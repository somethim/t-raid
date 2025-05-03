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
import { Link } from "expo-router";
import type { SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { z } from "zod";
import { H1, H4 } from "@zennui/native/typography";
import { Header } from "@/components/general/header";

const getSignInFormConfig = (t: ReturnType<typeof useTranslation>["t"]) => {
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
  const { signIn } = useAuthActions();
  const { handle: handleSignIn, isPending } = useAsyncHandler(signIn);
  const { t } = useTranslation("", { keyPrefix: "sign-in" });
  const { top, bottom } = useInsets({
    applyNavbarBottomOffset: false,
  });

  const config = getSignInFormConfig(t);
  const handleFormSubmit: SubmitHandler<
    InferredFormFields<typeof config>
  > = async (data) => {
    try {
      await handleSignIn("traid", {
        ...data,
        flow: "sign-in",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign in failed";
      let formattedSignInError: string;

      switch (true) {
        case errorMessage.includes("InvalidAccountId"):
          formattedSignInError = t("email-not-found");
          break;
        case errorMessage.includes("InvalidSecret"):
          formattedSignInError = t("incorrect-password");
          break;
        case errorMessage.includes("TooManyFailedAttempts"):
          formattedSignInError = t("too-many-failed-attempts");
          break;
        default:
          formattedSignInError = t("sign-in-error");
          break;
      }

      toast.error(formattedSignInError);
    }
  };

  return (
    <View className={"flex-row flex-wrap"}>
      <Header title={t("title")} variant={"primary"} />
      <View
        style={{ paddingTop: top, borderRadius: 16 }}
        className={"px-6 w-fit rounded-2xl"}
      >
        <H1 className={"color-primary"}>{t("welcome")}</H1>
        <H4 className={"color-primary"}>{t("greet")}</H4>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: bottom }}
        >
          <View className="gap-6 px-6">
            <InferredForm
              config={config}
              onSubmit={(data) => handleFormSubmit(data)}
              className="gap-4"
            >
              <FormSubmitButton
                disabled={isPending}
                className={"w-full flex-row gap-2 border-0"}
                style={{
                  backgroundColor: "#FFCC00",
                }}
              >
                {isPending && (
                  <View className="animate-spin">
                    <LoadingIcon className="text-foreground" />
                  </View>
                )}
                <Text className="font-normal">
                  {isPending ? t("signing-in") : t("sign-in")}
                </Text>
              </FormSubmitButton>
              <Link href={"/sign-up"} asChild>
                <Text className="self-start text-xl color-primary">
                  {t("don't-have-account")}
                  <Text className="font-body-bold text-xl">
                    {t("register")}
                  </Text>
                </Text>
              </Link>
            </InferredForm>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
