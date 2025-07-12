import { os } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

export const listPlanet = os.handler(async () => {
  return [{ id: 1, name: "name" }];
});

export const findPlanet = os.handler(async () => {
  return { id: 1, name: "name" };
});

const router = {
  planet: {
    list: listPlanet,
    find: findPlanet,
  },
};

export type ORPCRouter = typeof router;

const handler = new RPCHandler(router);

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {}, // Provide initial context if needed
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
