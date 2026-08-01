import { extractFailureFactors, judgeApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-711
  test("成功・失敗要因の抽出と承認基準判定機能 - 同一の失敗要因が複数件含まれるとき、全件が個別に承認基準判定の対象となる", () => {
    const salesCaseData = [
      {
        case_id: "CASE001",
        project_id: "PROJ001",
        outcome_type: "失敗",
        failure_reason: "営業資料の未提出",
        case_date: "2024-01-10T09:00:00Z",
      },
      {
        case_id: "CASE002",
        project_id: "PROJ002",
        outcome_type: "失敗",
        failure_reason: "営業資料の未提出",
        case_date: "2024-01-12T14:30:00Z",
      },
      {
        case_id: "CASE003",
        project_id: "PROJ003",
        outcome_type: "失敗",
        failure_reason: "顧客対応遅延",
        case_date: "2024-01-15T11:00:00Z",
      },
    ];

    const extracted_factors = extractFailureFactors(salesCaseData);

    expect(extracted_factors).toHaveLength(3);
    expect(extracted_factors[0]).toEqual({
      extraction_id: expect.any(String),
      case_id: "CASE001",
      failure_reason: "営業資料の未提出",
      extraction_date: expect.any(String),
    });
    expect(extracted_factors[1]).toEqual({
      extraction_id: expect.any(String),
      case_id: "CASE002",
      failure_reason: "営業資料の未提出",
      extraction_date: expect.any(String),
    });
    expect(extracted_factors[2]).toEqual({
      extraction_id: expect.any(String),
      case_id: "CASE003",
      failure_reason: "顧客対応遅延",
      extraction_date: expect.any(String),
    });

    const approval_criteria = {
      criteria_id: "CRITERIA001",
      treat_identical_factors_individually: true,
    };

    const judgment_results = judgeApprovalCriteria(
      extracted_factors,
      approval_criteria
    );

    expect(judgment_results).toHaveLength(3);

    const result_for_case001 = judgment_results.find(
      (r) => r.extraction_id === extracted_factors[0].extraction_id
    );
    expect(result_for_case001).toEqual({
      judgment_id: expect.any(String),
      extraction_id: extracted_factors[0].extraction_id,
      case_id: "CASE001",
      failure_reason: "営業資料の未提出",
      judgment_status: "承認対象",
      judgment_date: expect.any(String),
      judgment_user_id: expect.any(String),
    });

    const result_for_case002 = judgment_results.find(
      (r) => r.extraction_id === extracted_factors[1].extraction_id
    );
    expect(result_for_case002).toEqual({
      judgment_id: expect.any(String),
      extraction_id: extracted_factors[1].extraction_id,
      case_id: "CASE002",
      failure_reason: "営業資料の未提出",
      judgment_status: "承認対象",
      judgment_date: expect.any(String),
      judgment_user_id: expect.any(String),
    });

    const result_for_case003 = judgment_results.find(
      (r) => r.extraction_id === extracted_factors[2].extraction_id
    );
    expect(result_for_case003).toEqual({
      judgment_id: expect.any(String),
      extraction_id: extracted_factors[2].extraction_id,
      case_id: "CASE003",
      failure_reason: "顧客対応遅延",
      judgment_status: "承認対象",
      judgment_date: expect.any(String),
      judgment_user_id: expect.any(String),
    });

    expect(result_for_case001.judgment_id).not.toBe(
      result_for_case002.judgment_id
    );
    expect(result_for_case002.judgment_id).not.toBe(
      result_for_case003.judgment_id
    );
    expect(result_for_case001.judgment_id).not.toBe(
      result_for_case003.judgment_id
    );
  });
});