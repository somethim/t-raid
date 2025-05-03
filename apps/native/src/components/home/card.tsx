import { Image } from "expo-image";
import { Link } from "expo-router";

export const Card = () => {
  return (
    <Link href={"/preferences"} asChild>
      <Image
        source={require("@/assets/images/Group 268.png")}
        className={"w-full h-72 my-8"}
      />
    </Link>
  );
};
