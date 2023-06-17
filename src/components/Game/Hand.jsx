import "./Hand.css";

const Hand = ({ cards, updateSelectedCards, checkIfSelected }) => {
  const convertToFaceValue = (value) => {
    if (value === 14) {
      return "A";
    } else if (value === 13) {
      return "K";
    } else if (value === 12) {
      return "Q";
    } else if (value === 11) {
      return "J";
    } else {
      return value;
    }
  };

  const convertToSymbol = (value) => {
    if (value === "Spades") {
      return "♠";
    } else if (value === "Hearts") {
      return "♥";
    } else if (value === "Clubs") {
      return "♣";
    } else {
      return "♦";
    }
  };

  return (
    <div className="hand">
      {cards?.map((card, idx) => (
        <div
          onClick={() => updateSelectedCards(card)}
          className="card"
          style={{
            border: checkIfSelected(card)
              ? "3px solid black"
              : "3px solid white",
            opacity: checkIfSelected(card) ? ".7" : "1",
          }}
          key={`card-${idx}`}
        >
          <div
            className="card-values"
            style={{
              color:
                card.suit === "Spades" || card.suit === "Clubs"
                  ? "black"
                  : "#ff3322",
            }}
          >
            <span className="card-number">
              {convertToFaceValue(card.value)}
            </span>
            <span className="card-suit">{convertToSymbol(card.suit)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hand;
