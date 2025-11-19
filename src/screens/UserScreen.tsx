import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "../context/ThemeProvider";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../model/user/user";
import { useEffect, useState } from "react";
import FormEditUser from "../components/FormEditUser";
import { EnumLanguage } from "../services/Enums";
import { useMutation } from "@tanstack/react-query";
import { queryKeys } from "../services/api/query-keys";
import api from "../services/api";
import { endpoints } from "../services/api/endpoints";

const UserScreen = () => {
  const { theme } = usePreferences();

  const { mutate, isPending, error, data } = useMutation({
    mutationKey: [queryKeys.user.user],
    mutationFn: async () => {
      return await api.get(endpoints.user.userInfo);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  const [user, setUser] = useState<IUser | undefined>(undefined);

  const getUser = async () => {
    const localUser = await AsyncStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      // nn sei oque colocar de erro
      return;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          padding: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {user?.profile_image ? (
            <Image
              width={150}
              height={150}
              source={{ uri: user?.profile_image }}
              style={{ borderRadius: 1000 }}
            />
          ) : (
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 1000,
                backgroundColor: theme.colors.card,
              }}
            />
          )}
        </View>

        <View style={{ width: "100%" }}>
          <FormEditUser user={userLocal} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    paddingVertical: 4,
  },
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
  },
  button: {
    alignSelf: "stretch",
    borderRadius: 8,
    paddingVertical: 6,
  },
});

export default UserScreen;
