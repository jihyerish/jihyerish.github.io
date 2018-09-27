const root = document.querySelector('#root');
let changeNum = document.querySelector('#statusNum');
let statusText = document.querySelector('#statusChange');

const options = {
  childList: true,
  attributes: true,
  subtree: true,
  characterData: true,
  attributeOldValue: true,
  characterDataOldValue: true,
  attributeFilter: ['style', 'class']
};

const init = () => {
  root.appendChild(getButton('Add child nodes', addNode));
  root.appendChild(getButton('Modify attributes', setAttrs));
};
const getButton = (textContent, listener) => {
  let button = document.createElement("button");

  button.textContent = textContent;
  button.addEventListener('click', e => {
    let ul = e.target.parentNode;
    listener(ul)
  });
  return button;
};

const addNode = (target = root) => {
  let li = document.createElement('li');
  let span = document.createElement('span');
  let ul = document.createElement('ul');
  let level = Number(target.getAttribute('data-level')) + 1;

  span.textContent = level + 'th level child nodes';
  ul.setAttribute('data-level', level);
  ul.appendChild(span);
  ul.appendChild(getButton('Add child nodes', addNode));
  ul.appendChild(getButton('Modify attributes', setAttrs));
  ul.appendChild(getButton('Remove child nodes', removeNode));
  setStyle(ul);
  li.appendChild(ul);
  target.appendChild(li);
};

const setAttrs = (target = root) => {
  setStyle(target);
  setClass(target);
};

const setStyle = (target = root) => {
  let rgb = [
    Math.random() * 255 ^ 0,
    Math.random() * 255 ^ 0,
    Math.random() * 255 ^ 0
  ].join();
  let backgroundStyle = `background-color: rgb(${rgb})`;

  target.setAttribute('style', backgroundStyle);
};

const setClass = (target = root) => {
  target.setAttribute('class', 'attr-changed');
};

const removeNode = (target) => {
  target.parentNode.remove();
};

if ('MutationObserver' in window) {
  let observer = new MutationObserver(mutations => {
    changeNum.textContent = mutations.length;
    let status = "";
    mutations.forEach(mutation => {
      let target = mutation.target;
      let oldValueInfo;
      let curValueInfo;
      switch (mutation.type) {
        case 'attributes':
          curValueInfo = target.getAttribute(mutation.attributeName);
          status +=
            `${mutation.attributeName} Attribute of ${target.nodeName} Node is changed
            from ${mutation.oldValue} to ${curValueInfo}.\r\n`;
          break;
        case 'childList':
          Array.prototype.forEach.call(mutation.addedNodes, node => {
            status += `${node.nodeName} Node is added to  ${target.nodeName} Node.\r\n`;
          });
          Array.prototype.forEach.call(mutation.removedNodes, node => {
            status += `${node.nodeName} Node is removed from ${target.nodeName} Node.\r\n`;
          });
          break;
      }
    });
    statusText.textContent = status;
  });
  observer.observe(root, options);
} else {
  alert('This browser cannot support MutationObserver');
}

window.addEventListener("load", function() {
  init();
});
