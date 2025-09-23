const schedulerManager = require("./schedulerManager");

class ShipmentManager {
  static selectShipment(pending, maxWeight) {
    const validShipments = schedulerManager.getValidShipmentsGreedy(
      pending,
      maxWeight
    );
    if (validShipments.length === 0) return null;

    return validShipments.toSorted((a, b) => {
      const weightA = ShipmentManager.totalWeight(a);
      const weightB = ShipmentManager.totalWeight(b);
      if (weightA !== weightB) return weightB - weightA;

      const distA = ShipmentManager.minDistance(a);
      const distB = ShipmentManager.minDistance(b);
      return distA - distB;
    })[0];
  }

  static totalWeight(shipment) {
    return shipment.reduce((s, p) => s + p.weight, 0);
  }

  static minDistance(shipment) {
    return Math.min(...shipment.map((p) => p.distance));
  }
}

module.exports = ShipmentManager;
