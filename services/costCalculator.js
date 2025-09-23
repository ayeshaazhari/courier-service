const AppError = require("../utils/appError");
const { COST_PER_KG, COST_PER_KM } = require("../config/constants");

class CostCalculator {
  constructor(baseDeliveryCost, offerManager) {
    if (!offerManager) {
      throw new AppError("Offer manager must be provided.");
    }
    this.baseDeliveryCost = baseDeliveryCost;
    this.offerManager = offerManager;
  }

  calculate(pkg) {
    try {
      let baseCost =
        this.baseDeliveryCost +
        pkg.weight * COST_PER_KG +
        pkg.distance * COST_PER_KM;

      let offer = this.offerManager.getOffer(pkg.offerCode);
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
