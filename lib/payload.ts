import config from "@payload-config";
import { getPayload } from "payload";

/** Instância única do Payload para uso nos server components. */
export const getPayloadClient = () => getPayload({ config });
