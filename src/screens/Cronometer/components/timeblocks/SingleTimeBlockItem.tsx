import { Pressable, StyleSheet, View } from "react-native";
import { Card, Text, IconButton, Chip } from "react-native-paper";
import { ITimeBlock } from "../../../../model/timeblocks/Timeblock";
import { NavigationProp } from "@react-navigation/native";
import { AppParamList } from "../../../../navigators/AppNavigator";
import { MergedTheme } from "../../../../theme/types";

interface SingleTimeBlockItemProps {
  item: ITimeBlock;
  navigation: NavigationProp<AppParamList>;
  theme: MergedTheme;
}

export const SingleTimeBlockItem = ({
  item,
  navigation,
  theme,
}: SingleTimeBlockItemProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${pad(minutes)}:${pad(secs)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Pressable
      onPress={() => navigation.navigate("Cronometer", { timeblock: item })}
    >
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
        mode="elevated"
      >
        <Card.Title
          title={
            <View style={styles.titleRow}>
              <Text
                variant="titleMedium"
                style={{
                  flex: 1,
                  color: theme.colors.onSurfaceVariant,
                  fontWeight: "600",
                }}
                numberOfLines={1}
              >
                {item.name || "Sem nome"}
              </Text>
              <Chip
                mode="flat"
                compact
                style={{
                  backgroundColor:
                    item.type === "CRONOMETER"
                      ? theme.colors.primaryContainer
                      : theme.colors.secondaryContainer,
                }}
                textStyle={{
                  color:
                    item.type === "CRONOMETER"
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSecondaryContainer,
                  fontSize: 11,
                }}
              >
                {item.type === "CRONOMETER" ? "Cronômetro" : "Temporizador"}
              </Chip>
            </View>
          }
          subtitle={formatDate(item.createdAt)}
          subtitleStyle={{
            marginTop: 4,
            color: theme.colors.outline,
            fontSize: 12,
          }}
        />
        <Card.Content style={styles.cardContent}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <IconButton
                icon="clock-outline"
                size={20}
                iconColor={theme.colors.primary}
                style={styles.infoIcon}
              />
              <View>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.outline }}
                >
                  Tempo registrado
                </Text>
                <Text
                  variant="titleMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontWeight: "bold",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {formatTime(item.timeCount)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <IconButton
                icon="target"
                size={20}
                iconColor={theme.colors.secondary}
                style={styles.infoIcon}
              />
              <View>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.outline }}
                >
                  Meta
                </Text>
                <Text
                  variant="titleMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontWeight: "bold",
                  }}
                >
                  {item.max} min
                </Text>
              </View>
            </View>
          </View>

          {item.todo && (
            <View style={styles.todoContainer}>
              <IconButton
                icon="checkbox-marked-circle-outline"
                size={16}
                iconColor={theme.colors.tertiary}
                style={styles.todoIcon}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
                numberOfLines={1}
              >
                Tarefa: {item.todo.name}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardContent: {
    paddingTop: 8,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  infoIcon: {
    margin: 0,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.12)",
    marginHorizontal: 8,
  },
  todoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  todoIcon: {
    margin: 0,
  },
});
