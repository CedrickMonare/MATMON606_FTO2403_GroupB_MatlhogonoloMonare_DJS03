class BookPreview extends HTMLElement {
 
    static get observedAttributes() {
      // These are the attributes that will be monitored for changes.
      return ["author", "id", "image", "title"];
    }
      
    //Constructs an instance of the BookPreview element.
      // Attached a shadow DOM tree to this instance in open mode.
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      // Only update if the attribute's value has actually changed.
      if (oldValue !== newValue) {
        this.render();
      }
    }
   
    connectedCallback() {
      // Initial rendering of the component.
      this.render();
    }

render() {
      // Attribute values from the element.
      const author = this.getAttribute("author");
      const id = this.getAttribute("id");
      const image = this.getAttribute("image");
      const title = this.getAttribute("title");
  
      // inner HTML of the shadow root to define the component's structure and styling.
      this.shadowRoot.innerHTML = `     
          <style>
            .preview {
              display: flex;
              align-items: center;
              cursor: pointer;
              border: none;
              background: none;
              padding: 10px;
            }
    
            .preview__image {
              width: 50px;
              height: 75px;
              object-fit: cover;
              margin-right: 10px;
            }
    
            .preview__info {
              display: flex;
              flex-direction: column;
            }
    
            .preview__title {
              font-size: 1rem;
              margin: 0;
            }
    
            .preview__author {
              font-size: 0.875rem;
              color: gray;
            }
          </style>
    
          <button class="preview" data-preview="${id}">
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
              <h3 class="preview__title">${title}</h3>
              <div class="preview__author">${author}</div>
            </div>
          </button>
        `;
    }
  }
  
  // Defines the new element so it can be used in the HTML.
  customElements.define("book-preview", BookPreview);
