import { validateSalesOpportunityData } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-572
  test("営業案件データが欠落している場合、エラーになる", () => {
    const missing_opportunity_id = {
      opportunity_id: null,
      opportunity_name: "テスト案件",
      stage: "提案",
      amount: 1000000,
    };

    const missing_opportunity_name = {
      opportunity_id: "OPP-001",
      opportunity_name: undefined,
      stage: "提案",
      amount: 1000000,
    };

    const missing_stage = {
      opportunity_id: "OPP-002",
      opportunity_name: "テスト案件2",
      stage: null,
      amount: 500000,
    };

    const missing_amount = {
      opportunity_id: "OPP-003",
      opportunity_name: "テスト案件3",
      stage: "初回接触",
      amount: undefined,
    };

    expect(() => validateSalesOpportunityData(missing_opportunity_id)).toThrow(
      /営業案件データ/
    );
    expect(() => validateSalesOpportunityData(missing_opportunity_name)).toThrow(
      /営業案件データ/
    );
    expect(() => validateSalesOpportunityData(missing_stage)).toThrow(
      /営業案件データ/
    );
    expect(() => validateSalesOpportunityData(missing_amount)).toThrow(
      /営業案件データ/
    );
  });
});