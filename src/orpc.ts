import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import useSWR from "swr";

import type { ORPCRouter } from "~/app/api/rpc/[[...rest]]/route";

const orpc = createORPCClient<RouterClient<ORPCRouter>>(
  new RPCLink({
    url: `${typeof window === "undefined" || window.location.origin}/api/rpc`,
  }),
);

export function useQuery<T>(
  key: string,
  fetcher: (rpc: typeof orpc) => Promise<T>,
) {
  const res = useSWR(key, () => fetcher(orpc));

  return {
    data: res.data,
    err: res.error,
    loading: res.isLoading || res.isValidating,
  };
}
