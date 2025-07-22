import { Search } from "lucide-react";
import Form from "next/form";

import { nameBounds } from "~/modules/character/server";

export default function ExploreLayout(props: WithChildren) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <Form
        action="/explore"
        className="flex items-center bg-active rounded-lg lg:fixed lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:m-base"
      >
        <input
          name="q"
          placeholder="Search characters"
          minLength={nameBounds.minLen}
          maxLength={nameBounds.maxLen}
          required
          className="px-4 text-lg py-1 w-full lg:w-[28vw] rounded-l-lg"
        />
        <Search className="mx-2" />
      </Form>

      {props.children}
    </div>
  );
}
