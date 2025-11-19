import React from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, Text, Button, IconButton } from "react-native-paper";
import { usePreferences } from "../context/ThemeProvider";

interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  actions?: Array<{
    label: string;
    onPress: () => void;
    mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
    icon?: string;
    loading?: boolean;
    disabled?: boolean;
  }>;
  dismissable?: boolean;
}

export const CustomModal = ({
  visible,
  onDismiss,
  title,
  children,
  showCloseButton = true,
  actions,
  dismissable = true,
}: CustomModalProps) => {
  const { theme } = usePreferences();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
        dismissable={dismissable}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <View style={styles.header}>
            {title && (
              <Text
                variant="headlineSmall"
                style={[
                  styles.title,
                  { color: theme.colors.onSurface, flex: 1 },
                ]}
              >
                {title}
              </Text>
            )}
            {showCloseButton && (
              <IconButton
                icon="close"
                size={24}
                onPress={onDismiss}
                iconColor={theme.colors.onSurface}
                style={styles.closeButton}
              />
            )}
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>{children}</View>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <Button
                key={index}
                mode={action.mode || "text"}
                onPress={action.onPress}
                icon={action.icon}
                loading={action.loading}
                disabled={action.disabled}
                style={styles.actionButton}
                labelStyle={styles.actionLabel}
              >
                {action.label}
              </Button>
            ))}
          </View>
        )}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontWeight: "700",
  },
  closeButton: {
    margin: 0,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    maxHeight: "100%",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 12,
  },
  actionButton: {
    marginHorizontal: 0,
  },
  actionLabel: {
    marginHorizontal: 8,
  },
});
