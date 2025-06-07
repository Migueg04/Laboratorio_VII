import { uploadMeme } from "../Services/uploadMeme"; // Importación correcta con destructuring

class MemeForm extends HTMLElement {
  private fileInput: HTMLInputElement;
  private nameInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private isUploading: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 400px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }
        h2 {
          margin-top: 0;
          font-size: 1.5rem;
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        input[type="text"],
        input[type="file"] {
          padding: 12px;
          font-size: 14px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: border-color 0.3s;
        }
        input[type="text"]:focus,
        input[type="file"]:focus {
          outline: none;
          border-color: #007bff;
        }
        button {
          padding: 12px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-weight: bold;
        }
        button:hover:not(:disabled) {
          background-color: #0056b3;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .preview-container {
          margin-top: 10px;
          text-align: center;
        }
        .preview-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          margin-top: 10px;
        }
        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          margin-top: 10px;
        }
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
      <h2>🎭 Subir Meme</h2>
      <form id="uploadForm">
        <input type="text" id="userName" placeholder="Tu nombre" required>
        <input type="file" id="imageInput" accept="image/*" required>
        <div id="previewContainer" class="preview-container" style="display: none;">
          <img id="previewImage" class="preview-image" alt="Preview">
        </div>
        <button type="submit" id="submitButton">
          <span id="buttonText">Subir Meme</span>
        </button>
      </form>
      <div id="messageContainer"></div>
    `;

    this.fileInput = this.shadowRoot!.getElementById('imageInput') as HTMLInputElement;
    this.nameInput = this.shadowRoot!.getElementById('userName') as HTMLInputElement;
    this.submitButton = this.shadowRoot!.getElementById('submitButton') as HTMLButtonElement;

    const form = this.shadowRoot!.getElementById('uploadForm') as HTMLFormElement;
    form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Agregar preview de imagen
    this.fileInput.addEventListener('change', this.handleFilePreview.bind(this));
  }

  private handleFilePreview(): void {
    const file = this.fileInput.files?.[0];
    const previewContainer = this.shadowRoot!.getElementById('previewContainer') as HTMLDivElement;
    const previewImage = this.shadowRoot!.getElementById('previewImage') as HTMLImageElement;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target?.result as string;
        previewContainer.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      previewContainer.style.display = 'none';
    }
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const file = this.fileInput.files?.[0];
    const userName = this.nameInput.value.trim();

    if (!file || !userName) {
      this.showMessage('Por favor, completa todos los campos.', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.showMessage('Por favor, selecciona un archivo de imagen válido.', 'error');
      return;
    }

    // Validar tamaño del archivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('El archivo es demasiado grande. Máximo 5MB.', 'error');
      return;
    }

    this.setLoadingState(true);

    try {
      console.log('Iniciando upload del meme...');
      const success = await uploadMeme(file, userName);
      
      if (success) {
        this.showMessage('¡Meme subido exitosamente! 🎉', 'success');
        this.resetForm();
        
        // Emitir evento para que la galería se actualice
        this.dispatchEvent(new CustomEvent('meme-uploaded', {
          bubbles: true,
          composed: true
        }));
      } else {
        this.showMessage('Error al subir el meme. Intenta nuevamente.', 'error');
      }
    } catch (error) {
      console.error('Error uploading meme:', error);
      this.showMessage('Error inesperado. Intenta nuevamente.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }

  private setLoadingState(loading: boolean): void {
    this.isUploading = loading;
    this.submitButton.disabled = loading;
    
    const buttonText = this.shadowRoot!.getElementById('buttonText') as HTMLSpanElement;
    
    if (loading) {
      buttonText.innerHTML = '<span class="loading-spinner"></span>Subiendo...';
    } else {
      buttonText.textContent = 'Subir Meme';
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const messageContainer = this.shadowRoot!.getElementById('messageContainer') as HTMLDivElement;
    const className = type === 'success' ? 'success-message' : 'error-message';
    
    messageContainer.innerHTML = `<div class="${className}">${message}</div>`;
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      messageContainer.innerHTML = '';
    }, 5000);
  }

  private resetForm(): void {
    this.nameInput.value = '';
    this.fileInput.value = '';
    const previewContainer = this.shadowRoot!.getElementById('previewContainer') as HTMLDivElement;
    previewContainer.style.display = 'none';
  }
}

export default MemeForm;