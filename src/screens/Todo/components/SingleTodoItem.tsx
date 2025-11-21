import { Pressable, StyleSheet, View } from "react-native";
import { Card, Badge, Text } from "react-native-paper";
import { ITodo } from "../../../model/todo/todo";
import { NavigationProp } from "@react-navigation/native";
import { AppParamList } from "../../../navigators/AppNavigator";
import { MergedTheme } from "../../../theme/types";

export const SingleTodoItem = ({
  item: todo,
  navigation,
  theme,
}: {
  item: ITodo;
  navigation: NavigationProp<AppParamList>;
  theme: MergedTheme;
}) => {
  const createdAtDate = new Date(todo.createdAt);
  const today = new Date();

  const isToday =
    createdAtDate.getDate() === today.getDate() &&
    createdAtDate.getMonth() === today.getMonth() &&
    createdAtDate.getFullYear() === today.getFullYear();

  return (
    <Pressable onPress={() => navigation.navigate("TodoPage", { todo })}>
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
                {todo.name}
              </Text>
              {isToday && (
                <Badge
                  size={8}
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
            </View>
          }
          subtitle={createdAtDate.toLocaleDateString('pt-BR')}
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
  );
};

const styles = StyleSheet.create({
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
