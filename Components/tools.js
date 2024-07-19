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
