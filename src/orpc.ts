import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

import type { ORPCRouter } from "~/app/api/rpc/[[...rest]]/route";

export const orpc = createORPCClient<RouterClient<ORPCRouter>>(
  new RPCLink({
    url: `${typeof window === "undefined" || window.location.origin}/api/rpc`,
  }),
);
