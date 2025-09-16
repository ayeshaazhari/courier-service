class CostCalculator {
    constructor(baseDeliveryCost, offerRepo) {
      this.baseDeliveryCost = baseDeliveryCost;
      this.offerRepo = offerRepo;
    }
  
    calculate(pkg) {
      let baseCost =
        this.baseDeliveryCost + pkg.weight * 10 + pkg.distance * 5;
  
      let offer = this.offerRepo.getOffer(pkg.offerCode);
      let discount = offer ? offer.apply(pkg, baseCost) : 0;
  
      pkg.discount = discount;
      pkg.totalCost = baseCost - discount;
    }
  }
  
  module.exports = CostCalculator;
  