document.addEventListener("DOMContentLoaded", () => {
    // We assume tarotCards is loaded globally from tarotData.js

    // =====================================
    // CARDS.HTML LOGIC
    // =====================================
    const tableBody = document.getElementById("tarot-table-body");
    const searchInput = document.getElementById("card-search");

    if (tableBody && typeof tarotCards !== 'undefined') {
        const majorArcanaOrder = [
            "the-fool", "the-magician", "the-high-priestess", "the-empress", "the-emperor",
            "the-hierophant", "the-lovers", "the-chariot", "strength", "the-hermit",
            "wheel-of-fortune", "justice", "the-hanged-man", "death", "temperance",
            "the-devil", "the-tower", "the-star", "the-moon", "the-sun", "judgement", "the-world"
        ];

        const romanNumerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
            "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

        const renderCards = (cards) => {
            tableBody.innerHTML = "";
            cards.forEach(card => {
                const tr = document.createElement("tr");
                const typeClass = card.type === "Major Arcana" ? "type-major" : "type-minor";

                // Formatting the display name
                const displayName = card.name.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                // Determine the card number
                let cardNumber = "-";
                if (card.type === "Major Arcana") {
                    const idx = majorArcanaOrder.indexOf(card.slug);
                    if (idx !== -1) cardNumber = romanNumerals[idx];
                } else {
                    const firstWord = card.name.split(' ')[0].toLowerCase();
                    const numberMap = {
                        "ace": "Ace", "two": "2", "three": "3", "four": "4", "five": "5",
                        "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
                        "page": "Page", "knight": "Knight", "queen": "Queen", "king": "King"
                    };
                    cardNumber = numberMap[firstWord] || firstWord;
                }

                // Make the entire row clickable to navigate to the dynamic page
                tr.style.cursor = "pointer";
                tr.onclick = () => {
                    window.location.href = `card-detail.html?slug=${card.slug}`;
                };

                tr.innerHTML = `
                    <td>${cardNumber}</td>
                    <td><strong>${displayName}</strong></td>
                    <td><span class="card-type ${typeClass}">${card.type}</span></td>
                `;
                tableBody.appendChild(tr);
            });
        };

        // Initial render
        renderCards(tarotCards);

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredCards = tarotCards.filter(card =>
                    card.name.toLowerCase().includes(searchTerm) ||
                    card.type.toLowerCase().includes(searchTerm) ||
                    card.slug.toLowerCase().includes(searchTerm)
                );
                renderCards(filteredCards);
            });
        }
    }

    // =====================================
    // CARD-DETAIL.HTML LOGIC
    // =====================================
    const cardDetailContent = document.getElementById("card-detail-content");

    if (cardDetailContent && typeof tarotCards !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (slug) {
            const card = tarotCards.find(c => c.slug === slug);

            if (card) {
                const displayName = card.name.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                const typeClass = card.type === "Major Arcana" ? "type-major" : "type-minor";

                // Format meaning text: replace \n with <br> and bold certain tags if needed
                const formattedMeaning = card.meaning.replace(/\n/g, '<br>');

                cardDetailContent.innerHTML = `
                    <div class="card-header">
                        <h1>${displayName}</h1>
                        <span class="card-type ${typeClass} large-type">${card.type}</span>
                    </div>
                    <div class="card-meaning">
                        <p>${formattedMeaning}</p>
                    </div>
                    <div class="card-actions">
                        <a href="https://www.shitsuren-tarot.com/tarot/${card.slug}/" target="_blank" class="external-link-btn">
                            <i class="fas fa-external-link-alt"></i> Read Full Meaning on Shitsuren Tarot
                        </a>
                    </div>
                `;
            } else {
                cardDetailContent.innerHTML = `<h2>Card not found</h2><p>The mystical energies cannot locate this card.</p>`;
            }
        } else {
            cardDetailContent.innerHTML = `<h2>No Card Selected</h2><p>Please select a card from the Deck.</p>`;
        }
    }
});
