const InputValidator = require("../utils/validator");
const AppError = require("../utils/appError");

describe("InputValidator", () => {
  // ------------------------
  // validateVehicles
  // ------------------------
  describe("validateVehicles", () => {
    test("should pass with valid vehicles", () => {
      const vehicles = [{ speed: 50, maxWeight: 200, availableAt: 0 }];
      expect(() => InputValidator.validateVehicles(vehicles)).not.toThrow();
    });

    test("should throw if vehicles is not an array", () => {
      expect(() => InputValidator.validateVehicles(null)).toThrow(AppError);
    });

    test("should throw if vehicles is empty", () => {
      expect(() => InputValidator.validateVehicles([])).toThrow(
        "Vehicles list must be a non-empty array."
      );
    });

    test("should throw if speed is invalid", () => {
      const vehicles = [{ speed: 0, maxWeight: 200, availableAt: 0 }];
      expect(() => InputValidator.validateVehicles(vehicles)).toThrow(
        " Vehicle[0] must have a valid positive speed."
      );
    });

    test("should throw if maxWeight is invalid", () => {
      const vehicles = [{ speed: 50, maxWeight: -10, availableAt: 0 }];
      expect(() => InputValidator.validateVehicles(vehicles)).toThrow(
        "Vehicle[0] must have a valid positive maxWeight."
      );
    });

    test("should throw if availableAt is invalid", () => {
      const vehicles = [{ speed: 50, maxWeight: 200, availableAt: -1 }];
      expect(() => InputValidator.validateVehicles(vehicles)).toThrow(
        "Vehicle[${i}] must have availableAt >= 0."
      );
    });
  });

  // ------------------------
  // validatePackages
  // ------------------------
  describe("validatePackages", () => {
    test("should pass with valid packages", () => {
      const packages = [{ id: "PKG1", weight: 20, distance: 50 }];
      expect(() => InputValidator.validatePackages(packages)).not.toThrow();
    });

    test("should throw if packages is not an array", () => {
      expect(() => InputValidator.validatePackages("invalid")).toThrow(
        "Packages must be an array."
      );
    });

    test("should throw if packages is empty", () => {
      expect(() => InputValidator.validatePackages([])).toThrow(
        "No packages to schedule."
      );
    });

    test("should throw if package id is invalid", () => {
      const packages = [{ id: 123, weight: 20, distance: 50 }];
      expect(() => InputValidator.validatePackages(packages)).toThrow(
        "Package[0] must have a valid id."
      );
    });

    test("should throw if weight is invalid", () => {
      const packages = [{ id: "PKG1", weight: -5, distance: 50 }];
      expect(() => InputValidator.validatePackages(packages)).toThrow(
        "Package[0] must have a valid positive weight."
      );
    });

    test("should throw if distance is invalid", () => {
      const packages = [{ id: "PKG1", weight: 20, distance: 0 }];
      expect(() => InputValidator.validatePackages(packages)).toThrow(
        "Package[0] must have a valid positive distance."
      );
    });
  });

  // ------------------------
  // validateBaseCost
  // ------------------------
  describe("validateBaseCost", () => {
    test("should pass with valid base cost", () => {
      expect(() => InputValidator.validateBaseCost(100)).not.toThrow();
    });

    test("should throw if base cost is not a number", () => {
      expect(() => InputValidator.validateBaseCost("100")).toThrow(
        "Base delivery cost must be a non-negative number."
      );
    });

    test("should throw if base cost is negative", () => {
      expect(() => InputValidator.validateBaseCost(-10)).toThrow(
        "Base delivery cost must be a non-negative number."
      );
    });
  });
});
