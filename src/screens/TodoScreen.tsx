import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { queryKeys } from "../services/api/query-keys";
import { endpoints } from "../services/api/endpoints";
import api from "../services/api";
import { ITodo } from "../model/todo/todo";
import { useEffect } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Badge, Button, Card, IconButton, Text } from "react-native-paper";
import { usePreferences } from "../context/ThemeProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackParamsList } from "../navigators/StackNavigator";

const TodoScreen = () => {
  const { theme } = usePreferences();

  const navigation = useNavigation<NavigationProp<StackParamsList>>();

  const navTo = (data: ITodo) => {
    navigation.navigate("TodoPage", { todo: data });
  };

  const {
    data: todos,
    isLoading,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: [queryKeys.todo.findAll],
    queryFn: async () => {
      const res = await api.get<ITodo[]>(endpoints.todo.findAll);
      return res.data;
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerActions}></View>
      </View>

      {todos && todos.length === 0 ? (
        <View style={styles.empty}>
          <IconButton
            icon="bell-off-outline"
            size={64}
            iconColor={theme.colors.outline}
          />
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceDisabled, marginTop: 8 }}
          >
            Nenhuma notificação
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.background}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {todos &&
            todos.map((todo) => (
              <Pressable onPress={()=>navTo(todo)}>
                <Card
                  key={todo.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.colors.inverseOnSurface,
                    },
                  ]}
                  mode="elevated"
                >
                  <Card.Title
                    title={
                      <View style={styles.titleRow}>
                        <Text
                          variant="titleMedium"
                          style={{
                            flex: 1,
                            color: theme.colors.onBackground,
                          }}
                        >
                          {todo.description}
                        </Text>
                        {todo.createdAt.getDay() === new Date().getDay() && (
                          <Badge
                            size={8}
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                        )}
                      </View>
                    }
                    subtitle={todo.createdAt.toDateString()}
                    subtitleStyle={{
                      marginTop: 4,
                      color: theme.colors.onBackground,
                    }}
                  />
                  <Card.Content style={styles.cardContent}>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {todo.description}
                    </Text>
                  </Card.Content>
                </Card>
              </Pressable>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardContent: {
    paddingTop: 0,
  },
});

export default TodoScreen;
