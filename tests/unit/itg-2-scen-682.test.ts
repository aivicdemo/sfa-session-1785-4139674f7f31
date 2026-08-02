import { describe, test, expect } from "@jest/globals";
import { visualizeRecommendationBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-682
  test("推奨内容根拠の可視化機能 - 推奨根拠が月をまたぐ期間に作成されたとき、正しく根拠データに含まれる", () => {
    const recommendation_id = "REC-20240131-001";
    const basis_start_datetime = new Date("2024-01-31T23:50:00Z");
    const basis_end_datetime = new Date("2024-02-01T00:15:00Z");

    const business_data_jan = {
      customer_name: "株式会社A",
      transaction_amount: 500000,
      transaction_date: "2024-01-31",
      note: "提案資料提供",
    };

    const business_data_feb = {
      customer_name: "株式会社A",
      transaction_amount: 750000,
      transaction_date: "2024-02-01",
      note: "初回契約金支払い",
    };

    const input = {
      recommendation_id: recommendation_id,
      basis_start_datetime: basis_start_datetime,
      basis_end_datetime: basis_end_datetime,
      business_data_records: [business_data_jan, business_data_feb],
    };

    const result = visualizeRecommendationBasis(input);

    expect(result).toEqual({
      recommendation_id: recommendation_id,
      basis_records: [
        {
          year_month: "2024-01",
          created_date: "2024-01-31",
          customer_name: "株式会社A",
          transaction_amount: 500000,
          note: "提案資料提供",
        },
        {
          year_month: "2024-02",
          created_date: "2024-02-01",
          customer_name: "株式会社A",
          transaction_amount: 750000,
          note: "初回契約金支払い",
        },
      ],
      month_boundary_crossed: true,
      total_basis_count: 2,
    });

    expect(result.basis_records).toHaveLength(2);
    expect(result.basis_records[0].year_month).toBe("2024-01");
    expect(result.basis_records[1].year_month).toBe("2024-02");
    expect(result.month_boundary_crossed).toBe(true);
    expect(result.total_basis_count).toBe(2);
  });
});