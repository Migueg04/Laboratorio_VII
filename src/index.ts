
import FormBtn from "./components/formButton"
import MemeCard from "./components/MemeCard"
import SortButton from "./components/sortButton"
import Root from "./components/Root"
import MemeGallery from "./components/MemeContainer"
import MemeForm from "./components/MemeFormt"

customElements.define('root-element', Root)
customElements.define('meme-card', MemeCard)
customElements.define('meme-form', MemeForm)
customElements.define('form-btn', FormBtn);
customElements.define('sort-button', SortButton);
customElements.define('meme-gallery', MemeGallery);