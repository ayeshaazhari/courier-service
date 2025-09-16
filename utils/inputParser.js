const Package = require("../models/Package");
const Vehicle = require("../models/Vehicle");

class InputParser {
  static parseInput(lines) {
    const [baseCost, noOfPackages] = lines[0]
      .split(" ")
      .map((v) => (isNaN(v) ? v : Number(v)));

    let packages = [];
    let vehicles = [];

    for (let i = 1; i <= noOfPackages; i++) {
      let [id, w, d, code] = lines[i].split(" ");
      packages.push(new Package(id, Number(w), Number(d), code));
    }

    if (lines.length > noOfPackages + 1) {
      let [noOfVehicles, speed, maxWeight] = lines[noOfPackages + 1]
        .split(" ")
        .map(Number);
      for (let i = 0; i < noOfVehicles; i++) {
        vehicles.push(new Vehicle(i + 1, speed, maxWeight));
      }
    }

    return { baseCost, packages, vehicles };
  }
}

module.exports = InputParser;
