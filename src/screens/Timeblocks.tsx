import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "../context/ThemeProvider";

export const Timeblocks = () => {
  const { theme } = usePreferences();

  return (
    <SafeAreaView>
      <Text>Timeblocks</Text>
    </SafeAreaView>
  );
};
