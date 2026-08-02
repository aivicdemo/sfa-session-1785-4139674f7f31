import { detectDeviationPattern } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 乖離パターン検出", () => {
  test("SCEN-301: 初回接触が早く・提案が遅いとき『前半加速・後半停滞』パターンとして検出される", () => {
    // Arrange
    const businessStartDate = new Date("2024-01-01T00:00:00Z");
    const firstContactDate = new Date("2024-01-06T00:00:00Z"); // 5日目
    const proposalDate = new Date("2024-01-26T00:00:00Z"); // 25日目

    const dealRecord = {
      dealId: "DEAL-001",
      businessStartDate: businessStartDate,
      firstContactDate: firstContactDate,
      proposalDate: proposalDate,
    };

    // Act
    const result = detectDeviationPattern(dealRecord);

    // Assert
    expect(result.patternType).toBe("前半加速・後半停滞");
    expect(result.daysToFirstContact).toBe(5);
    expect(result.daysFromFirstContactToProposal).toBe(20);
    expect(result.details).toContain("初回接触までの期間が短い（5日）");
    expect(result.details).toContain(
      "初回接触から提案までの期間が長い（20日）"
    );
  });
});