import { describe, test, expect, beforeEach } from "@jest/globals";
import { determineSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1";

describe("成功パターン適用判定機能 - 顧客属性一致度下限値判定", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-406: 顧客属性の一致度がちょうど許容範囲の下限値と等しい場合、パターン適用の根拠として採用される
  test("should adopt success pattern when customer attribute match score equals minimum threshold", () => {
    // 準備: 成功パターンデータ（許容範囲の下限値を定義）
    const successPattern = {
      pattern_id: "PAT-2024-001",
      pattern_name: "大企業向け継続契約パターン",
      industry: "製造業",
      company_size_min: 500,
      contract_value_min: 5000000,
      attribute_match_threshold_min: 75.0, // 許容範囲の下限値
      success_count: 23,
      total_count: 28,
      success_rate: 0.821,
    };

    // 準備: テスト用顧客データ
    const customer_data = {
      customer_id: "CUST-2024-0456",
      company_name: "大手製造所A",
      industry: "製造業",
      company_size: 1200,
      prior_contract_value: 7500000,
    };

    // 準備: 属性一致度スコア（許容範囲の下限値と完全に一致）
    const calculated_match_score = 75.0; // 下限閾値と等しい値

    // 実行
    const applicability_result = determineSuccessPatternApplicability({
      success_pattern: successPattern,
      customer_data: customer_data,
      attribute_match_score: calculated_match_score,
    });

    // 検証: 成功パターンが適用対象として選定されている
    expect(applicability_result.is_applicable).toBe(true);

    // 検証: 適用判定結果に『採用済み』ステータスが含まれている
    expect(applicability_result.adoption_status).toBe("採用済み");

    // 検証: 根拠情報に『顧客属性一致度: 下限閾値に一致』と記録されている
    expect(applicability_result.rationale).toContain("顧客属性一致度: 下限閾値に一致");

    // 検証: トレーサビリティ情報が正確に記録されている
    expect(applicability_result.traceability).toEqual({
      pattern_id: "PAT-2024-001",
      customer_id: "CUST-2024-0456",
      match_score: 75.0,
      threshold_value: 75.0,
      judgment_type: "下限閾値一致",
      evaluation_timestamp: expect.any(String),
    });

    // 検証: 根拠の詳細が記録されている
    expect(applicability_result.reasoning_detail).toEqual({
      attribute_match_accuracy: 75.0,
      status_reason: "顧客属性の一致度が許容範囲の下限値と等しいため採用",
      applicable_pattern_name: "大企業向け継続契約パターン",
      success_pattern_success_rate: 0.821,
    });
  });
});