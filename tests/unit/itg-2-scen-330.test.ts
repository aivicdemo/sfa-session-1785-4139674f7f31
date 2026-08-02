import { calculateCorrelationCoefficient } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-330
  test("成約実績が複数件の営業担当者について相関係数が計算される", () => {
    const sales_rep_id = "A001";
    const contract_records = [
      {
        sales_rep_id: sales_rep_id,
        contract_amount: 1000000,
        contract_date: "2024-01-15",
      },
      {
        sales_rep_id: sales_rep_id,
        contract_amount: 1500000,
        contract_date: "2024-02-20",
      },
      {
        sales_rep_id: sales_rep_id,
        contract_amount: 2000000,
        contract_date: "2024-03-25",
      },
    ];

    const result = calculateCorrelationCoefficient({
      sales_rep_id: sales_rep_id,
      contract_records: contract_records,
    });

    expect(result.correlation_coefficient).toBeGreaterThanOrEqual(0);
    expect(result.correlation_coefficient).toBeLessThanOrEqual(1);
    expect(result.status).toBe("completed");
    expect(result.quality_verification_record).toEqual(
      expect.objectContaining({
        status: "completed",
        correlation_coefficient: expect.any(Number),
      })
    );
  });
});