class MemeCard extends HTMLElement {
  private imageElement: HTMLImageElement;
  private userNameElement: HTMLDivElement;
  private publishDateElement: HTMLDivElement;

  static get observedAttributes() {
    return ['image-url', 'user-name', 'publish-date'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          width: 300px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          font-family: Arial, sans-serif;
          background: white;
        }
        .image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f0f0f0;
        }
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .info {
          padding: 12px;
          font-size: 14px;
          color: #333;
        }
        .info .user {
          font-weight: bold;
        }
        .info .date {
          font-size: 12px;
          color: #777;
        }
      </style>
      <div class="image-container">
        <img id="image" src="" alt="Uploaded Image">
      </div>
      <div class="info">
        <div class="user" id="userName"></div>
        <div class="date" id="publishDate"></div>
      </div>
    `;

    this.imageElement = this.shadowRoot!.getElementById('image') as HTMLImageElement;
    this.userNameElement = this.shadowRoot!.getElementById('userName') as HTMLDivElement;
    this.publishDateElement = this.shadowRoot!.getElementById('publishDate') as HTMLDivElement;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'image-url':
        this.imageElement.src = newValue;
        break;
      case 'user-name':
        this.userNameElement.textContent = newValue;
        break;
      case 'publish-date':
        this.publishDateElement.textContent = newValue;
        break;
    }
  }
}

export default MemeCard
