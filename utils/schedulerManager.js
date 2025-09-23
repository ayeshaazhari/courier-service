class ShipmentManager {
  static getValidShipmentsGreedy(pkgs, maxWeight) {
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
  }
}

module.exports = ShipmentManager;
