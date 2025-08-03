import { DEFAULT_PAGE_NUMBER } from "@/constants";
import {
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import { MeetingStatus } from "../types";

export default function useMeetingsFilter() {
  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE_NUMBER)
      .withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
  });

  return {
    filters,
    setFilters,
  };
}
