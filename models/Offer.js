class Offer {
  constructor({ code, discountPercentage, conditions }) {
    this.code = code;
    this.discountPercentage = discountPercentage;
    this.conditions = conditions;
  }

  isApplicable(pkg) {
    const { minWeight, maxWeight, minDistance, maxDistance } = this.conditions;
    return (
      pkg.weight >= minWeight &&
      pkg.weight <= maxWeight &&
      pkg.distance >= minDistance &&
      pkg.distance <= maxDistance
    );
  }
  apply(pkg, baseCost) {
    return this.isApplicable(pkg)
      ? (baseCost * this.discountPercentage) / 100
      : 0;
  }
}
module.exports = Offer;
