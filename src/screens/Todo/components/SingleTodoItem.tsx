import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  Card,
  Badge,
  Text,
  Chip,
  IconButton,
  Divider,
} from "react-native-paper";
import { ITodo } from "../../../model/todo/todo";
import { NavigationProp } from "@react-navigation/native";
import { AppParamList } from "../../../navigators/AppNavigator";
import { MergedTheme } from "../../../theme/types";
import { useTranslation } from "react-i18next";
import { EnumTypeTodo } from "../../../services/Enums";
import { SuggestionsModal } from "./SuggestionsModal";
import { DescriptionModal } from "./DescriptionModal";

export const SingleTodoItem = ({
  item: todo,
  navigation,
  theme,
}: {
  item: ITodo;
  navigation: NavigationProp<AppParamList>;
  theme: MergedTheme;
}) => {
  const { t } = useTranslation();
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const createdAtDate = new Date(todo.createdAt);
  const startDate = new Date(todo.start);
  const endDate = new Date(todo.end);
  const today = new Date();

  const isToday =
    createdAtDate.getDate() === today.getDate() &&
    createdAtDate.getMonth() === today.getMonth() &&
    createdAtDate.getFullYear() === today.getFullYear();

  const getTypeIcon = () => {
    switch (todo.type) {
      case EnumTypeTodo.FOCUS_MODE:
        return "brain";
      case EnumTypeTodo.REST:
        return "coffee";
      default:
        return "checkbox-marked-circle";
    }
  };

  const getTypeColors = () => {
    switch (todo.type) {
      case EnumTypeTodo.FOCUS_MODE:
        return {
          container: theme.colors.tertiaryContainer,
          onContainer: theme.colors.onTertiaryContainer,
          main: theme.colors.tertiary,
        };
      case EnumTypeTodo.REST:
        return {
          container: theme.colors.secondaryContainer,
          onContainer: theme.colors.onSecondaryContainer,
          main: theme.colors.secondary,
        };
      default:
        return {
          container: theme.colors.primaryContainer,
          onContainer: theme.colors.onPrimaryContainer,
          main: theme.colors.primary,
        };
    }
  };

  const typeColors = getTypeColors();

  const formatDateRange = () => {
    const start = startDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
    const end = endDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
    return `${start} - ${end}`;
  };

  return (
    <>
      <Pressable onPress={() => navigation.navigate("TodoPage", { todo })}>
        <Card
          key={todo.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
          mode="elevated"
          elevation={2}
        >
          <Card.Content style={styles.cardContent}>
            {/* Header com ícone, título e status */}
            <View style={styles.headerRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: typeColors.container },
                ]}
              >
                <IconButton
                  icon={getTypeIcon()}
                  size={20}
                  iconColor={typeColors.onContainer}
                  style={styles.typeIcon}
                />
              </View>

              <View style={styles.headerTextContainer}>
                <View style={styles.titleRow}>
                  <Text
                    variant="titleMedium"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      fontWeight: "700",
                      flex: 1,
                    }}
                    numberOfLines={2}
                  >
                    {todo.name}
                  </Text>
                  {isToday && (
                    <Badge
                      size={8}
                      style={{
                        backgroundColor: theme.colors.primary,
                        marginTop: 4,
                      }}
                    />
                  )}
                </View>

                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.typeChip,
                      { backgroundColor: typeColors.container },
                    ]}
                  >
                    <Text
                      variant="labelSmall"
                      style={{
                        color: typeColors.onContainer,
                        fontSize: 10,
                        fontWeight: "600",
                      }}
                    >
                      {todo.type === EnumTypeTodo.FOCUS_MODE
                        ? t("todo.typeFocusMode")
                        : todo.type === EnumTypeTodo.REST
                          ? t("todo.typeRest")
                          : t("todo.typeTask")}
                    </Text>
                  </View>

                  <View style={styles.statusIndicator}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: todo.isCompleted
                            ? theme.colors.tertiary
                            : theme.colors.surfaceDisabled,
                        },
                      ]}
                    />
                    <Text
                      variant="bodySmall"
                      style={{
                        color: todo.isCompleted
                          ? theme.colors.tertiary
                          : theme.colors.onSurfaceVariant,
                        fontSize: 10,
                        fontWeight: "500",
                      }}
                    >
                      {todo.isCompleted
                        ? t("todo.completed")
                        : t("todo.inProgress")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Descrição */}
            {todo.description && (
              <>
                <Divider style={styles.divider} />
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowDescriptionModal(true);
                  }}
                  style={styles.descriptionButton}
                >
                  <View style={styles.descriptionHeader}>
                    <IconButton
                      icon="text-box-outline"
                      size={16}
                      iconColor={theme.colors.secondary}
                      style={{ margin: 0 }}
                    />
                    <Text
                      variant="labelMedium"
                      style={{
                        color: theme.colors.secondary,
                        fontWeight: "600",
                        flex: 1,
                      }}
                    >
                      {t("todo.description")}
                    </Text>
                    <IconButton
                      icon="chevron-right"
                      size={16}
                      iconColor={theme.colors.secondary}
                      style={{ margin: 0 }}
                    />
                  </View>
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      lineHeight: 20,
                      opacity: 0.7,
                      paddingLeft: 8,
                    }}
                    numberOfLines={2}
                  >
                    {todo.description}
                  </Text>
                </Pressable>
              </>
            )}

            {/* Data */}
            <View style={styles.dateContainer}>
              <IconButton
                icon="calendar-range"
                size={14}
                iconColor={theme.colors.primary}
                style={styles.dateIcon}
              />
              <Text
                variant="bodySmall"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  opacity: 0.7,
                }}
              >
                {formatDateRange()}
              </Text>
            </View>

            {/* Sugestões */}
            {todo.suggestions && todo.suggestions.length > 0 && (
              <>
                {!todo.description && <Divider style={styles.divider} />}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowSuggestionsModal(true);
                  }}
                  style={styles.suggestionsButton}
                >
                  <View style={styles.suggestionsHeader}>
                    <IconButton
                      icon="lightbulb-on"
                      size={16}
                      iconColor={theme.colors.primary}
                      style={{ margin: 0 }}
                    />
                    <Text
                      variant="labelMedium"
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "600",
                        flex: 1,
                      }}
                    >
                      {t("todo.suggestions")} ({todo.suggestions.length})
                    </Text>
                    <IconButton
                      icon="chevron-right"
                      size={16}
                      iconColor={theme.colors.primary}
                      style={{ margin: 0 }}
                    />
                  </View>

                  <View style={styles.suggestionsPreview}>
                    {todo.suggestions.slice(0, 2).map((suggestion, index) => (
                      <View key={index} style={styles.suggestionItem}>
                        <View
                          style={[
                            styles.bulletPoint,
                            { backgroundColor: theme.colors.primary },
                          ]}
                        />
                        <Text
                          variant="bodySmall"
                          style={{
                            color: theme.colors.onSurfaceVariant,
                            flex: 1,
                            opacity: 0.7,
                          }}
                          numberOfLines={1}
                        >
                          {suggestion.suggestion}
                        </Text>
                      </View>
                    ))}
                    {todo.suggestions.length > 2 && (
                      <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.primary,
                          fontWeight: "600",
                          marginLeft: 12,
                        }}
                      >
                        +{todo.suggestions.length - 2} {t("todo.more")}
                      </Text>
                    )}
                  </View>
                </Pressable>
              </>
            )}
          </Card.Content>
        </Card>
      </Pressable>

      <SuggestionsModal
        visible={showSuggestionsModal}
        onDismiss={() => setShowSuggestionsModal(false)}
        suggestions={todo.suggestions || []}
        theme={theme}
      />

      <DescriptionModal
        visible={showDescriptionModal}
        onDismiss={() => setShowDescriptionModal(false)}
        description={todo.description || ""}
        taskName={todo.name}
        theme={theme}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    borderRadius: 12,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  typeIcon: {
    margin: 0,
  },
  headerTextContainer: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  dateIcon: {
    margin: 0,
    marginLeft: -8,
  },
  divider: {
    marginVertical: 12,
  },
  descriptionButton: {
    marginTop: 4,
    marginBottom: 12,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  suggestionsButton: {
    marginTop: 4,
  },
  suggestionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  suggestionsPreview: {
    gap: 6,
    paddingLeft: 8,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
