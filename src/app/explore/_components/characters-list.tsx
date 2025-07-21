"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { characterSlug } from "~/modules/character/client";
import { CharacterLikes } from "./character-likes";

export namespace CharacterCard {
  export interface Props extends CharacterLikes.Props {
    name: string;
    description: string;
    image: string;
    authorName: string | null;
    authorUsername: string | null;
    authorPfp?: string | null;
  }
}

function CharacterCard(props: CharacterCard.Props) {
  return (
    <article className="bg-bg-alt rounded-lg border-1 flex flex-col overflow-hidden h-fit">
      <Link href={`/character/${characterSlug(props.characterId, props.name)}`}>
        <img src="asdasd" alt="Character" className="h-72 bg-active" />
      </Link>

      <section className="px-3 py-2">
        <h3 className="truncate">
          {props.name}
          lsdalsjdha sldjh asldhj alsdh alshd alshd dasljasld hj
        </h3>
        <p className="h-[4lh] line-clamp-4">
          {props.description}
          asldaslkjd alsd laks dlakhd lkash d;ajs ;djaj; dja;s jads; jkasdlkj
          alsdjakshbd askhdb aksh bdkashbd kashb dkasb dkha skdb akshd akshd
          kashd khas kdhas hbd
        </p>

        <div className="flex items-center justify-between pt-2">
          {props.authorUsername ? (
            <Link
              href={`/user/${props.authorUsername}`}
              className="flex gap-2 items-center"
            >
              <img
                src="asdasd"
                alt="Author"
                className="h-9 w-9 bg-active rounded-full"
              />

              <h4>{props.authorName}</h4>
            </Link>
          ) : (
            <p className="h-9 flex items-center">
              {props.authorName ?? "[deleted user]"}
            </p>
          )}

          <CharacterLikes
            likesCount={props.likesCount}
            characterId={props.characterId}
            search={props.search}
          />
        </div>
      </section>
    </article>
  );
}

export namespace CharactersList {
  export interface Props {
    characters: Promise<Array<Omit<CharacterCard.Props, "search">>>;
    search: string;
  }
}

export function CharactersList({ characters, search }: CharactersList.Props) {
  const charactersList = use(characters);

  return (
    <section className="flex-1 grid gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
      {charactersList.map((char) => (
        <CharacterCard key={char.characterId} {...char} search={search} />
      ))}

      {charactersList.length === 0 && (
        <div className="col-span-full flex gap-3 flex-col items-center justify-start">
          <h1>No characters found ;(</h1>
          <Link
            href="/create"
            className="flex items-center gap-1 opacity-70 hover:opacity-100"
          >
            <h2>Try uploading your own!</h2>
            <SquareArrowOutUpRight />
          </Link>
        </div>
      )}
    </section>
  );
}
