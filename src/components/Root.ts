import { StorageActions } from "../flux/Actions";

class Root extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          text-align: center;
          margin: 20px;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 10px; 
          margin-bottom: 20px;
        }
      </style>

      <h1>MemeWall</h1>
      <div class="button-container">
        <form-btn></form-btn>
        <sort-button></sort-button>
        <meme-gallery></meme-gallery>
      </div>
    `;
  }

  connectedCallback() {
    const storage = localStorage.getItem("flux:persist");

    if (storage) {
      const storageJson = JSON.parse(storage);
      StorageActions.load(storageJson);
    }
  }
}

export default Root;
