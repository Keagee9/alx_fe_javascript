const quoteDisplay = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    // ... add more quotes
];

const quoteDisplay = document.getElementById('quoteDisplay');
const addQuoteButton = document.getElementById('addQuoteButton');

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = "${randomQuote.text}" - ${randomQuote.category};
}

function createAddQuoteForm() {
    const form = document.createElement('form');
    form.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter new quote">
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
        <button type="button" onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(form);
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        // Optionally, display the newly added quote
        showRandomQuote(); // Display the latest quote

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    }
}

// Initial display
showRandomQuote();

// Create add quote form
createAddQuoteForm();

// Add event listener to the button
addQuoteButton.addEventListener('click', showRandomQuote);

const quotes = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    // ... add more quotes
];

const quoteDisplay = document.getElementById('quoteDisplay');

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = "${randomQuote.text}" - ${randomQuote.category};
    sessionStorage.setItem('lastViewedQuote', randomIndex); // Store last viewed quote
}

function addQuote(newQuote) {
    quotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    showRandomQuote(); // Show the newly added quote
}

// Load quotes from local storage on page load
window.addEventListener('load', () => {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    const lastViewedQuoteIndex = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuoteIndex) {
        showQuote(lastViewedQuoteIndex); // Show the last viewed quote
    } else {
        showRandomQuote(); // Show a random quote if no last viewed quote is found
    }
});

// ... rest of the code for adding quotes, etc.


// ... (previous code for quotes array, showRandomQuote, addQuote, etc.)

const categoryFilter = document.getElementById('categoryFilter');

function populateCategories() {
    const categories = new Set();
    quotes.forEach(quote => categories.add(quote.category));
    const uniqueCategories = Array.from(categories);

    const categoryOptions = uniqueCategories.map(category => {
        return <option value="${category}">${category}</option>;
    });

    categoryFilter.innerHTML = <option value="all">All Categories</option> + categoryOptions.join('');
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    // ... (code to update the DOM with filteredQuotes)

    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Load last selected filter from localStorage
window.addEventListener('load', () => {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }

    populateCategories();
    filterQuotes();
});

// Add event listener to the dropdown menu
categoryFilter.addEventListener('change', filterQuotes);

// ... (rest of the code)

// ... (previous code for quotes array, showRandomQuote, addQuote, etc.)

const notificationBar = document.getElementById('notificationBar');

function showNotification(message, type) {
    notificationBar.innerHTML = <p class="${type}">${message}</p>;
    // Optionally, add a timeout to hide the notification after a few seconds
}

function handleServerUpdate(updatedQuotes) {
    // Check for conflicts (e.g., by comparing timestamps or hashes)
    if (hasConflicts(updatedQuotes)) {
        // Handle conflicts (e.g., show a conflict resolution dialog)
        showNotification("Conflicts detected! Resolving...", "warning");
        // ... (your conflict resolution logic)
    } else {
        // Update local quotes and storage
        quotes = updatedQuotes;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        showNotification("Data updated from server.", "success");
    }
}

// ... (rest of the code)