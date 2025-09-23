class PackageManager {
  static assignDeliveryTimes(shipment, tripStart, speed) {
    shipment.forEach((pkg) => {
      pkg.estimatedDeliveryTime = tripStart + pkg.distance / speed;
    });
  }

  static removeShippedPackages(pending, shipment) {
    shipment.forEach((p) => {
      const index = pending.indexOf(p);
      if (index > -1) pending.splice(index, 1);
    });
  }
}

module.exports = PackageManager;
