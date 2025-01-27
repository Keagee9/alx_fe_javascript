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

    // Mock API call (replace with your actual server-side logic)
    postQuoteToServer(newQuote)
        .then(() => {
            // Handle successful post (e.g., show success message)
            showNotification("Quote added successfully!", "success");
        })
        .catch(error => {
            // Handle error (e.g., show error message to the user)
            showNotification("Error adding quote: " + error.message, "error");
        });
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
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

// Mock function for posting data to the server
// ... (rest of your existing code) ...

async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const quotesData = await response.json(); 
  
      // Assuming the response format is suitable, you might need to adapt this
      const formattedQuotes = quotesData.map(post => ({ 
        text: post.title, // Adjust based on the actual data structure
        category: "Sample" // Adjust based on the actual data structure
      }));
      return formattedQuotes;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      // Handle the error (e.g., show an error message to the user)
      return []; // Return an empty array in case of error
    }
  }

  // ... your existing code ...

async function postQuoteToServer(newQuote) {
    try {
      const response = await fetch('/api/quotes', { // Replace with your actual server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote) 
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Handle successful response (e.g., show success message)
      console.log('Quote posted successfully!'); 
  
    } catch (error) {
      console.error('Error posting quote:', error);
      // Handle the error (e.g., show error message to the user)
    }
  }

  // ... your existing code ...

async function syncQuotes() {
    try {
      const serverQuotes = await fetchQuotesFromServer(); 
  
      // Implement the resolveConflicts function here
      const updatedQuotes = resolveConflicts(serverQuotes, quotes); 
  
      quotes = updatedQuotes;
      localStorage.setItem('quotes', JSON.stringify(quotes));
  
      showNotification("Quotes synchronized successfully!", "success");
  
    } catch (error) {
      console.error('Error syncing quotes:', error);
      showNotification("Error syncing quotes: " + error.message, "error");
    }
  }
  
  // Set the interval for checking for new quotes
  setInterval(syncQuotes, 5 * 60 * 1000); // 5 minutes in milliseconds
  
  // ... rest of your existing code ...
  
  function addQuote(newQuote) {
    quotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    showRandomQuote(); // Show the newly added quote
  
    postQuoteToServer(newQuote)
      .then(() => {
        // Handle successful post (e.g., show success message)
      })
      .catch(error => {
        // Handle error (e.g., show error message to the user)
      });
  }
  
  
async function syncQuotes() {
    try {
      const serverQuotes = await fetchQuotesFromServer(); 
  
      // ... (your conflict resolution logic) ...
  
      quotes = updatedQuotes;
      localStorage.setItem('quotes', JSON.stringify(quotes));
  
      showNotification("Quotes synchronized successfully!", "success"); 
  
    } catch (error) {
      console.error('Error syncing quotes:', error);
      showNotification("Error syncing quotes: " + error.message, "error");
    }
  }
  // ... (your existing code) ...

  function showNotification(message, type) {
    if (message === "Quotes synced with server!") {
      // Handle specific styling or actions for this message (optional)
      notificationBar.style.backgroundColor = "lightgreen"; 
    }
  
    notificationBar.textContent = message;
    notificationBar.classList.add(type); 
  
    // Optionally, clear the notification after a few seconds
    setTimeout(() => {
      notificationBar.textContent = '';
      notificationBar.classList.remove(type);
    }, 3000); // Clear after 3 seconds
  }
  
  // ... (rest of your existing code) ...
async function postQuoteToServer(newQuote) {
  return new Promise((resolve, reject) => {
    // Simulate a server response with a short delay
    setTimeout(() => {
      // In a real-world scenario, you would send the data to your actual server
      // Here, we simulate a successful response
      resolve(); 
    }, 500); 
  });
}

// Load quotes from local storage on page load and fetch from server
window.addEventListener('load', () => {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }

    // ... (your existing fetchQuotesFromServer logic here) ...

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