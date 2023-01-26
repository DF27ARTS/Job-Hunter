const { Router } = require("express");
const { card, userProfile } = require("../db");
const router = Router();

const { verifyToken } = require("./authorization");

router.get("/cards", [verifyToken], async (req, res) => {
  try {
    const { cards } = await userProfile.findOne({
      where: { email: req.email },
      include: [card],
    });

    const cardsOrdered = cards.sort((a, b) => b.id - a.id);

    const cardsFiltered = [];
    let singleArray = [];
    let title = "";

    cardsOrdered.length &&
      cardsOrdered.map((card) => {
        const arraySplit = card.date.split("/");
        const day = parseInt(arraySplit[0]);
        const month = parseInt(arraySplit[1]);
        const year = parseInt(arraySplit[2]);
        const titleDate = `${day}/${month}/${year}`;
        const date = year + month + day;

        if (cardsOrdered.length === 1) {
          title = date.toString();
          singleArray = [{ title: titleDate }, card];
          cardsFiltered.push(singleArray);
        } else if (card.id === cardsOrdered[0].id) {
          title = date.toString();
          singleArray = [{ title: titleDate }, card];
        } else if (card.id === cardsOrdered[cardsOrdered.length - 1].id) {
          if (date.toString() === title) {
            singleArray.push(card);
            cardsFiltered.push(singleArray);
          } else {
            cardsFiltered.push(singleArray);
            title = date.toString();
            singleArray = [card];
            cardsFiltered.push(singleArray);
          }
        } else if (date.toString() === title) {
          singleArray.push(card);
        } else if (date.toString() !== title) {
          cardsFiltered.push(singleArray);
          title = date.toString();
          singleArray = [{ title: titleDate }, card];
        }
      });

    return cards.length
      ? res.status(200).send(cardsFiltered)
      : res.status(404).json({ error: "there are no cards available" });
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

    const setOfDates = new Set()
    const dates = []

    cards.forEach(async (card) => {
      setOfDates.add(card.date)
    })

    setOfDates.forEach(setDate => {
      dates.push(setDate)
    })
    
    dates.sort((a, b) => {
      return b.split("/").reduce((sum, item) => sum + item) - a.split("/").reduce((sum, item) => sum + item)
    })

    dates.length
      ? res.status(200).json(dates)
      : res.status(404).json({message: "There's been an error"})
      

  } catch (error) {
    return res.status(404).json({ error: "there's an error", message: error });
  }
})


router.get("/cards/search", [verifyToken], async (req, res) => {
  try {
    const { input, search } = req.query;
    const { email } = req;

    if (!search)
      return res.status(404).json({ error: "Required information is missing" });

    const { cards } = await userProfile.findOne({
      where: { email: email },
      include: [card],
    });

    const cardsFilter = [];
    cards.map((card) => {
      if (card[input].toLowerCase().includes(search.toLowerCase())) {
        cardsFilter.push(card);
      }
    });

    const cardsOrdered = cardsFilter.length
      ? cardsFilter.sort((a, b) => b.id - a.id)
      : null;

    const cardsFiltered = [];
    let singleArray = [];
    let title = "";

    if (cardsOrdered) {
      cardsOrdered.length &&
        cardsOrdered.map((card) => {
          const arraySplit = card.date.split("/");
          const day = parseInt(arraySplit[0]);
          const month = parseInt(arraySplit[1]);
          const year = parseInt(arraySplit[2]);
          const titleDate = `${day}/${month}/${year}`;
          const date = year + month + day;
          

          if (cardsOrdered.length === 1) {
            title = date.toString();
            singleArray = [{ title: titleDate }, card];
            cardsFiltered.push(singleArray);
          } else if (card.id === cardsOrdered[0].id) {
            title = date.toString();
            singleArray = [{ title: titleDate }, card];
          } else if (card.id === cardsOrdered[cardsOrdered.length - 1].id) {
            if (date.toString() === title) {
              singleArray.push(card);
              cardsFiltered.push(singleArray);
            } else {
              cardsFiltered.push(singleArray);
              title = date.toString();
              singleArray = [{ title: titleDate }, card];
              cardsFiltered.push(singleArray);
            }
          } else if (date.toString() === title) {
            singleArray.push(card);
          } else if (date.toString() !== title) {
            cardsFiltered.push(singleArray);
            title = date.toString();
            singleArray = [{ title: titleDate }, card];
          }
        });
    }

    return cardsFiltered.length
      ? res.status(200).json(cardsFiltered)
      : res.status(404).json({ error: "there are no matches in your search" });
  } catch (error) {
    return res.status(404).json({ error: "there's an error", message: error });
  }
});


router.post("/cards", [verifyToken], async (req, res) => {
  try {
    const { company, role, status, date, description } = req.body;
    if (!company || !role || !status || !date)
      return res.status(400).json({ error: "Missing required information" });

    const user = await userProfile.findOne({ where: { email: req.email } });

    const newCard = await card.create({
      company,
      role,
      status,
      date,
      description: description && description,
    });

    if (user) user.addCard(newCard);
    else return res.status(404).json({ error: "there's been an error" });

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

    cards.forEach( async (card) => {
      if (card.status === "rejected") {
        await card.destroy({where: {id: card.id}});
      }
    })

    return res.status(200).json({message: "Rejected cards deleted successfully"})
  } catch (error) {
    return res
    .status(404)
    .json({ error: "there's been an error", message: error.message });
  }
})


router.delete("/delete_by_date", [verifyToken], async (req, res) => {
  try {
    const { date } = req.query;

    const { cards } = await userProfile.findOne({
      where: { email: req.email },
      include: [card],
    });

    cards.forEach( async (card) => {
      if (card.date === date) {
        await card.destroy({where: {id: card.id}});
      }
    })
    
    return res.status(200).json({message: "Cards deleted successfully"})
  } catch (error) {
    return res
      .status(404)
      .json({ error: "there's been an error", message: error.message });
  }
})


module.exports = router;
