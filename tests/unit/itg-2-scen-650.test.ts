import { extractRecommendationRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("推奨内容根拠の可視化機能", () => {
  // SCEN-650
  test("推奨根拠テーブルから複数件の根拠データを抽出し、すべての根拠が正しく構成される", () => {
    const input_recommendation_id = "ABC社訪問増加";
    const input_rationale_records = [
      {
        rationale_id: "R001",
        recommendation_content: "顧客ABC社への訪問頻度増加",
        rationale_type: "過去購買額",
        rationale_value: "150万円",
      },
      {
        rationale_id: "R002",
        recommendation_content: "顧客ABC社への訪問頻度増加",
        rationale_type: "商談成功率",
        rationale_value: "85%",
      },
      {
        rationale_id: "R003",
        recommendation_content: "顧客ABC社への訪問頻度増加",
        rationale_type: "最終接触日数",
        rationale_value: "7日",
      },
    ];

    const result = extractRecommendationRationale(
      input_recommendation_id,
      input_rationale_records
    );

    expect(result.extracted_count).toBe(3);
    expect(result.rationales).toHaveLength(3);

    expect(result.rationales[0]).toEqual({
      rationale_id: "R001",
      rationale_type: "過去購買額",
      rationale_value: "150万円",
      display_label: "150万円を基に推奨",
    });

    expect(result.rationales[1]).toEqual({
      rationale_id: "R002",
      rationale_type: "商談成功率",
      rationale_value: "85%",
      display_label: "85%の成功実績を基に推奨",
    });

    expect(result.rationales[2]).toEqual({
      rationale_id: "R003",
      rationale_type: "最終接触日数",
      rationale_value: "7日",
      display_label: "7日以内の接触パターンを基に推奨",
    });

    expect(result.has_duplicates).toBe(false);
    expect(result.has_missing_fields).toBe(false);
    expect(result.rationale_order_valid).toBe(true);
  });
});