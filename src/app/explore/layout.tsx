import { Search } from "lucide-react";
import Form from "next/form";

export default function Layout(props: WithChildren) {
  return (
    <div>
      <Form
        action="/explore"
        className="fixed left-1/2 -translate-x-1/2 top-0 m-base flex items-center bg-bg-alt rounded-lg"
      >
        <input
          name="q"
          placeholder="Search characters"
          className="px-4 text-lg py-1 w-80 rounded-l-lg"
        />
        <Search className="mx-2" />
      </Form>

      {props.children}
    </div>
  );
}
