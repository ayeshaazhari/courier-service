const AppError = require("../utils/appError");
const InputValidator = require("../utils/validator");
const VehicleManager = require("../utils/vehicleManager");
const ShipmentManager = require("../utils/shipmentManager");
const PackageManager = require("../utils/packageManager");

class DeliveryScheduler {
  constructor(vehicles) {
    try {
      InputValidator.validateVehicles(vehicles);
      this.vehicleManager = new VehicleManager(vehicles);
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

      while (pending.length > 0) {
        const vehicle = this.vehicleManager.getNextAvailableVehicle();
        const tripStart = vehicle.availableAt;

        const shipment = ShipmentManager.selectShipment(
          pending,
          vehicle.maxWeight
        );
        if (!shipment) {
          throw new AppError(
            "Some packages cannot be scheduled due to exceeding vehicle capacity."
          );
        }

        const maxDist = Math.max(...shipment.map((p) => p.distance));

        PackageManager.assignDeliveryTimes(shipment, tripStart, vehicle.speed);
        this.vehicleManager.updateVehicleAvailability(
          vehicle,
          tripStart,
          maxDist
        );
        PackageManager.removeShippedPackages(pending, shipment);
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
