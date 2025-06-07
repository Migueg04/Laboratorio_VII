import { fetchPosts } from "../Services/Supabase/fetchPosts";
import { MemeType } from "../utils/Types";

class MemeGallery extends HTMLElement {
  private memes: MemeType[] = [];
  private container: HTMLDivElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
        }
        
        .gallery-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .gallery-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin: 0;
          font-family: 'Arial', sans-serif;
        }
        
        .gallery-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          max-width: 1200px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .meme-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .meme-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .meme-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          display: block;
        }
        
        .meme-info {
          padding: 15px;
        }
        
        .meme-username {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
          font-size: 1.1rem;
        }
        
        .meme-date {
          color: #666;
          font-size: 0.9rem;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #666;
          width: 100%;
        }
        
        .error {
          text-align: center;
          padding: 40px;
          color: #d32f2f;
          background: #ffebee;
          border-radius: 8px;
          margin: 20px;
          width: 100%;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
          width: 100%;
        }
        
        .empty-state h3 {
          margin-bottom: 10px;
          font-size: 1.5rem;
        }
        
        .refresh-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 20px;
          transition: background-color 0.3s;
        }
        
        .refresh-button:hover {
          background: #0056b3;
        }
      </style>
      
      <div class="gallery-header">
        <h1>🎭 MemeWall</h1>
        <button class="refresh-button" id="refreshButton">🔄 Actualizar</button>
      </div>
      
      <div class="gallery-container" id="memesContainer">
        <div class="loading">Cargando memes...</div>
      </div>
    `;

    this.container = this.shadowRoot!.getElementById('memesContainer') as HTMLDivElement;
    
    const refreshButton = this.shadowRoot!.getElementById('refreshButton') as HTMLButtonElement;
    refreshButton.addEventListener('click', () => this.loadMemes());

    this.loadMemes();
  }

  async loadMemes(): Promise<void> {
    try {
      this.container.innerHTML = '<div class="loading">Cargando memes...</div>';
      
      const memes = await fetchPosts();
      this.memes = memes;
      
      if (memes.length === 0) {
        this.renderEmptyState();
      } else {
        this.renderMemes();
      }
      
    } catch (error) {
      console.error('Error loading memes:', error);
      this.renderError();
    }
  }

  private renderMemes(): void {
    this.container.innerHTML = '';
    
    this.memes.forEach(meme => {
      const memeCard = this.createMemeCard(meme);
      this.container.appendChild(memeCard);
    });
  }

  private createMemeCard(meme: MemeType): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'meme-card';
    
    // Manejo seguro de la fecha - usar fecha actual si no existe
    const dateToFormat = meme.created_at || new Date().toISOString();
    const formattedDate = new Date(dateToFormat).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    card.innerHTML = `
      <img class="meme-image" src="${meme.image}" alt="Meme de ${meme.username}" loading="lazy">
      <div class="meme-info">
        <div class="meme-username">👤 ${meme.username}</div>
        <div class="meme-date">📅 ${formattedDate}</div>
      </div>
    `;
    
    return card;
  }

  private renderEmptyState(): void {
    this.container.innerHTML = `
      <div class="empty-state">
        <h3>¡No hay memes aún!</h3>
        <p>Sé el primero en subir un meme divertido 🎭</p>
      </div>
    `;
  }

  private renderError(): void {
    this.container.innerHTML = `
      <div class="error">
        <h3>Error al cargar los memes</h3>
        <p>Por favor, intenta nuevamente más tarde.</p>
      </div>
    `;
  }

  public refresh(): void {
    this.loadMemes();
  }
}

customElements.define('meme-gallery', MemeGallery);
export default MemeGallery;