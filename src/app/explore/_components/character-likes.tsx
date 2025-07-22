"use client";

import { Heart } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import {
  likeCharacter,
  unlikeCharacter,
  useLikes,
} from "~/modules/user/client";

export namespace CharacterLikes {
  export interface Props {
    characterId: number;
    likesCount: number;
    search: string;
  }
}

export function CharacterLikes(props: CharacterLikes.Props) {
  const [likes, setLikes] = useState(props.likesCount);
  const { userLikes, mutateUserLikes } = useLikes(props.search);
  const _isLiked =
    userLikes?.some((like) => like.characterId === props.characterId) ?? false;
  const [isLiked, setLiked] = useState(_isLiked);

  // biome-ignore lint/correctness/useExhaustiveDependencies: it must be there
  useLayoutEffect(() => {
    setLiked(_isLiked);
  }, [userLikes]);

  return (
    <div className="flex items-center gap-2">
      <p>{likes}</p>

      <button
        type="button"
        onClick={() => {
          if (isLiked) {
            setLikes((prev) => prev - 1);
            setLiked(false);
            unlikeCharacter(props.characterId).finally(() => mutateUserLikes());
          } else {
            setLikes((prev) => prev + 1);
            setLiked(true);
            likeCharacter(props.characterId).finally(() => mutateUserLikes());
          }
        }}
      >
        <Heart className="size-5" fill={isLiked ? "red" : undefined} />
      </button>
    </div>
  );
}
