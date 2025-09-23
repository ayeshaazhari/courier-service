const fs = require("fs");
const path = require("path");
const OfferManager = require("../utils/offerManager");
const Offer = require("../models/Offer");

jest.mock("fs");
jest.mock("../models/Offer");

describe("OfferManager", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should load offers from file and register them", () => {
    const mockOffers = [
      { code: "OFR001", discount: 10 },
      { code: "OFR002", discount: 7 },
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockOffers));
    Offer.mockImplementation((o) => ({ ...o })); // return plain object

    const manager = new OfferManager();

    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.join(__dirname, "..", "config", "offers.json")
    );
    expect(manager.getOffer("OFR001")).toEqual({
      code: "OFR001",
      discount: 10,
    });
    expect(manager.getOffer("OFR002")).toEqual({ code: "OFR002", discount: 7 });
  });

  test("should return null for unknown offer code", () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const manager = new OfferManager();

    expect(manager.getOffer("INVALID")).toBeNull();
  });

  test("should allow manual offer registration", () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const manager = new OfferManager();

    const customOffer = { code: "OFR_CUSTOM", discount: 15 };
    manager.register(customOffer);

    expect(manager.getOffer("OFR_CUSTOM")).toBe(customOffer);
  });

  test("should throw error if offers.json is invalid JSON", () => {
    fs.readFileSync.mockReturnValue("INVALID_JSON");

    // Override Offer constructor so it’s not called
    Offer.mockImplementation(() => {});

    expect(() => new OfferManager()).toThrow(SyntaxError);
  });

  test("should handle empty offers.json gracefully", () => {
    fs.readFileSync.mockReturnValue("[]");
    const manager = new OfferManager();
    expect(manager.getOffer("ANY")).toBeNull();
  });
});
