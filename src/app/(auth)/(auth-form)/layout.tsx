import { NavLink } from "~/shared/components/nav-link";
import { ContinueWithGoogle } from "./_components/continue-with-google";

export default function AuthFormLayout(props: WithChildren) {
  return (
    <>
      <nav className="rounded-lg bg-bg-alt flex gap-1.5 rounded-lg px-1.5 py-1">
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

      <div className="bg-bg-alt rounded-lg p-base">{props.children}</div>
    </>
  );
}
