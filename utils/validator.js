const AppError = require("./appError");

class InputValidator {
  static validateVehicles(vehicles) {
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      throw new AppError(
        "Vehicles list must be a non-empty array.",
        "VALIDATION_ERROR"
      );
    }

    vehicles.forEach((v, i) => {
      if (typeof v.speed !== "number" || v.speed <= 0) {
        throw new AppError(
          ` Vehicle[${i}] must have a valid positive speed.`,
          "VALIDATION_ERROR"
        );
      }
      if (typeof v.maxWeight !== "number" || v.maxWeight <= 0) {
        throw new AppError(
          `Vehicle[${i}] must have a valid positive maxWeight.`,
          "VALIDATION_ERROR"
        );
      }
      if (typeof v.availableAt !== "number" || v.availableAt < 0) {
        throw new AppError("Vehicle[${i}] must have availableAt >= 0.", 400);
      }
    });
  }

  static validatePackages(packages) {
    if (!Array.isArray(packages)) {
      throw new AppError("Packages must be an array.", "VALIDATION_ERROR");
    }

    if (packages.length === 0) {
      throw new AppError("No packages to schedule.", "VALIDATION_ERROR");
    }

    packages.forEach((p, i) => {
      if (!p.id || typeof p.id !== "string") {
        throw new AppError(
          `Package[${i}] must have a valid id.`,
          "VALIDATION_ERROR"
        );
      }
      if (typeof p.weight !== "number" || p.weight <= 0) {
        throw new AppError(
          `Package[${i}] must have a valid positive weight.`,
          "VALIDATION_ERROR"
        );
      }
      if (typeof p.distance !== "number" || p.distance <= 0) {
        throw new AppError(
          `Package[${i}] must have a valid positive distance.`,
          "VALIDATION_ERROR"
        );
      }
    });
  }

  static validateBaseCost(baseCost) {
    if (typeof baseCost !== "number" || baseCost < 0) {
      throw new AppError(
        "Base delivery cost must be a non-negative number.",
        "VALIDATION_ERROR"
      );
    }
  }
}

module.exports = InputValidator;
