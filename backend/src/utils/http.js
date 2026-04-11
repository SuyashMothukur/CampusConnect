export function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

export function sendOk(res, data, status = 200) {
  return res.status(status).json(data);
}
