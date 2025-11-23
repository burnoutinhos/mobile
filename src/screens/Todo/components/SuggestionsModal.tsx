import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Chip, IconButton, Divider } from "react-native-paper";
import { CustomModal } from "../../../components/Modal";
import { MergedTheme } from "../../../theme/types";
import { useTranslation } from "react-i18next";

interface Suggestion {
  suggestion: string;
}

interface SuggestionsModalProps {
  visible: boolean;
  onDismiss: () => void;
  suggestions: Suggestion[];
  theme: MergedTheme;
}

export const SuggestionsModal = ({
  visible,
  onDismiss,
  suggestions,
  theme,
}: SuggestionsModalProps) => {
  const { t } = useTranslation();

  return (
    <CustomModal
      visible={visible}
      onDismiss={onDismiss}
      title={t("todo.suggestions")}
      showCloseButton
      dismissable
      i18nIsDynamicList
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconButton
            icon="lightbulb-on"
            size={24}
            iconColor={theme.colors.primary}
            style={{ margin: 0 }}
          />
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurface,
              flex: 1,
              opacity: 0.8,
            }}
          >
            {t("todo.suggestionsDescription")}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.suggestionsContainer}>
          <View style={styles.countBadge}>
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.onPrimaryContainer,
                fontWeight: "700",
              }}
            >
              {suggestions.length} {t("todo.total")}
            </Text>
          </View>

          {suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <View
                  style={[
                    styles.numberBadge,
                    {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                >
                  <Text
                    variant="labelSmall"
                    style={{
                      color: theme.colors.onPrimaryContainer,
                      fontWeight: "700",
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.suggestionTextContainer}>
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: theme.colors.onSurface,
                      lineHeight: 22,
                    }}
                  >
                    {suggestion.suggestion}
                  </Text>
                </View>
              </View>
              {index < suggestions.length - 1 && (
                <Divider style={styles.suggestionDivider} />
              )}
            </View>
          ))}
        </View>

        {suggestions.length === 0 && (
          <View style={styles.emptyState}>
            <IconButton
              icon="lightbulb-outline"
              size={48}
              iconColor={theme.colors.outline}
              style={{ margin: 0 }}
            />
            <Text
              variant="bodyLarge"
              style={{
                color: theme.colors.outline,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {t("todo.noSuggestions")}
            </Text>
          </View>
        )}
      </ScrollView>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 500,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  suggestionsContainer: {
    gap: 0,
  },
  countBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  suggestionCard: {
    marginBottom: 0,
  },
  suggestionHeader: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  suggestionTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  suggestionDivider: {
    marginLeft: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
});
