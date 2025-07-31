const widgetContainer = document.getElementById("widgets");

const eventController = {
  events: {},
  emit(event, data) {
    (this.events[event] || []).forEach((func) => func(data));
  },
  subscribe(event, func) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(func);
    return () =>
      (this.events[event] = this.events[event].filter((f) => f !== func));
  },
};

const globalContext = {
  eventController,
  register(widgetId, module) {
    const instance = module.init({ eventController, widgetId });
    widgetContainer.appendChild(instance.element);
    return instance;
  },
};

let widgets = {};

async function loadWidget(widgetId, url) {
  if (widgets[widgetId]) {
    console.warn(`Віджет ${widgetId} вже завантажено`);
    return;
  }
  const module = await import(url);
  widgets[widgetId] = globalContext.register(widgetId, module);
}

function unloadWidget(widgetId) {
  if (!widgets[widgetId]) return;
  widgets[widgetId].destroy();
  delete widgets[widgetId];
}

document.getElementById("btnLoadA").addEventListener("click", () => {
  unloadWidget("widgetB");
  loadWidget("widgetA", "./widgets/widget.js");
});

document.getElementById("btnLoadB").addEventListener("click", () => {
  unloadWidget("widgetA");
  loadWidget("widgetB", "./widgets/widget.js");
});
