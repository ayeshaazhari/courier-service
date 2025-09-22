const fs = require("fs");
const InputParser = require("./utils/inputParser");
const OfferRepository = require("./repositories/offerrepository");
const CostCalculator = require("./services/costCalculator");
const DeliveryScheduler = require("./services/DeliveryScheduler");
const InputValidator = require("./utils/validator");
const AppError = require("./utils/appError");

function main() {
  try {
    // Register the unhandledRejection handler at the top level
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", "reason:", error);
      process.exit(1);
    });

    const input = fs.readFileSync(0, "utf-8").trim().split("\n");
    if (!input.length) throw new AppError("Input file is empty.");

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
          `${p.id} ${p.discount} ${
            p.totalCost
          } ${p.estimatedDeliveryTime.toFixed(2)}`
        );
      });
    }
  } catch (err) {
    if (err instanceof AppError) {
      console.error(`[${err.errorCode}] ${err.message}`);
    } else {
      console.error("Unexpected error:", err.message);
    }
    process.exit(1);
  }
}

main();
