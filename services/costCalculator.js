const AppError = require("../utils/appError");
const InputValidator = require("../utils/validator");
const { COST_PER_KG, COST_PER_KM } = require("../config/constants");

class CostCalculator {
  constructor(baseDeliveryCost, offerRepo) {
    if (!offerRepo) {
      throw new AppError("Offer repository must be provided.");
    }
    this.baseDeliveryCost = baseDeliveryCost;
    this.offerRepo = offerRepo;
  }

  calculate(pkg) {
    try {
      let baseCost =
        this.baseDeliveryCost +
        pkg.weight * COST_PER_KG +
        pkg.distance * COST_PER_KM;

      let offer = this.offerRepo.getOffer(pkg.offerCode);
      let discount = offer ? offer.apply(pkg, baseCost) : 0;

      pkg.discount = discount;
      pkg.totalCost = baseCost - discount;
    } catch (err) {
      throw new AppError(
        `Failed to calculate cost for ${pkg.id}: ${err.message}`,
        "VALIDATION_ERROR"
      );
    }
  }
}

module.exports = CostCalculator;
