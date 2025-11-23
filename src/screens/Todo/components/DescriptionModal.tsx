import { ScrollView, StyleSheet, View } from "react-native";
import { Text, IconButton, Divider } from "react-native-paper";
import { CustomModal } from "../../../components/Modal";
import { MergedTheme } from "../../../theme/types";
import { useTranslation } from "react-i18next";

interface DescriptionModalProps {
  visible: boolean;
  onDismiss: () => void;
  description: string;
  taskName: string;
  theme: MergedTheme;
}

export const DescriptionModal = ({
  visible,
  onDismiss,
  description,
  taskName,
  theme,
}: DescriptionModalProps) => {
  const { t } = useTranslation();

  return (
    <CustomModal
      visible={visible}
      onDismiss={onDismiss}
      title={t("todo.descriptionTitle")}
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
            icon="text-box-outline"
            size={24}
            iconColor={theme.colors.primary}
            style={{ margin: 0 }}
          />
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              fontWeight: "600",
              flex: 1,
            }}
            numberOfLines={2}
          >
            {taskName}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.descriptionContainer}>
          <View
            style={[
              styles.descriptionCard,
              {
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
          >
            <Text
              variant="bodyLarge"
              style={{
                color: theme.colors.onSurfaceVariant,
                lineHeight: 24,
              }}
            >
              {description}
            </Text>
          </View>
        </View>
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
    marginBottom: 20,
  },
  descriptionContainer: {
    paddingBottom: 8,
  },
  descriptionCard: {
    padding: 16,
    borderRadius: 12,
  },
});
