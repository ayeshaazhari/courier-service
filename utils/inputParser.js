const Package = require("../models/Package");
const Vehicle = require("../models/Vehicle");
const AppError = require("./appError");
const InputValidator = require("./validator");

class InputParser {
  static parseInput(lines) {
    if (!lines.length) throw new AppError("Input file is empty.");
    try {
      const [baseCost, noOfPackages] = lines[0]
        .split(" ")
        .map((v) => (isNaN(v) ? v : Number(v)));

      let packages = [];
      let vehicles = [];

      for (let i = 1; i <= noOfPackages; i++) {
        let [id, w, d, code] = lines[i].split(" ");
        packages.push(new Package(id, Number(w), Number(d), code));
      }

      InputValidator.validatePackages(packages);

      if (lines.length > noOfPackages + 1) {
        let [noOfVehicles, speed, maxWeight] = lines[noOfPackages + 1]
          .split(" ")
          .map(Number);
        for (let i = 0; i < noOfVehicles; i++) {
          vehicles.push(new Vehicle(i + 1, speed, maxWeight));
        }
        InputValidator.validateVehicles(vehicles);
      }

      return { baseCost, packages, vehicles };
    } catch (err) {
      throw new AppError(`${err.message}`, "VALIDATION_ERROR");
    }
  }
}

module.exports = InputParser;
