class Vehicle {
    constructor(id, speed, maxWeight) {
      this.id = id;
      this.speed = speed;
      this.maxWeight = maxWeight;
      this.availableAt = 0; // when vehicle is next free
    }
  }
  
  module.exports = Vehicle;
  