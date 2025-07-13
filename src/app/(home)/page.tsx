"use client";

import { useQuery } from "~/orpc";

export default function Home() {
  const { data } = useQuery("planet.list", (rpc) => rpc.planet.list());

  return <p>{JSON.stringify(data)}</p>;
}
