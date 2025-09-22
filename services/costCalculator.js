const AppError = require("../utils/appError");
const InputValidator = require("../utils/validator");

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
      let baseCost = this.baseDeliveryCost + pkg.weight * 10 + pkg.distance * 5;

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
