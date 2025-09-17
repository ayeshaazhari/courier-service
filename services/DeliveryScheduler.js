class DeliveryScheduler {
  constructor(vehicles) {
    vehicles.forEach((v, i) => {
      if (typeof v.speed !== "number" || v.speed <= 0) {
        throw new Error(`Vehicle[${i}] must have a valid positive speed.`);
      }
      if (typeof v.maxWeight !== "number" || v.maxWeight <= 0) {
        throw new Error(`Vehicle[${i}] must have a valid positive maxWeight.`);
      }
      if (typeof v.availableAt !== "number" || v.availableAt < 0) {
        v.availableAt = 0; // default
      }
    });

    this.vehicles = vehicles;
  }

  schedule(packages) {
    packages.forEach((p, i) => {
      if (typeof p.weight !== "number" || p.weight <= 0) {
        throw new Error(`Package[${i}] must have a valid positive weight.`);
      }
      if (typeof p.distance !== "number" || p.distance <= 0) {
        throw new Error(`Package[${i}] must have a valid positive distance.`);
      }
    });
    let pending = [...packages];

    // Utility: get all subsets under maxWeight
    const getValidShipments = (pkgs, maxWeight) => {
      const results = [];
      const n = pkgs.length;

      const backtrack = (i, current, totalWeight) => {
        if (totalWeight <= maxWeight && current.length > 0) {
          results.push([...current]);
        }
        for (let j = i; j < n; j++) {
          if (totalWeight + pkgs[j].weight <= maxWeight) {
            current.push(pkgs[j]);
            backtrack(j + 1, current, totalWeight + pkgs[j].weight);
            current.pop();
          }
        }
      };

      backtrack(0, [], 0);
      return results;
    };

    while (pending.length > 0) {
      // Pick next available vehicle
      let vehicle = this.vehicles.sort(
        (a, b) => a.availableAt - b.availableAt
      )[0];
      let tripStart = vehicle.availableAt;

      // Get all possible shipments under vehicle max weight
      let validShipments = getValidShipments(pending, vehicle.maxWeight);

      if (validShipments.length === 0) break;

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
  }
}

module.exports = DeliveryScheduler;
