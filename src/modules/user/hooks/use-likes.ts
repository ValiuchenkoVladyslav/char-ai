import useSWR from "swr";
import { getLikes } from "~/modules/user/actions/likes";

export function useLikes(search: string) {
  const res = useSWR(["likes", search], () => getLikes(search));

  return {
    userLikes: res.data,
    loading: res.isLoading,
    mutateUserLikes: res.mutate,
  };
}
