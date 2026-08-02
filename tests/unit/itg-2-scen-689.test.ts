import { visualizeRecommendationBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-689
  test("信頼度スコア100の根拠データが根拠リストに含まれ、100%インジケータが表示される", () => {
    const basis_data_with_full_confidence = {
      recommendation_id: "REC-001",
      basis_records: [
        {
          basis_id: "BASIS-100",
          source_type: "past_case",
          confidence_score: 100,
          case_summary: "過去事例：類似顧客の成功パターン",
          industry: "製造業",
          company_size: "中規模",
          match_reason: "業種・規模・課題が一致",
        },
        {
          basis_id: "BASIS-050",
          source_type: "customer_data",
          confidence_score: 50,
          case_summary: "顧客データ：購買履歴から抽出",
          industry: "製造業",
          company_size: "中規模",
          match_reason: "購買パターンが部分一致",
        },
      ],
      recommendation_content: "提案内容Aを推奨する",
    };

    const result = visualizeRecommendationBasis(basis_data_with_full_confidence);

    expect(result.included_basis_list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          basis_id: "BASIS-100",
          confidence_score: 100,
          confidence_indicator: "100%",
          display_status: "included",
        }),
      ])
    );

    expect(result.included_basis_list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          basis_id: "BASIS-050",
          confidence_score: 50,
          confidence_indicator: "50%",
          display_status: "included",
        }),
      ])
    );

    const full_confidence_basis = result.included_basis_list.find(
      (b: { basis_id: string; confidence_score: number }) => b.basis_id === "BASIS-100"
    );
    expect(full_confidence_basis).toBeDefined();
    expect(full_confidence_basis.confidence_score).toBe(100);
    expect(full_confidence_basis.confidence_indicator).toBe("100%");
    expect(full_confidence_basis.display_status).toBe("included");

    expect(result.recommendation_id).toBe("REC-001");
    expect(result.total_basis_count).toBe(2);
    expect(result.full_confidence_count).toBe(1);
  });
});