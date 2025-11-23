import { useState } from "react";
import { usePreferences } from "../../../context/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/api/query-keys";
import { PageableResponse } from "../../../model/types";
import { ITimeBlock } from "../../../model/timeblocks/Timeblock";
import { endpoints } from "../../../services/api/endpoints";
import api from "../../../services/api";

export const useTimeblock = () => {
  const [page, setPage] = useState(0);
  const [fabOpen, setFabOpen] = useState<boolean>(false);

  const pageSize = 10;

  const {
    data: pagedTimeblocks,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [queryKeys.timeblock.findAll, page],
    queryFn: async () => {
      const res = await api.get<PageableResponse<ITimeBlock>>(
        endpoints.timeblock.findMe(page, pageSize),
      );
      return res.data;
    },
  });

  return {
    page,
    setPage,
    pagedTimeblocks,
    isLoading,
    refetch,
    isFetching,
    fabOpen,
    setFabOpen,
  };
};
