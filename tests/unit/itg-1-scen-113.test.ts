import { describe, test, expect, beforeEach } from "@jest/globals";
import { determineExtractionPeriod } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-113
  test("抽出対象期間が前月末日から当月初日にまたがる場合、月をまたぐ期間が正しく確定される", () => {
    // Arrange
    const extraction_start_date = new Date("2024-01-31T00:00:00Z");
    const extraction_end_date = new Date("2024-02-01T23:59:59Z");

    // Act
    const result = determineExtractionPeriod({
      start_date: extraction_start_date,
      end_date: extraction_end_date,
    });

    // Assert
    expect(result.confirmed_start_datetime).toEqual(
      new Date("2024-01-31T00:00:00Z")
    );
    expect(result.confirmed_end_datetime).toEqual(
      new Date("2024-02-01T23:59:59Z")
    );
    expect(result.covered_dates).toContain("2024-01-31");
    expect(result.covered_dates).toContain("2024-02-01");
    expect(result.covered_dates.length).toBe(2);
    expect(result.spans_multiple_months).toBe(true);
  });
});