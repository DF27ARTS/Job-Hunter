const { Router } = require("express");
const { card, userProfile } = require("../db");
const router = Router();

const { verifyToken } = require("./authorization");

router.get("/cards", [verifyToken], async (req, res) => {
  try {
    const { property, input, initialDate } = req.query;

    const { format } = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });

    const { cards } = await userProfile.findOne({
      where: { email: req.email },
      include: [card],
    });

    const cardsOrdered = cards.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/");
      const [dayB, monthB, yearB] = b.date.split("/");
      const dateA = yearA + format(monthA) + format(dayA);
      const dateB = yearB + format(monthB) + format(dayB);
      return parseInt(dateB) - parseInt(dateA);
    });

    const [InisialDay, InisialMonth, InisialYear] = initialDate
      ? initialDate.split("/")
      : [null, null, null];

    // Initial date send in the query
    const InitialDate =
      InisialDay && InisialMonth && InisialYear
        ? parseInt(InisialYear + format(InisialMonth) + format(InisialDay))
        : null;

    // First date of the array cardsOrdered
    const [day, month, year] = cardsOrdered[0].date.split("/");
    let firtsDate = parseInt(year + format(month) + format(day));
    let counter = 1;

    const allCards = [];

    // Push to the allCards array all the cards fron the ten fist days
    // starting fron the InitialDate is it's send in the quey or firtsDate otherwise
    cardsOrdered.forEach((card) => {
      const [day, month, year] = card.date.split("/");
      let currentDate = parseInt(year + format(month) + format(day));

      if (currentDate >= InitialDate && InitialDate) {
        firtsDate = currentDate;
        return;
      }

      // Change this number to change the amount of cards per request
      if (counter <= 10) allCards.push(card);

      if (firtsDate !== currentDate) {
        counter += 1;
        firtsDate = currentDate;
      }
    });

    const cardsFiltered = [];
    let singleArray = [];
    let title = "";

    // Filter all the cards in the allCards array and create an array of overy single day
    // creating an array of arrays with the cards
    allCards.length &&
      allCards.map((card) => {
        if (card.date) {
          const [day, month, year] = card.date.split("/");
          const titleDate = `${day}/${month}/${year}`;
          const date = parseInt(year) + parseInt(month) + parseInt(day);

          if (allCards.length === 1) {
            title = date.toString();
            singleArray = [{ title: titleDate }, card];
            cardsFiltered.push(singleArray);
            return;
          }
          if (card.id === allCards[0].id) {
            title = date.toString();
            singleArray = [{ title: titleDate }, card];
            return;
          }
          if (card.id === allCards[allCards.length - 1].id) {
            if (date.toString() === title) {
              singleArray.push(card);
              cardsFiltered.push(singleArray);
            } else {
              cardsFiltered.push(singleArray);
              title = date.toString();
              singleArray = [{ title: titleDate }, card];
              cardsFiltered.push(singleArray);
            }
            return;
          }
          if (date.toString() === title) {
            singleArray.push(card);
            return;
          }
          if (date.toString() !== title) {
            cardsFiltered.push(singleArray);
            title = date.toString();
            singleArray = [{ title: titleDate }, card];
            return;
          }
        }
      });

    const LAST_USER_CARD =
      cardsFiltered[cardsFiltered.length - 1][
        cardsFiltered[cardsFiltered.length - 1].length - 1
      ];

    if (
      cardsFiltered.length &&
      LAST_USER_CARD === cardsOrdered[cardsOrdered.length - 1]
    )
      return res.status(200).json({ lastSlice: true, cards: cardsFiltered });

    return cardsFiltered.length
      ? res.status(200).json({ lastSlice: false, cards: cardsFiltered })
      : res.status(404).json({ error: "There are no cards available" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "there's been an error", message: error.message });
  }
});

router.get("/get_dates", [verifyToken], async (req, res) => {
  try {
    const { cards } = await userProfile.findOne({
      where: { email: req.email },
      include: [card],
    });

    // const setOfDates = new Set();
    const dates = [...new Set([...cards.map((card) => card.date)])];

    dates.sort((a, b) => {
      const [day_b, month_b, year_b] = b.split("/");
      const [day_a, month_a, year_a] = a.split("/");
      if (year_b !== year_a) {
        return year_b - year_a;
      } else if (month_b !== month_a) {
        return month_b - month_a;
      } else {
        return day_b - day_a;
      }
    });

    dates.length
      ? res.status(200).json(dates)
      : res.status(404).json({ message: "There's been an error" });
  } catch (error) {
    return res.status(404).json({ error: "there's an error", message: error });
  }
});

