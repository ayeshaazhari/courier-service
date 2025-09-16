const Offer = require("../models/Offer");

class OfferRepository {
  constructor() {
    this.offers = [
      new Offer("OFR001", 10, 0, 200, 70, 200),
      new Offer("OFR002", 7, 50, 150, 100, 250),
      new Offer("OFR003", 5, 50, 250, 10, 150),
    ];
  }

  getOffer(code) {
    return this.offers.find((o) => o.code === code);
  }
}

module.exports = OfferRepository;
