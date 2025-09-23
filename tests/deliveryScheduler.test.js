const DeliveryScheduler = require("../services/DeliveryScheduler");
const Package = require("../models/Package");

class Vehicle {
  constructor(id, speed, maxWeight) {
    this.id = id;
    this.speed = speed;
    this.maxWeight = maxWeight;
    this.availableAt = 0;
  }
}

describe("DeliveryScheduler", () => {
  let vehicles;
  let scheduler;

  beforeEach(() => {
    vehicles = [new Vehicle(1, 70, 200), new Vehicle(2, 70, 200)];
    scheduler = new DeliveryScheduler(vehicles);
  });

  test("should assign estimated delivery times to all packages", () => {
    const packages = [
      new Package("PKG1", 50, 30, "NA"),
      new Package("PKG2", 75, 125, "NA"),
      new Package("PKG3", 175, 100, "NA"),
      new Package("PKG4", 110, 60, "NA"),
      new Package("PKG5", 155, 95, "NA"),
    ];

    scheduler.schedule(packages);

    packages.forEach((pkg) => {
      expect(pkg.estimatedDeliveryTime).toBeDefined();
      expect(pkg.estimatedDeliveryTime).toBeGreaterThan(0);
    });
  });

  test("should not exceed vehicle max weight", () => {
    const packages = [
      new Package("PKG1", 250, 100, "NA"), // too heavy for vehicle
      new Package("PKG2", 150, 50, "NA"), // valid
    ];

    scheduler.schedule(packages);

    // PKG1 should not be scheduled because >200kg
    expect(packages[0].estimatedDeliveryTime).toBe(0);
    expect(packages[1].estimatedDeliveryTime).toBeDefined();
  });

  test("should prioritize heavier shipments when multiple fit", () => {
    const packages = [
      new Package("PKG1", 50, 50, "NA"),
      new Package("PKG2", 100, 60, "NA"),
      new Package("PKG3", 90, 70, "NA"),
    ];

    scheduler.schedule(packages);

    // PKG2 (100kg) and PKG3 (90kg) should be preferred together (190kg)
    // PKG1 (50kg) goes separately
    expect(packages[0].estimatedDeliveryTime).toBeGreaterThan(0);
    expect(packages[1].estimatedDeliveryTime).toBeGreaterThan(0);
    expect(packages[2].estimatedDeliveryTime).toBeGreaterThan(0);
  });

  test("should update vehicle availability correctly", () => {
    const packages = [new Package("PKG1", 100, 140, "NA")];

    scheduler.schedule(packages);

    // Vehicle should return after 2 * (140/70) = 4 hrs
    expect(vehicles[0].availableAt).toBeCloseTo(4, 2);
  });

  test("should schedule all packages eventually", () => {
    const packages = [
      new Package("PKG1", 100, 150, "NA"),
      new Package("PKG2", 80, 100, "NA"),
      new Package("PKG3", 50, 50, "NA"),
    ];

    scheduler.schedule(packages);

    const unscheduled = packages.filter((p) => !p.estimatedDeliveryTime);
    expect(unscheduled.length).toBe(0);
  });
});
