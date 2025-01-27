const quoteDisplay = document.getElementById('quoteDisplay');
const addQuoteButton = document.getElementById('addQuoteButton');
const categoryFilter = document.getElementById('categoryFilter');
const notificationBar = document.getElementById('notificationBar');

const quotes = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    // ... add more quotes
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = ${randomQuote.text} - ${randomQuote.category};
    sessionStorage.setItem('lastViewedQuote', randomIndex); // Store last viewed quote
}

function addQuote(newQuote) {
    quotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    showRandomQuote(); // Show the newly added quote
}

function populateCategories() {
    const categories = new Set();
    quotes.forEach(quote => categories.add(quote.category));
    const uniqueCategories = Array.from(categories);

    const categoryOptions = uniqueCategories.map(category => <option value="${category}">${category}</option>);

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

// Load quotes from local storage on page load
window.addEventListener('load', () => {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    const lastViewedQuoteIndex = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuoteIndex) {
        showQuote(lastViewedQuoteIndex); // Implement this function if needed
    } else {
        showRandomQuote();
    }

    populateCategories();
    filterQuotes();
});

// Add event listener to the buttons
addQuoteButton.addEventListener('click', () => {
    // Handle adding a new quote (prompt