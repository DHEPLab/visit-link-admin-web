export function activeComponent(name) {
  return {
    type: "ACTIVE_COMPONENT",
    payload: name,
  };
}
