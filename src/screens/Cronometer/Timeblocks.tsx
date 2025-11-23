import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { queryKeys } from "../../services/api/query-keys";
import api from "../../services/api";
import { ITimeBlock } from "../../model/timeblocks/Timeblock";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";
import { usePreferences } from "../../context/ThemeProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppParamList } from "../../navigators/AppNavigator";
import {
  SingleTimeBlockItem,
  TimeBlocksHeader,
  TimeBlocksNotFound,
  TimeBlocksFooter,
} from "./components/timeblocks";
import { PageableResponse } from "../../model/types";
import { useState } from "react";
import { endpoints } from "../../services/api/endpoints";
import { useTimeblock } from "./controllers/TimeblockController";
import { useTranslation } from "react-i18next";

const Timeblocks = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const { theme } = usePreferences();

  const {
    isLoading,
    pagedTimeblocks,
    page,
    setPage,
    isFetching,
    refetch,
    fabOpen,
    setFabOpen,
  } = useTimeblock();

  if (isLoading && !pagedTimeblocks) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurface, marginTop: 16 }}
          >
            {t("cronometer.loadingRecords")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={pagedTimeblocks?.content || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SingleTimeBlockItem
            item={item}
            navigation={navigation}
            theme={theme}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isFetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
        ListEmptyComponent={() => <TimeBlocksNotFound theme={theme} />}
        ListHeaderComponent={
          <TimeBlocksHeader theme={theme} pagedTimeblocks={pagedTimeblocks} />
        }
        ListFooterComponent={() => (
          <TimeBlocksFooter
            page={page}
            setPage={setPage}
            pagedTimeblocks={pagedTimeblocks}
          />
        )}
      />
      <FAB.Group
        open={fabOpen}
        visible={true}
        actions={[
          {
            label: t("cronometer.addTimeBlock"),
            icon: "plus",
            onPress: () => navigation.navigate("Cronometer"),
          },
        ]}
        icon={fabOpen ? "pencil" : "plus"}
        onStateChange={({ open }) => setFabOpen(open)}
        style={styles.fabGroup}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  fabGroup: { position: "absolute", right: 16, bottom: 24 },
});

export default Timeblocks;
