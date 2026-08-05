import { determineReportingDestination } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-1022
  test("成功パターン適用ガイドライン周知完了判定機能 - 営業部長IDが欠落しているとき報告先の判定がエラーになること", () => {
    const input = {
      sales_office_id: "SO001",
      sales_representative_id: "SR001",
      guideline_completion_flag: true,
      sales_manager_id: null,
      guideline_understanding_score: 85,
      practical_application_report_submitted: true,
    };

    expect(() => determineReportingDestination(input)).toThrow(/営業部長ID/);
  });
});