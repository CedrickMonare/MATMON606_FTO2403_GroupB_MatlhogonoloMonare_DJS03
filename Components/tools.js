// book-preview.js
import { authors } from './data.js';

class BookPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .preview {
                    /* Add your styles here */
                }
                .preview__image {
                    width: 100px;
                    height: auto;
                }
                .preview__info {
                    display: flex;
                    flex-direction: column;
                }
                .preview__title {
                    font-size: 16px;
                    margin: 0;
                }
                .preview__author {
                    font-size: 12px;
                    color: grey;
                }
            </style>
            <button class="preview">
                <img class="preview__image" />
                <div class="preview__info">
                    <h3 class="preview__title"></h3>
                    <div class="preview__author"></div>
                </div>
            </button>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.preview__image').src = this.getAttribute('image');
        this.shadowRoot.querySelector('.preview__title').innerText = this.getAttribute('title');
        this.shadowRoot.querySelector('.preview__author').innerText = authors[this.getAttribute('author')];
        this.setAttribute('data-preview', this.getAttribute('id'));
    }

    static get observedAttributes() {
        return ['image', 'title', 'author', 'id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'image') {
            this.shadowRoot.querySelector('.preview__image').src = newValue;
        }
        if (name === 'title') {
            this.shadowRoot.querySelector('.preview__title').innerText = newValue;
        }
        if (name === 'author') {
            this.shadowRoot.querySelector('.preview__author').innerText = authors[newValue];
        }
    }
}

customElements.define('book-preview', BookPreview);
