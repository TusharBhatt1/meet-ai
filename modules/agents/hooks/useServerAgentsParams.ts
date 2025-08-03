import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const coordinatesSearchParams = {
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE_NUMBER)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
