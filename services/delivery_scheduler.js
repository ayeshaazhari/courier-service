const AppError = require("../utils/app_error");
const InputValidator = require("../utils/validator");

class DeliveryScheduler {
  constructor(vehicles) {
    try {
      InputValidator.validateVehicles(vehicles);
      this.vehicles = vehicles;
    } catch (err) {
      throw new AppError(
        "Invalid vehicles configuration: " + err.message,
        "VALIDATION_ERROR"
      );
    }
  }

  schedule(packages) {
    try {
      InputValidator.validatePackages(packages);
      let pending = [...packages];

      // Utility: get all subsets under maxWeight
      const getValidShipmentsGreedy = (pkgs, maxWeight) => {
        // Sort packages: heavier first, then by original order
        const sortedPkgs = [...pkgs].sort((a, b) => b.weight - a.weight);

        const shipments = [];
        const used = new Array(sortedPkgs.length).fill(false);

        while (used.includes(false)) {
          let shipment = [];
          let totalWeight = 0;

          for (let i = 0; i < sortedPkgs.length; i++) {
            if (!used[i] && totalWeight + sortedPkgs[i].weight <= maxWeight) {
              shipment.push(sortedPkgs[i]);
              totalWeight += sortedPkgs[i].weight;
              used[i] = true;
            }
          }

          if (shipment.length > 0) {
            shipments.push(shipment);
          } else {
            // If no package fits, break to avoid infinite loop
            break;
          }
        }

        return shipments;
      };

      while (pending.length > 0) {
        // Pick next available vehicle
        let vehicle = this.vehicles.sort(
          (a, b) => a.availableAt - b.availableAt
        )[0];
        let tripStart = vehicle.availableAt;

        // Get all possible shipments under vehicle max weight
        let validShipments = getValidShipmentsGreedy(
          pending,
          vehicle.maxWeight
        );

        // if (validShipments.length === 0) break;

        if (validShipments.length === 0) {
          throw new AppError(
            "Some packages cannot be scheduled due to exceeding vehicle capacity."
          );
        }

        // Pick shipment with heaviest total weight
        validShipments.sort((a, b) => {
          const weightA = a.reduce((s, p) => s + p.weight, 0);
          const weightB = b.reduce((s, p) => s + p.weight, 0);
          if (weightA !== weightB) return weightB - weightA; // heavier first
          // if tie, choose shipment with earliest deliverable package (min distance)
          const distA = Math.min(...a.map((p) => p.distance));
          const distB = Math.min(...b.map((p) => p.distance));
          return distA - distB;
        });

        const shipment = validShipments[0];

        // Compute trip info
        const maxDist = Math.max(...shipment.map((p) => p.distance));
        const oneWayTime = maxDist / vehicle.speed;

        shipment.forEach((pkg) => {
          pkg.estimatedDeliveryTime = tripStart + pkg.distance / vehicle.speed;
        });

        // Vehicle returns after round trip
        vehicle.availableAt = tripStart + 2 * oneWayTime;

        // Remove shipped packages from pending
        shipment.forEach((p) => {
          const index = pending.indexOf(p);
          if (index > -1) pending.splice(index, 1);
        });
      }
    } catch (err) {
      throw new AppError(
        "Scheduling failed: " + err.message,
        "VALIDATION_ERROR"
      );
    }
  }
}

module.exports = DeliveryScheduler;
