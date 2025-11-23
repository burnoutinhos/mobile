import Pagination from "@cherry-soft/react-native-basic-pagination";
import { StyleSheet, View } from "react-native";
import { PageableResponse } from "../../../../model/types";
import { ITimeBlock } from "../../../../model/timeblocks/Timeblock";
import { FAB } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { AppParamList } from "../../../../navigators/AppNavigator";
import { useState } from "react";

interface TimeBlocksFooterProps {
  pagedTimeblocks?: PageableResponse<ITimeBlock>;
  page: number;
  setPage: (page: number) => void;
}

export const TimeBlocksFooter = ({
  pagedTimeblocks,
  page,
  setPage,
}: TimeBlocksFooterProps) => {
  if (!pagedTimeblocks || pagedTimeblocks.totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.paginationContainer}>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        pageSize={pagedTimeblocks.size}
        totalItems={pagedTimeblocks.totalElements}
        showLastPagesButtons={pagedTimeblocks.totalPages > 5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  fabGroup: { position: "absolute", right: 16, bottom: 24 },
});
