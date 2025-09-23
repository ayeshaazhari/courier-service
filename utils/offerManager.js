const fs = require("fs");
const path = require("path");
const Offer = require("../models/Offer");

class OfferManager {
  constructor() {
    this.offers = new Map();
    this.loadOffers();
  }

  loadOffers() {
    const filePath = path.join(__dirname, "..", "config", "offers.json");
    const rawData = fs.readFileSync(filePath);
    const offers = JSON.parse(rawData);

    offers.forEach((o) => {
      this.register(new Offer(o));
    });
  }

  register(offer) {
    this.offers.set(offer.code, offer);
  }

  getOffer(code) {
    return this.offers.get(code) || null;
  }
}

module.exports = OfferManager;
