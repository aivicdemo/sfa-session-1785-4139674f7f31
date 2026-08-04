import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1946: [edge] 推奨内容の根拠表示機能 - 根拠参照の過去事例件数がちょうど3件のときに3件全て表示される
  test("根拠参照の過去事例件数がちょうど3件のときに3件全て表示される", () => {
    // 過去成功事例データ（3件）
    const similarCases = [
      {
        caseId: "CASE-001",
        customerName: "株式会社A",
        dealContent: "ERP導入支援",
        successPattern: "大規模製造業向けのシステム統合提案が有効",
      },
      {
        caseId: "CASE-002",
        customerName: "株式会社B",
        dealContent: "DX推進コンサルティング",
        successPattern: "業務プロセス改善と並行したIT導入が成功要因",
      },
      {
        caseId: "CASE-003",
        customerName: "株式会社C",
        dealContent: "クラウド移行プロジェクト",
        successPattern: "段階的な移行と継続的なトレーニング提供が重要",
      },
    ];

    // テスト対象案件データ
    const dealCondition = {
      customerId: "CUST-001",
      customerIndustry: "製造業",
      dealStage: "提案準備",
      proposedSolution: "統合ERP+クラウド移行",
    };

    // AIRecommendationEngineをスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(similarCases),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: "REC-20240115-001",
        confidenceScore: 85,
        reasoningText:
          "過去3件の成功事例から以下の根拠に基づき推奨します。" +
          "【事例CASE-001】株式会社Aは大規模製造業向けのシステム統合提案により成約。" +
          "【事例CASE-002】株式会社Bは業務プロセス改善と並行したIT導入で成功。" +
          "【事例CASE-003】株式会社Cはクラウド移行で段階的な移行と継続的なトレーニング提供が重要。" +
          "これらの成功パターンが本案件に適用可能です。",
        relatedCases: [
          {
            caseId: "CASE-001",
            customerName: "株式会社A",
            dealContent: "ERP導入支援",
            relevanceReason:
              "大規模製造業向けのシステム統合提案が有効であり、本案件の統合ERP提案と合致。",
          },
          {
            caseId: "CASE-002",
            customerName: "株式会社B",
            dealContent: "DX推進コンサルティング",
            relevanceReason:
              "業務プロセス改善と並行したIT導入が成功要因。本案件のDX推進アプローチと親和性高。",
          },
          {
            caseId: "CASE-003",
            customerName: "株式会社C",
            dealContent: "クラウド移行プロジェクト",
            relevanceReason:
              "段階的な移行と継続的なトレーニング提供が重要。本案件のクラウド移行計画に適用可能。",
          },
        ],
      }),
    };

    // 推奨内容の根拠表示機能を呼び出す
    const result = explainRecommendationReasoning(
      dealCondition,
      mockAIEngine as any
    );

    // 根拠表示UIコンポーネントがレンダリングされることを確認
    expect(result).toBeDefined();
    expect(result.recommendationId).toBe("REC-20240115-001");
    expect(result.confidenceScore).toBe(85);

    // 根拠参照セクション内の過去事例リストを検査
    expect(result.relatedCases).toBeDefined();
    expect(result.relatedCases.length).toBe(3);

    // 事例数をカウント
    const displayedCaseCount = result.relatedCases.length;
    expect(displayedCaseCount).toBe(3);

    // 3件全てが漏れなく記載されていることを確認
    const caseIds = result.relatedCases.map((c: any) => c.caseId);
    expect(caseIds).toEqual(["CASE-001", "CASE-002", "CASE-003"]);

    // 各事例が必要な情報を含んでいることを確認
    result.relatedCases.forEach((relatedCase: any, index: number) => {
      expect(relatedCase.caseId).toBeDefined();
      expect(relatedCase.customerName).toBeDefined();
      expect(relatedCase.dealContent).toBeDefined();
      expect(relatedCase.relevanceReason).toBeDefined();

      // 具体的な値を検証
      if (index === 0) {
        expect(relatedCase.caseId).toBe("CASE-001");
        expect(relatedCase.customerName).toBe("株式会社A");
        expect(relatedCase.dealContent).toBe("ERP導入支援");
        expect(relatedCase.relevanceReason).toContain("システム統合提案");
      } else if (index === 1) {
        expect(relatedCase.caseId).toBe("CASE-002");
        expect(relatedCase.customerName).toBe("株式会社B");
        expect(relatedCase.dealContent).toBe("DX推進コンサルティング");
        expect(relatedCase.relevanceReason).toContain("業務プロセス改善");
      } else if (index === 2) {
        expect(relatedCase.caseId).toBe("CASE-003");
        expect(relatedCase.customerName).toBe("株式会社C");
        expect(relatedCase.dealContent).toBe("クラウド移行プロジェクト");
        expect(relatedCase.relevanceReason).toContain("段階的な移行");
      }
    });

    // 根拠説明文が3件全てを含んでいることを確認
    expect(result.reasoningText).toContain("CASE-001");
    expect(result.reasoningText).toContain("CASE-002");
    expect(result.reasoningText).toContain("CASE-003");
  });
});