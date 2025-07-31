export function init({ eventController, widgetId }) {
  const el = document.createElement("div");
  el.innerHTML = `<div>Я ${widgetId}</div>`;

  const onEvent = (data) => {
    console.log(`${widgetId} отримав подію:`, data);
  };

  const unsubscribe = eventController.subscribe("greet", onEvent);

  eventController.emit("greet", `${widgetId} привіт!`);

  return {
    element: el,
    destroy() {
      unsubscribe();
      el.remove();
      console.log(`${widgetId} видалено`);
    },
  };
}
