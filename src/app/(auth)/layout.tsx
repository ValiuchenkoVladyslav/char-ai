import { NavLink } from "~/shared/components/nav-link";
import { ContinueWithGoogle } from "./_components/continue-with-google";

export default function AuthLayout(props: WithChildren) {
  return (
    <div className="flex justify-center gap-6 md:mt-16">
      <aside className="hidden md:block">
        <h1 className="text-4xl font-bold">Welcome to our App</h1>
        <p className="mt-4 text-lg">Please sign in or sign up to continue.</p>
        <p>TODO: add more text</p>
      </aside>

      <section className="w-[min(400px,100%)] flex flex-col gap-1">
        <nav
          className="rounded-lg bg-bg-alt flex gap-1.5 rounded-lg px-1.5 py-1"
          aria-label="Authentication options"
        >
          <NavLink
            href="/sign-in"
            className="flex-1 rounded-md flex justify-center font-semibold py-1 hover:bg-active aria-[current=page]:bg-active"
          >
            Sign In
          </NavLink>

          <NavLink
            href="/sign-up"
            className="flex-1 rounded-md flex justify-center font-semibold py-1 hover:bg-active aria-[current=page]:bg-active"
          >
            Sign Up
          </NavLink>

          <ContinueWithGoogle />
        </nav>

        <div className="bg-bg-alt rounded-lg px-4 py-3">{props.children}</div>
      </section>
    </div>
  );
}
