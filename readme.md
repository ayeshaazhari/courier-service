📦 Courier Service CLI Application

A Node.js command-line application to calculate delivery cost and estimated delivery time for packages using a fleet of vehicles. Built with OOP principles and following SOLID design patterns, this project is scalable and extensible for additional offers, vehicles, and scheduling rules.

## Table of Contents

Features

Problem Statement

Installation

Usage

Project Structure

Design & Principles

Example Input/Output

Extensibility

## Features

Calculates delivery cost for packages with optional discount offers.

Determines estimated delivery time using multiple vehicles and optimizing load.

Handles multi-trip scheduling for vehicles based on weight capacity and speed.

Modular, object-oriented design adhering to SOLID principles.

Easy to add new offers or modify delivery rules.

## Problem Statement

Kiki’s courier business needs a system to:

Calculate delivery cost:

Delivery Cost = Base Delivery Cost + (Weight _ 10) + (Distance _ 5) - Discount

Apply discounts based on offer codes and eligibility.

Estimate delivery time using a fleet of vehicles:

Vehicles have max speed and weight capacity.

Multiple trips may be needed.

Prefer heavier packages when multiple shipments possible.

Assign delivery times to packages accurately.

## Installation

Clone the repository:

git clone https://github.com/<your-username>/courier-service.git
cd courier-service

Install dependencies (none required except Node.js):

npm install

Ensure Node.js is installed (v14+ recommended).

## Usage

Create an input.txt file with package & vehicle details:

100 5
PKG1 50 30 OFR001
PKG2 75 125 OFFR0008
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200

Run the CLI:

node index.js < input.txt

Example Output:

PKG1 0 750 3.98
PKG2 0 1475 1.78
PKG3 0 2350 1.42
PKG4 105 1395 0.85
PKG5 0 2125 4.19

## Project Structure
```bash
.
├── index.js # Main CLI entry point
├── models
│   ├── Offer.js # Offer entity
│   ├── Package.js # Package entity
│   └── Vehicle.js # Vehicle entity
├── package.json
├── problem1.txt # Sample input for cost calculation
├── problem2.txt # Sample input for time estimation
├── readme.md
├── repositories
│   └── Offerrepository.js # Store and fetch offers
├── services
│   ├── costCalculator.js  # Calculates total cost & discount
│   └── DeliveryScheduler.js  # Schedules packages to vehicles
└── utils
    └── inputParser.js # Parses CLI input

```
## Design & Principles

OOP Design: Each entity (Package, Vehicle, Offer) encapsulates its data and behavior.

SOLID Principles:

SRP: Each class has a single responsibility (cost calculation, scheduling, parsing).

OCP: New offers can be added without changing existing classes.

LSP: Offers can be subclassed with different logic.

DIP: Services depend on abstractions (repositories, vehicles).

ISP: Classes only expose necessary methods.

Extensible: Add more vehicles, offers, or change scheduling rules easily.

## Example Input/Output

Input (input.txt)

100 5
PKG1 50 30 OFR001
PKG2 75 125 OFFR0008
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200

Output

PKG1 0 750 3.98
PKG2 0 1475 1.78
PKG3 0 2350 1.42
PKG4 105 1395 0.85
PKG5 0 2125 4.19

Explanation:

PKG4 qualifies for discount OFR002 → 105 discount applied.

Delivery times calculated considering vehicle speed, max load, and multi-trip optimization.

## Extensibility

Adding a new offer:

this.offers.push(new Offer("OFR004", 12, 10, 200, 20, 150));
