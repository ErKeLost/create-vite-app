'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const createElement = () => {
  const el = document.createElement('div');
  el.style.whiteSpace = 'pre';
  return el;
};
const useClipboard = () => {
  const el = createElement();
  const copyText = (text) => {
    if (!text) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    el.textContent = text;
    document.body.appendChild(el);
    range.selectNode(el);
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand('Copy');
    } catch (error) {
      console.error('copy failed!');
    }
    selection.removeAllRanges();
    el.textContent = '';
    document.body.removeChild(el);
  };
  return { copyText };
};
exports.default = useClipboard;
