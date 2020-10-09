export default () => {
  const isTouchDevice = () => 'ontouchstart' in window || 'onmsgesturechange' in window;
  return window.screenX != 0 && !isTouchDevice() ? true : false;
}