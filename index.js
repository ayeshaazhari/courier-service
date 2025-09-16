const fs = require("fs");
const InputParser = require("./utils/inputParser");
const OfferRepository = require("./repositories/offerrepository");
const CostCalculator = require("./services/costCalculator");
const DeliveryScheduler = require("./services/DeliveryScheduler");

function main() {
  const input = fs.readFileSync(0, "utf-8").trim().split("\n");
  const { baseCost, packages, vehicles } = InputParser.parseInput(input);

  const offerRepo = new OfferRepository();

  const calculator = new CostCalculator(baseCost, offerRepo);
  packages.forEach((p) => calculator.calculate(p));

  if (vehicles.length == 0) {
    // Print Output
    packages.forEach((p) => {
      console.log(`${p.id} ${p.discount} ${p.totalCost}`);
    });
  } else {
    const scheduler = new DeliveryScheduler(vehicles);

    scheduler.schedule(packages);

    // Print Output
    packages.forEach((p) => {
      console.log(
        `${p.id} ${p.discount} ${p.totalCost} ${p.estimatedDeliveryTime.toFixed(
          2
        )}`
      );
    });
  }
}

main();
