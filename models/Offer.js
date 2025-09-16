class Offer {
    constructor(code, discountPercent, minDist, maxDist, minWeight, maxWeight) {
      this.code = code;
      this.discountPercent = discountPercent;
      this.minDist = minDist;
      this.maxDist = maxDist;
      this.minWeight = minWeight;
      this.maxWeight = maxWeight;
    }
  
    isApplicable(pkg) {
      return (
        pkg.distance >= this.minDist &&
        pkg.distance <= this.maxDist &&
        pkg.weight >= this.minWeight &&
        pkg.weight <= this.maxWeight
      );
    }
  
    apply(pkg, baseCost) {
      return this.isApplicable(pkg) ? (baseCost * this.discountPercent) / 100 : 0;
    }
  }
  
  module.exports = Offer;
  