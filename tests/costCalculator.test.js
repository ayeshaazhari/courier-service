const CostCalculator = require("../services/costCalculator");
const Package = require("../models/Package");

// Mock OfferRepo
class MockOfferRepo {
  constructor() {
    this.offers = {
      OFR001: {
        apply: (pkg, baseCost) => {
          if (pkg.distance < 200 && pkg.weight >= 70 && pkg.weight <= 200) {
            return baseCost * 0.1; // 10%
          }
          return 0;
        },
      },
      OFR002: {
        apply: (pkg, baseCost) => {
          if (
            pkg.distance >= 50 &&
            pkg.distance <= 150 &&
            pkg.weight >= 100 &&
            pkg.weight <= 250
          ) {
            return baseCost * 0.07; // 7%
          }
          return 0;
        },
      },
      OFR003: {
        apply: (pkg, baseCost) => {
          if (
            pkg.distance >= 50 &&
            pkg.distance <= 250 &&
            pkg.weight >= 10 &&
            pkg.weight <= 150
          ) {
            return baseCost * 0.05; // 5%
          }
          return 0;
        },
      },
    };
  }

  getOffer(code) {
    return this.offers[code];
  }
}

class FaultyOfferRepo {
  getOffer() {
    return {
      apply: () => {
        throw new Error("Offer rule broken!");
      },
    };
  }
}

describe("CostCalculator with OfferRepo", () => {
  let calculator;

  beforeAll(() => {
    calculator = new CostCalculator(100, new MockOfferRepo());
  });

  test("should throw error if offerManager is not provided", () => {
    expect(() => new CostCalculator(100, null)).toThrow(
      "Offer manager must be provided."
    );
  });

  test("should apply OFR001 correctly when conditions are met", () => {
    const pkg = new Package("PKG1", 100, 150, "OFR001"); // valid for OFR001
    calculator.calculate(pkg);

    const baseCost = 100 + 100 * 10 + 150 * 5; // 100 + 1000 + 750 = 1850
    const expectedDiscount = baseCost * 0.1; // 185
    const expectedTotal = baseCost - expectedDiscount; // 1665

    expect(pkg.discount).toBe(expectedDiscount);
    expect(pkg.totalCost).toBe(expectedTotal);
  });

  test("should apply OFR002 correctly when conditions are met", () => {
    const pkg = new Package("PKG2", 150, 100, "OFR002");
    calculator.calculate(pkg);

    const baseCost = 100 + 150 * 10 + 100 * 5; // 100 + 1500 + 500 = 2100
    const expectedDiscount = baseCost * 0.07; // 147
    const expectedTotal = baseCost - expectedDiscount; // 1953

    expect(pkg.discount).toBe(expectedDiscount);
    expect(pkg.totalCost).toBe(expectedTotal);
  });

  test("should apply OFR003 correctly when conditions are met", () => {
    const pkg = new Package("PKG3", 50, 200, "OFR003");
    calculator.calculate(pkg);

    const baseCost = 100 + 50 * 10 + 200 * 5; // 100 + 500 + 1000 = 1600
    const expectedDiscount = baseCost * 0.05; // 80
    const expectedTotal = baseCost - expectedDiscount; // 1520

    expect(pkg.discount).toBe(expectedDiscount);
    expect(pkg.totalCost).toBe(expectedTotal);
  });

  test("should return 0 discount for invalid offer code", () => {
    const pkg = new Package("PKG4", 80, 120, "INVALID");
    calculator.calculate(pkg);

    const baseCost = 100 + 80 * 10 + 120 * 5; // 100 + 800 + 600 = 1500
    expect(pkg.discount).toBe(0);
    expect(pkg.totalCost).toBe(baseCost);
  });

  test("should return 0 discount if criteria not met", () => {
    const pkg = new Package("PKG5", 20, 20, "OFR001"); // too light
    calculator.calculate(pkg);

    const baseCost = 100 + 20 * 10 + 20 * 5; // 100 + 200 + 100 = 400
    expect(pkg.discount).toBe(0);
    expect(pkg.totalCost).toBe(baseCost);
  });

  test("should handle very large weight and distance", () => {
    const pkg = new Package("PKG_BIG", 100000, 50000, "OFR001");
    calculator.calculate(pkg);
    expect(pkg.totalCost).toBe(1250100);
    expect(pkg.discount).toBeGreaterThanOrEqual(0);
  });

  test("should calculate cost correctly for zero weight and distance", () => {
    const pkg = new Package("PKG_ZERO", 0, 0, "OFR003");
    calculator.calculate(pkg);

    const baseCost = 100; // only baseDeliveryCost applies
    expect(pkg.discount).toBe(0);
    expect(pkg.totalCost).toBe(baseCost);
  });

  test("should wrap error if offer apply throws exception", () => {
    const faultyCalculator = new CostCalculator(100, new FaultyOfferRepo());
    const pkg = new Package("PKG_FAULT", 50, 50, "OFR001");
    expect(() => faultyCalculator.calculate(pkg)).toThrow(
      /Failed to calculate cost/
    );
  });
});
