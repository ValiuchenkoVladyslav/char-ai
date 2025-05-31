async function getUserChats(id?: number) {
  if (id === undefined) return undefined;

  return []; // todo
}

export function load(params) {
  return {
    userChats: getUserChats(params.locals.user),
  };
}
