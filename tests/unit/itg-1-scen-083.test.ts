import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { calculateExtractPeriod } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-083
  test("月次営業会議完了時に抽出対象期間が当月1日00:00:00から当月末日23:59:59に正しく確定される", () => {
    // Arrange
    const current_date = new Date("2024-01-15T14:30:00Z");
    const expected_start_date = new Date("2024-01-01T00:00:00Z");
    const expected_end_date = new Date("2024-01-31T23:59:59Z");

    // Act
    const result = calculateExtractPeriod(current_date);

    // Assert
    expect(result.start_date.toISOString()).toBe(
      expected_start_date.toISOString()
    );
    expect(result.end_date.toISOString()).toBe(expected_end_date.toISOString());
    expect(result.status).toBe("確定済み");
  });
});