router.get("/cards/search", [verifyToken], async (req, res) => {
  try {
    const { property, input, initialDate } = req.query;

    const { email } = req;

    if (!property || !input)
      return res.status(404).json({ error: "Required information is missing" });

    const { format } = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });

    const { cards } = await userProfile.findOne({
      where: { email: email },
      include: [card],
    });

    const cardsThatMatchTheInput = [];
    cards.map((card) => {
      const newCard = card.dataValues || card;
      if (newCard[property].toLowerCase().includes(input.toLowerCase())) {
        cardsThatMatchTheInput.push(newCard);
      }
    });

    const cardsOrdered = cardsThatMatchTheInput.length
      ? cardsThatMatchTheInput.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split("/");
          const [dayB, monthB, yearB] = b.date.split("/");
          const dateA = yearA + format(monthA) + format(dayA);
          const dateB = yearB + format(monthB) + format(dayB);
          return parseInt(dateB) - parseInt(dateA);
        })
      : null;

    const [InisialDay, InisialMonth, InisialYear] = initialDate
      ? initialDate.split("/")
      : [null, null, null];

    // Initial date send in the query
    const InitialDate =
      InisialDay && InisialMonth && InisialYear
        ? parseInt(InisialYear + format(InisialMonth) + format(InisialDay))
        : null;

    // First date of the array cardsOrdered
    const [day, month, year] = cardsOrdered[0].date.split("/");
    let firtsDate = parseInt(year + format(month) + format(day));
    let counter = 1;

    const allCards = [];

    // Push to the allCards array all the cards fron the ten fist days
    // starting fron the InitialDate is it's send in the quey or firtsDate otherwise
    cardsOrdered.forEach((card) => {
      const [day, month, year] = card.date.split("/");
      let currentDate = parseInt(year + format(month) + format(day));

      if (currentDate >= InitialDate && InitialDate) {
        firtsDate = currentDate;
        return;
      }

      // Change the 10 number to change the amount of cards per request
      if (counter <= 10) allCards.push(card);

      if (firtsDate !== currentDate) {
        counter += 1;
        firtsDate = currentDate;
      }
    });

    const cardsFiltered = [];
    let singleArray = [];
    let title = "";

    if (cardsOrdered) {
      allCards.length &&
        allCards.map((card) => {
          if (card.date) {
            const [day, month, year] = card.date.split("/");
            const titleDate = `${day}/${month}/${year}`;
            const date = parseInt(year) + parseInt(month) + parseInt(day);

            if (allCards.length === 1) {
              title = date.toString();
              singleArray = [{ title: titleDate }, card];
              cardsFiltered.push(singleArray);
              return;
            }
            if (card.id === allCards[0].id) {
              title = date.toString();
              singleArray = [{ title: titleDate }, card];
              return;
            }
            if (card.id === allCards[allCards.length - 1].id) {
              if (date.toString() === title) {
                singleArray.push(card);
                cardsFiltered.push(singleArray);
              } else {
                cardsFiltered.push(singleArray);
                title = date.toString();
                singleArray = [{ title: titleDate }, card];
                cardsFiltered.push(singleArray);
              }
              return;
            }
            if (date.toString() === title) {
              singleArray.push(card);
              return;
            }
            if (date.toString() !== title) {
              cardsFiltered.push(singleArray);
              title = date.toString();
              singleArray = [{ title: titleDate }, card];
              return;
            }
          }
        });
    }

    const LAST_USER_CARD =
      cardsFiltered[cardsFiltered.length - 1][
        cardsFiltered[cardsFiltered.length - 1].length - 1
      ];

    if (
      cardsFiltered.length &&
      LAST_USER_CARD === cardsOrdered[cardsOrdered.length - 1]
    )
      return res.status(200).json({ lastSlice: true, cards: cardsFiltered });

    return cardsFiltered.length
      ? res.status(200).json({ lastSlice: false, cards: cardsFiltered })
      : res.status(404).json({ error: "There are no matches in your search" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "there's an error", message: error });
  }
});

router.post("/cards", [verifyToken], async (req, res) => {
  try {
    const { company, role, status, date, description } = req.body;
    const { email } = req;
    if (!company || !role || !status || !date)
      return res.status(400).json({ error: "Missing required information" });

    const user = await userProfile.findOne({ where: { email: email } });

    if (!user) return res.status(404).json({ error: "User unauthorize" });

    const newCard = await card.create({
      company,
      role,
      status,
      date,
      description: description && description,
    });

    if (newCard) user.addCard(newCard);
    else
      return res
        .status(404)
        .json({ error: "There's been an error creating the card" });

    return res
      .status(200)
      .json({ message: "Card created successfully", card: newCard });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "there's been an error", message: error.message });
  }
});

router.put("/cards", [verifyToken], async (req, res) => {
  try {
    const { card_id } = req.query;
    const { company, role, status } = req.body;
    if (!company || !role || !status)
      return res.status(400).json({ error: "Missing required information" });

    const cardUpdated = await card.update(req.body, {
      where: {
        id: card_id,
      },
    });

    if (cardUpdated[0] !== 1)
      return res.status(404).json({ messge: "Card not found" });

    const cardFound = await card.findOne({ where: { id: card_id } });

    return res
      .status(200)
      .json({ messge: "Card updated successfully", card: cardFound });
  } catch (error) {
    return res
      .status(404)
      .json({ messge: "there's been an error", message: error.message });
  }
});

router.delete("/cards", [verifyToken], async (req, res) => {
  try {
    const { card_id } = req.query;
    const cardDestroyed = await card.destroy({ where: { id: card_id } });

    return cardDestroyed
      ? res.status(200).json({ message: "Card deleted successfully" })
      : res.status(400).json({ error: "Card id doesn't exist" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "there's been an error", message: error.message });
  }
});

router.delete("/delete_rejected", [verifyToken], async (req, res) => {
  try {
    const { cards } = await userProfile.findOne({
      where: { email: req.email },
      include: [card],
    });

    cards.forEach(async (card) => {
      if (card.status === "rejected") {
        await card.destroy({ where: { id: card.id } });
      }
    });

    return res
      .status(200)
      .json({ message: "Rejected cards deleted successfully" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "there's been an error", message: error.message });
  }
});

router.delete("/delete_by_date", [verifyToken], async (req, res) => {
  try {
    const { date } = req.query;

    const { cards } = await userProfile.findOne({
      where: { email: req.email },
      include: [card],
    });

    cards.forEach(async (card) => {
      if (card.date === date) {
        await card.destroy({ where: { id: card.id } });
      }
    });

    return res.status(200).json({ message: "Cards deleted successfully" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "there's been an error", message: error.message });
  }
});

module.exports = router;
