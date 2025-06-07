class FormBtn extends HTMLElement {
  private button!: HTMLButtonElement;
  private formContainer!: HTMLDivElement;
  private isFormVisible: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.button = this.shadowRoot!.querySelector('button')!;
    this.formContainer = this.shadowRoot!.querySelector('.form-container')!;

    this.button.addEventListener('click', this.toggleForm.bind(this));
  }

  private toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.formContainer.style.display = this.isFormVisible ? 'block' : 'none';
    this.button.textContent = this.isFormVisible ? 'Cerrar Formulario' : 'Subir Imagen';
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
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #218838;
        }
        .form-container {
          margin-top: 16px;
          display: none;
        }
      </style>
      <button>Subir Imagen</button>
      <div class="form-container">
        <meme-form></meme-form>
      </div>
    `;
  }
}

export default FormBtn;
