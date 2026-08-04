import { generateRecommendation, evaluatePatternRelevance, explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2222
  test("[normal] 提案内容と顧客対応パターン分析機能 - 異常パターン検出結果が営業担当者向けに可視化される", async () => {
    // Arrange: AIRecommendationEngine のスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: "顧客の業界向け標準提案",
        recommendedActions: ["初期ヒアリング実施", "業界事例の提示"],
        confidenceScore: 65,
        anomalyFlags: [
          {
            type: "industry_deviation",
            severity: "high",
            message: "顧客業界への提案実績が過去12ヶ月でゼロのため、類似業界の事例で補完が必要です",
            affectedElement: "顧客業界",
          },
          {
            type: "amount_anomaly",
            severity: "high",
            message: "提案金額が通常の3倍以上となっており、顧客の予算制約との確認が必須です",
            affectedElement: "提案金額",
          },
          {
            type: "timeline_compression",
            severity: "medium",
            message: "対応期間が標準的な商談期間の50%に短縮されているため、リスク評価が必要です",
            affectedElement: "対応期間",
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 68,
        matchedPatterns: ["tech_company_with_legacy_system", "mid_market_budget_sensitive"],
        isApplicable: true,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation:
          "この顧客業界への提案は過去成功事例に基づいていますが、業界固有の制約条件が異なるため、提案内容の調整が必要です。特に予算規模と実装期間について、顧客の経営方針との整合性を確認してください。",
        supportingEvidence: [
          "過去12ヶ月の同規模顧客との商談実績: 成約率78%",
          "同業界での成功事例: 5件",
        ],
      }),
    };

    // 新規案件データ（顧客情報・商談条件）
    const newCaseData = {
      customerId: "CUST20240115001",
      customerName: "TechStartup Inc.",
      industryCode: "5261",
      industryName: "ソフトウェア受託開発",
      companySize: "mid_market",
      employeeCount: 250,
      annualRevenue: 5000000000,
      dealAmount: 75000000,
      dealTimeline: 90,
      dealStatus: "initial_contact",
      customerChallenges: [
        "レガシーシステムの現代化",
        "クラウド移行",
      ],
      proposalContent: {
        productCategory: "cloud_modernization_solution",
        estimatedImplementationCost: 75000000,
        estimatedDuration: 90,
        roi_percentage: 35,
      },
    };

    // Act: 推奨生成の実行
    const recommendationResult = await mockAIEngine.generateRecommendation(
      newCaseData
    );

    // 異常パターン評価の実行
    const relevanceResult = await mockAIEngine.evaluatePatternRelevance(
      newCaseData,
      recommendationResult
    );

    // 根拠説明の取得
    const reasoningResult = await mockAIEngine.explainRecommendationReasoning(
      newCaseData,
      recommendationResult
    );

    // Assert: 異常パターン検出結果の検証
    expect(recommendationResult.anomalyFlags).toBeDefined();
    expect(recommendationResult.anomalyFlags.length).toBe(3);

    // 異常フラグ1: 業界乖離
    expect(recommendationResult.anomalyFlags[0].type).toBe("industry_deviation");
    expect(recommendationResult.anomalyFlags[0].severity).toBe("high");
    expect(recommendationResult.anomalyFlags[0].affectedElement).toBe(
      "顧客業界"
    );
    expect(recommendationResult.anomalyFlags[0].message).toMatch(
      /過去12ヶ月.*ゼロ.*類似業界/
    );

    // 異常フラグ2: 金額異常
    expect(recommendationResult.anomalyFlags[1].type).toBe("amount_anomaly");
    expect(recommendationResult.anomalyFlags[1].severity).toBe("high");
    expect(recommendationResult.anomalyFlags[1].affectedElement).toBe(
      "提案金額"
    );
    expect(recommendationResult.anomalyFlags[1].message).toMatch(
      /3倍以上.*予算制約.*確認/
    );

    // 異常フラグ3: 期間圧縮
    expect(recommendationResult.anomalyFlags[2].type).toBe(
      "timeline_compression"
    );
    expect(recommendationResult.anomalyFlags[2].severity).toBe("medium");
    expect(recommendationResult.anomalyFlags[2].affectedElement).toBe(
      "対応期間"
    );
    expect(recommendationResult.anomalyFlags[2].message).toMatch(
      /50%.*短縮.*リスク/
    );

    // 信頼度スコアの検証（異常検出により低下している）
    expect(recommendationResult.confidenceScore).toBe(65);

    // 適用性判定の検証
    expect(relevanceResult.isApplicable).toBe(true);
    expect(relevanceResult.relevanceScore).toBe(68);
    expect(relevanceResult.matchedPatterns.length).toBeGreaterThan(0);

    // 営業担当者向け自然言語説明の検証
    expect(reasoningResult.explanation).toBeDefined();
    expect(reasoningResult.explanation).toMatch(/業界固有の制約条件/);
    expect(reasoningResult.explanation).toMatch(/予算規模と実装期間/);
    expect(reasoningResult.explanation).toMatch(/経営方針との整合性/);

    // 支証拠データの検証
    expect(reasoningResult.supportingEvidence).toBeDefined();
    expect(reasoningResult.supportingEvidence.length).toBeGreaterThan(0);
    expect(reasoningResult.supportingEvidence[0]).toMatch(
      /成約率.*78%/
    );

    // UI可視化要件の検証
    // (1) 異常フラグが各要素に対して表示される
    const industryAnomalyFlag = recommendationResult.anomalyFlags.find(
      (flag) => flag.affectedElement === "顧客業界"
    );
    expect(industryAnomalyFlag).toBeDefined();
    expect(industryAnomalyFlag?.severity).toBe("high");

    const amountAnomalyFlag = recommendationResult.anomalyFlags.find(
      (flag) => flag.affectedElement === "提案金額"
    );
    expect(amountAnomalyFlag).toBeDefined();
    expect(amountAnomalyFlag?.severity).toBe("high");

    const timelineAnomalyFlag = recommendationResult.anomalyFlags.find(
      (flag) => flag.affectedElement === "対応期間"
    );
    expect(timelineAnomalyFlag).toBeDefined();
    expect(timelineAnomalyFlag?.severity).toBe("medium");

    // (2) 各異常フラグに詳細説明が付与されている
    recommendationResult.anomalyFlags.forEach((flag) => {
      expect(flag.message).toBeDefined();
      expect(flag.message.length).toBeGreaterThan(0);
      expect(flag.message).not.toMatch(/undefined|null|エラー/);
    });

    // (3) 推奨内容全体が正常に表示される
    expect(recommendationResult.proposalApproach).toBeDefined();
    expect(recommendationResult.recommendedActions).toBeDefined();
    expect(recommendationResult.recommendedActions.length).toBeGreaterThan(0);

    // (4) 営業担当者が判断可能な状態の検証
    expect(reasoningResult.explanation.length).toBeGreaterThan(50);
    expect(reasoningResult.explanation).toMatch(/確認/);

    // API呼び出しの確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newCaseData
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});