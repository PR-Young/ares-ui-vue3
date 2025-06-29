const eventRegistryMap = new WeakMap();
function getRegistry(instance: any) {
  let events = eventRegistryMap.get(instance);
  if (!events) {
    eventRegistryMap.set(instance, (events = Object.create(null)));
  }
  return events;
}
export function $on(instance: any, event: any, fn: any) {
  if (Array.isArray(event)) {
    event.forEach((e) => $on(instance, e, fn));
  } else {
    const events = getRegistry(instance);
    (events[event] || (events[event] = [])).push(fn);
  }
  return instance;
}
export function $once(instance: any, event: any, fn: any) {
  const wrapped = (...args: any[]) => {
    $off(instance, event, wrapped);
    fn.call(instance, ...args);
  };
  wrapped.fn = fn;
  $on(instance, event, wrapped);
  return instance;
}
export function $off(instance: any, event: any, fn: any) {
  const vm = instance;
  // all
  if (!event) {
    eventRegistryMap.set(instance, Object.create(null));
    return vm;
  }
  // array of events
  if (Array.isArray(event)) {
    event.forEach((e) => $off(instance, e, fn));
    return vm;
  }
  // specific event
  const events = getRegistry(instance);
  const cbs = events[event];
  if (!cbs) {
    return vm;
  }
  if (!fn) {
    events[event] = undefined;
    return vm;
  }
  events[event] = cbs.filter((cb: { fn: any }) => !(cb === fn || cb.fn === fn));
  return vm;
}
export function $emit(instance: any, event: any, ...args: any) {
  instance && instance.$emit && instance.$emit(event, ...args);
  const cbs = getRegistry(instance)[event];
  if (cbs) {
    cbs.map((cb: any) => cb.apply(instance, args));
  }
  return instance;
}
