import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

export default function useAgentsFilter() {
  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE_NUMBER)
      .withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });

  return {
    filters,
    setFilters,
  };
}
