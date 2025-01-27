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

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('/api/quotes'); // Replace with the actual server endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quotesData = await response.json();
        return quotesData;
    } catch (error) {
        console.error('Error fetching quotes:', error);
        // Handle the error (e.g., show an error message to the user)
    }
}

// Load quotes from local storage on page load and fetch from server
window.addEventListener('load', () => {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }

    fetchQuotesFromServer()
        .then(serverQuotes => {
            quotes = serverQuotes; 
            localStorage.setItem('quotes', JSON.stringify(quotes));
        })
        .catch(error => {
            console.error('Error fetching quotes:', error);
            // Handle the error (e.g., show an error message to the user)
        });

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
    createAddQuoteForm(); // Call the function to create the form
});

function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter new quote">
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

// ... rest of the code ...

function supportsBlob() {
    return typeof Blob !== 'undefined';
}

function createObjectURL(data) {
    if (supportsBlob()) {
        return URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    } else {
        // Fallback for older environments (e.g., convert to a data URI)
        return 'data:application/json;base64,' + btoa(JSON.stringify(data));
    }
}

function exportToJsonFile() {
    const data = JSON.stringify(quotes);
    const url = createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

exportQuotesButton.addEventListener('click', exportToJsonFile);