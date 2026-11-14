const destinationGrid = document.querySelector("#destinations .destination-grid");
const destinationToggle = document.querySelector(".destination-toggle");

if (destinationGrid && destinationToggle) {
  const cards = Array.from(destinationGrid.querySelectorAll(".destination-card"));
  const previewCount = 6;

  if (cards.length > previewCount) {
    const shuffledCards = cards.slice();

    for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledCards[index], shuffledCards[randomIndex]] = [shuffledCards[randomIndex], shuffledCards[index]];
    }

    const visibleCards = new Set(shuffledCards.slice(0, previewCount));
    cards.forEach((card) => {
      card.hidden = !visibleCards.has(card);
    });

    destinationToggle.hidden = false;
    destinationToggle.addEventListener("click", () => {
      const expanded = destinationToggle.getAttribute("aria-expanded") !== "true";
      cards.forEach((card) => {
        card.hidden = !expanded && !visibleCards.has(card);
      });
      destinationToggle.setAttribute("aria-expanded", String(expanded));
      destinationToggle.dataset.i18n = expanded ? "showFewer" : "viewMore";
      window.applyLanguage();
    });
  }
}
