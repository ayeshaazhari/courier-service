class VehicleManager {
  constructor(vehicles) {
    this.vehicles = vehicles;
  }

  getNextAvailableVehicle() {
    return this.vehicles.sort((a, b) => a.availableAt - b.availableAt)[0];
  }

  updateVehicleAvailability(vehicle, tripStart, maxDist) {
    const oneWayTime = maxDist / vehicle.speed;
    vehicle.availableAt = tripStart + 2 * oneWayTime;
  }
}

module.exports = VehicleManager;
