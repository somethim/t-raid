import { Header } from "@/components/general/header";
import { useInsets } from "@/hooks/use-insets";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAsyncHandler } from "@zenncore/hooks";
import { LoadingIcon } from "@zennui/icons";
import { Button } from "@zennui/native/button";
import {
  field,
  type FormConfig,
  FormSubmitButton,
  InferredForm,
  type InferredFormFields,
} from "@zennui/native/form";
import { Text } from "@zennui/native/text";
import { makeRedirectUri } from "expo-auth-session";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { openAuthSessionAsync } from "expo-web-browser";
import type { SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { z } from "zod";

const getSignInFormConfig = (t: ReturnType<typeof useTranslation>["t"]) => {
  return {
    email: field({
      shape: "text",
      constraint: z
        .string({ required_error: t("email.required") })
        .email(t("email.invalid")),
      type: "email",
      label: t("email.label"),
      placeholder: t("email.placeholder"),
      autoCapitalize: "none",
      autoCorrect: false,
      className: "rounded-none border-0 px-0 text-2xl text-foreground",
      classList: {
        label: "text-3xl",
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
      label: t("password.label"),
      type: "password",
      autoCapitalize: "none",
      autoCorrect: false,
      autoComplete: "password",
      className: "rounded-none border-0 px-0 text-2xl text-foreground",
      classList: {
        label: "text-3xl",
        message: "text-lg",
        input: {
          input: "text-2xl placeholder:text-foreground-dimmed/40",
          passwordDecorator: "size-6",
        },
      },
    }),
  } satisfies FormConfig;
};

const redirectTo = makeRedirectUri({
  path: "sign-in",
});

export default () => {
  const { signIn } = useAuthActions();
  const { handle: handleSignIn, isPending } = useAsyncHandler(signIn);
  const { t } = useTranslation("", { keyPrefix: "sign-in" });
  const { top, bottom } = useInsets({
    applyNavbarBottomOffset: false,
  });

  const signInViaProvider = async (
    provider: "apple" | "google" | "facebook",
  ) => {
    const { redirect } = await signIn(provider, { redirectTo });

    if (!redirect) {
      toast.error(`Failed to sign in with ${provider}`);
      return;
    }

    const result = await openAuthSessionAsync(redirect.toString(), redirectTo);

    if (result.type !== "success") return;

    const { url } = result;

    const code = new URL(url).searchParams.get("code")!;

    await signIn(provider, { code });
  };

  const config = getSignInFormConfig(t);
  const handleFormSubmit: SubmitHandler<
    InferredFormFields<typeof config>
  > = async (data) => {
    try {
      await handleSignIn("TRaid", {
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
    <>
      <Header title={t("title")} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
      >
        <View className="gap-6 px-6">
          <InferredForm
            config={config}
            onSubmit={(data) => handleFormSubmit(data)}
            className="gap-4"
          >
            <FormSubmitButton
              disabled={isPending}
              className={"w-full flex-row gap-2"}
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
              <Text className="self-start text-xl">
                {t("don't-have-account")}{" "}
                <Text className="font-body-bold text-primary text-xl">
                  {t("register")}
                </Text>
              </Text>
            </Link>
          </InferredForm>
          <View className="my-4 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-foreground-dimmed" />
            <Text className="text-foreground text-lg">{t("or")}</Text>
            <View className="h-px flex-1 bg-foreground-dimmed" />
          </View>
          <View className="flex-row gap-4">
            <Button
              color={"primary"}
              variant={"soft"}
              onPress={() => signInViaProvider("apple")}
              className="flex-1"
            >
              <Image
                className="size-9"
                source={require("@/assets/images/logos/apple.svg")}
                contentFit="contain"
              />
            </Button>
            <Button
              color={"primary"}
              variant={"soft"}
              onPress={() => signInViaProvider("google")}
              className="flex-1"
            >
              <Image
                className="size-9"
                source={require("@/assets/images/logos/google.svg")}
                contentFit="contain"
              />
            </Button>
            <Button
              color={"primary"}
              variant={"soft"}
              onPress={() => signInViaProvider("facebook")}
              className="flex-1"
            >
              <Image
                className="size-9"
                source={require("@/assets/images/logos/facebook.svg")}
                contentFit="contain"
              />
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
