
import { useMemo } from "react";
import { ServiceType } from "@bufbuild/protobuf";
import { createPromiseClient, createConnectTransport, PromiseClient } from "@bufbuild/connect-web";

const transport = createConnectTransport({
  baseUrl: "http://localhost:8080", // "https://zkmokubackend.onrender.com"
});

export function useClient<T extends ServiceType>(service: T): PromiseClient<T> {
  return useMemo(() => createPromiseClient(service, transport), [service]);
}