export default function AuthLayout(props: WithChildren) {
  return (
    <div className="flex justify-center gap-6 md:mt-16">
      <aside className="hidden md:block">
        <h1 className="text-4xl font-bold">Welcome to our App</h1>
        <p className="mt-4 text-lg">Please sign in or sign up to continue.</p>
        <p>TODO: add more text</p>
      </aside>

      <section className="w-[min(400px,100%)] flex flex-col gap-1">
        {props.children}
      </section>
    </div>
  );
}
