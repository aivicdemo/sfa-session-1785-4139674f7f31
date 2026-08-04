import { matchConstraints } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1415
  test("予算制約データが欠落しているとき、その項目の照合がスキップされる", () => {
    const customerConstraints = {
      budget: undefined,
      deliveryDeadline: new Date("2024-12-31T23:59:59Z"),
      headcountLimit: 50
    };

    const proposalContent = {
      estimatedBudget: 1500000,
      proposedDeliveryDate: new Date("2024-12-20T00:00:00Z"),
      requiredHeadcount: 30
    };

    const result = matchConstraints(customerConstraints, proposalContent);

    expect(result).toHaveProperty("deliveryDeadline");
    expect(result).toHaveProperty("headcountLimit");
    expect(result).not.toHaveProperty("budget");
    expect(result.deliveryDeadline).toBeDefined();
    expect(result.headcountLimit).toBeDefined();
  });
});