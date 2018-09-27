class ElementForSpatNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.label = document.createElement('label');
    this.input = document.createElement('input');
    this.input.id = 'internal-input';
    this.label.htmlFor = this.input.id;
    this.shadowRoot.appendChild(this.label);
    this.shadowRoot.appendChild(this.input);
  }
}

customElements.define('element-for-spatnav', ElementForSpatNav);
