"use client";

import useSWR from "swr";
import { orpc } from "~/orpc";

export default function Home() {
  const { data, error } = useSWR("planet/list", () => orpc.planet.list());

  console.log(data, error);

  return <p>hello world!</p>;
}
