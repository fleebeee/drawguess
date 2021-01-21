const leave = (api, ws, payload) => {
  const { user } = payload;

  const serverUser = api.authenticate(ws, user);
  if (!serverUser) return false;

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: null,
    } as Message)
  );
  return true;
};

export default leave;
