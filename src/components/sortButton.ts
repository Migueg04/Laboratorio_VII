class SortButton extends HTMLElement {
  private button!: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.button = this.shadowRoot!.querySelector('button')!;
    this.button.addEventListener('click', this.handleClick.bind(this));
  }

  private handleClick() {
    // Emite un evento personalizado para ordenar
    this.dispatchEvent(new CustomEvent('sort-memes', {
      bubbles: true,
      composed: true
    }));
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        button {
          padding: 10px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
      <button>Ordenar por Fecha (Recientes Primero)</button>
    `;
  }
}

export default SortButton;
