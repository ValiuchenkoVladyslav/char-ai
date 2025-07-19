"use client";

export default function ConfirmSignInError({ error }: { error: Error }) {
  return (
    <div>
      <h3 className="text-red-500">Error occurred!</h3>
      <p>{error.message}</p>
    </div>
  );
}
