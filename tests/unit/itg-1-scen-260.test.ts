import { evaluateSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-260: 成功パターンマトリクス参照による提案アプローチ判定 - 購買金額上限が顧客予算と完全一致", () => {
    // 成功パターンマトリクスのスタブデータ
    const successPatterns = [
      {
        patternId: "SP-001",
        purchaseBudgetUpperLimit: 5000000,
        approachMethod: "顧客ニーズヒアリング + 複数提案",
        recommendedActions: [
          "初回ヒアリング実施",
          "競争分析提案",
          "ROI試算提示"
        ],
        conversionRate: 0.65,
        applicableIndustries: ["製造業", "商社"]
      }
    ];

    // テスト対象: 顧客予算が500万円（成功パターンの上限と完全一致）
    const dealInfo = {
      customerId: "CUST-A001",
      customerBudget: 5000000,
      customerIndustry: "製造業",
      currentDealStage: "提案検討"
    };

    // 提案アプローチ判定機能を実行
    const result = evaluateSuccessPatternApplicability(
      dealInfo,
      successPatterns
    );

    // 期待結果: 判定結果が「適用可能（true）」を返す
    expect(result.isApplicable).toBe(true);

    // 適用可能な成功パターンの詳細情報が含まれることを確認
    expect(result.applicablePatterns).toHaveLength(1);
    expect(result.applicablePatterns[0]).toEqual({
      patternId: "SP-001",
      purchaseBudgetUpperLimit: 5000000,
      approachMethod: "顧客ニーズヒアリング + 複数提案",
      recommendedActions: [
        "初回ヒアリング実施",
        "競争分析提案",
        "ROI試算提示"
      ],
      conversionRate: 0.65,
      applicableIndustries: ["製造業", "商社"]
    });

    // パターンマッチング根拠の確認
    expect(result.matchingReason).toBe("顧客予算と成功パターン上限が完全一致");
  });
});