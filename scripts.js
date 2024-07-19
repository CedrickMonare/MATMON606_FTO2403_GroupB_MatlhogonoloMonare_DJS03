import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

//The BookInteraction object contains utility methods for manipulating the DOM and updating the book-related UI elements.
const BookInteraction = {
    createBookPreview({ author, id, image, title }) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

        return element;
    },

 //Appends a list of items to a container element.
    appendToList(items, container) {
        const fragment = document.createDocumentFragment();
        items.forEach(item => fragment.appendChild(item));
        container.appendChild(fragment);
    },

//Updates the theme of the page.
    updateTheme(theme) {
        if (theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
    },
    
//Updates the "Show more" button based on the number of matches and the current page.
    updateListButton(matches, page) {
        const button = document.querySelector('[data-list-button]');
        button.innerText = `Show more (${matches.length - BOOKS_PER_PAGE})`;
        button.disabled = (matches.length - (page * BOOKS_PER_PAGE)) <= 0;
        button.innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${Math.max(0, matches.length - (page * BOOKS_PER_PAGE))})</span>
        `;
    },

//Toggles the visibility of the list message.
    showListMessage(visible) {
        const message = document.querySelector('[data-list-message]');
        if (visible) {
            message.classList.add('list__message_show');
        } else {
            message.classList.remove('list__message_show');
        }
    },

  //Opens or closes an overlay.
    openOverlay(selector, open) {
        document.querySelector(selector).open = open;
    },
    
    //Populates a select element with options.
    populateSelectElement(selectElement, options, firstOptionText) {
        const fragment = document.createDocumentFragment();
        const firstOption = document.createElement('option');
        firstOption.value = 'any';
        firstOption.innerText = firstOptionText;
        fragment.appendChild(firstOption);

        for (const [id, name] of Object.entries(options)) {
            const option = document.createElement('option');
            option.value = id;
            option.innerText = name;
            fragment.appendChild(option);
        }

        selectElement.appendChild(fragment);
    }
};

//The BookApp object manages the book application, including initialization and event handling.
const BookApp = {
    page: 1,
    matches: books,

    //Initializes the book application.
    initialize() {
        this.InitialBooks();
        this.Filters();
        this.EventListeners();
        this.InitialTheme();
    },

    //Loads the initial set of books.
    InitialBooks() {
        const bookPreviews = this.matches.slice(0, BOOKS_PER_PAGE).map(book => BookInteraction.createBookPreview(book));
        BookInteraction.appendToList(bookPreviews, document.querySelector('[data-list-items]'));
    },

//Populates the genre and author filters.
    Filters() {
        BookInteraction.populateSelectElement(document.querySelector('[data-search-genres]'), genres, 'All Genres');
        BookInteraction.populateSelectElement(document.querySelector('[data-search-authors]'), authors, 'All Authors');
    },

    //Sets the initial theme based on the user's system preferences.
    InitialTheme() {
        const prefersDarkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.querySelector('[data-settings-theme]').value = prefersDarkScheme ? 'night' : 'day';
        BookInteraction.updateTheme(prefersDarkScheme ? 'night' : 'day');
    },

    //Adds event listeners to the application elements.
    EventListeners() {
        document.querySelector('[data-search-cancel]').addEventListener('click', () => {
            BookInteraction.openOverlay('[data-search-overlay]', false);
        });

        document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
            BookInteraction.openOverlay('[data-settings-overlay]', false);
        });

        document.querySelector('[data-header-search]').addEventListener('click', () => {
            BookInteraction.openOverlay('[data-search-overlay]', true);
            document.querySelector('[data-search-title]').focus();
        });

        document.querySelector('[data-header-settings]').addEventListener('click', () => {
            BookInteraction.openOverlay('[data-settings-overlay]', true);
        });

        document.querySelector('[data-list-close]').addEventListener('click', () => {
            BookInteraction.openOverlay('[data-list-active]', false);
        });

        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const { theme } = Object.fromEntries(formData);
            BookInteraction.updateTheme(theme);
            BookInteraction.openOverlay('[data-settings-overlay]', false);
        });

        document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            this.applyFilters(new FormData(event.target));
        });

        document.querySelector('[data-list-button]').addEventListener('click', () => {
            this.loadMoreBooks();
        });

        //Applies the filters to the list of books.
    applyFilters(formData) {
        const filters = Object.fromEntries(formData);
        this.matches = books.filter(book => this.bookMatchesFilters(book, filters));
        this.page = 1;
        this.renderFilteredBooks();
    },

    //Checks if a book matches the given filters.
    bookMatchesFilters(book, filters) {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return genreMatch && titleMatch && authorMatch;
    },

    //Renders the filtered list of books.
    renderFilteredBooks() {
        BookInteraction.showListMessage(this.matches.length === 0);
        const bookPreviews = this.matches.slice(0, BOOKS_PER_PAGE).map(book => BookInteraction.createBookPreview(book));
        const container = document.querySelector('[data-list-items]');
        container.innerHTML = '';
        BookInteraction.appendToList(bookPreviews, container);
        BookInteraction.updateListButton(this.matches, this.page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        BookInteraction.openOverlay('[data-search-overlay]', false);
    },

        document.querySelector('[data-list-items]').addEventListener('click', (event) => {
            this.handleBookClick(event);
        });
    },
