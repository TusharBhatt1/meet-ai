import { DEFAULT_PAGE_NUMBER } from "@/constants";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { MeetingStatus } from "../types";

export const coordinatesSearchParams = {
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE_NUMBER)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(MeetingStatus)),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
