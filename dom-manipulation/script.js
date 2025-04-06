let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "If you judge people, you have no time to love them.", category: "Love" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");


  while (categoryFilter.firstChild) {
    categoryFilter.removeChild(categoryFilter.firstChild);
  }

  const selectedCategory = localStorage.getItem("selectedCategory") || "all";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  if (selectedCategory === "all") allOption.selected = true;
  categoryFilter.appendChild(allOption);

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === selectedCategory) opt.selected = true;
    categoryFilter.appendChild(opt);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = "";

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

function showRandomQuote() {
  filterQuotes();
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(document.createElement("br"));
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(document.createElement("br"));
  formContainer.appendChild(addBtn);
}

function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCat = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCat) {
    quotes.push({ text: quoteText, category: quoteCat });
    saveQuotes();
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Failed to import quotes.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  const last = sessionStorage.getItem("lastQuote");
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (last) {
    const { text, category } = JSON.parse(last);
    quoteDisplay.textContent = `"${text}" — ${category}`;
  } else {
    filterQuotes();
  }
});
