import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス遵守度スコア計算", () => {
  test("SCEN-278: 提案ステップが標準プロセスから1日遅いとき、乖離度として負の値が計算される", () => {
    // Arrange
    const standardProcessProposalScheduledDate = new Date("2024-01-15T00:00:00Z");
    const actualProposalExecutionDate = new Date("2024-01-16T00:00:00Z");

    // Act
    const deviationScore = calculateProcessComplianceScore(
      standardProcessProposalScheduledDate,
      actualProposalExecutionDate
    );

    // Assert
    expect(deviationScore).toBe(-1.0);
  });
});