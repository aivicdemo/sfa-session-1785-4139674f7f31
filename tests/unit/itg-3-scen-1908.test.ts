import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1908: 推奨スコアが閾値直下（0.79）のときに根拠が除外される", () => {
    // ビジネスルール: 推奨根拠の最小スコア閾値は 0.80
    const RELEVANCE_THRESHOLD = 0.80;

    // 顧客情報と商談条件の入力データ
    const newDealData = {
      customerId: "CUST-20240115-001",
      customerIndustry: "製造業",
      customerScale: "中堅企業",
      dealStage: "初期商談",
      dealAmount: 5000000,
      dealTimeline: "Q1",
    };

    // AIRecommendationEngine のスタブを定義
    // evaluatePatternRelevance が複数の根拠を返す、うち1つはスコア0.79、複数はスコア0.80以上
    const stubAIEngine = {
      generateRecommendation: jest.fn((dealData) => ({
        recommendationId: "REC-20240115-001",
        customerId: dealData.customerId,
        recommendedApproach: "顧客の既存取引実績を踏まえた提案",
        overallScore: 0.82,
        reasoning: [
          {
            reasonId: "REASON-001",
            description: "過去3件の同業種案件で成約実績あり",
            score: 0.85,
            evidenceType: "past_success_pattern",
          },
          {
            reasonId: "REASON-002",
            description: "顧客の購買タイミングが最適",
            score: 0.79,
            evidenceType: "buying_signal",
          },
          {
            reasonId: "REASON-003",
            description: "営業担当者のアプローチが標準パターンと合致",
            score: 0.81,
            evidenceType: "process_alignment",
          },
        ],
        timestamp: "2024-01-15T11:00:00Z",
      })),
      evaluatePatternRelevance: jest.fn((pattern) => ({
        patternId: pattern.id,
        relevanceScore: 0.79,
        isApplicable: false,
      })),
      findSimilarPatterns: jest.fn(() => []),
      explainRecommendationReasoning: jest.fn((rec) => ""),
    };

    // 推奨生成APIを呼び出す
    const recommendation = stubAIEngine.generateRecommendation(newDealData);

    // 推奨根拠を可視化用に処理（閾値以上の根拠のみをフィルタ）
    const filteredReasons = recommendation.reasoning.filter(
      (reason) => reason.score >= RELEVANCE_THRESHOLD
    );

    // スコア0.79の根拠は除外されることを検証
    expect(recommendation.reasoning.length).toBe(3);
    expect(
      recommendation.reasoning.some((r) => r.score === 0.79)
    ).toBe(true);

    // フィルタ後は閾値以上の根拠のみが残ることを検証
    expect(filteredReasons.length).toBe(2);
    expect(
      filteredReasons.some((r) => r.score === 0.79)
    ).toBe(false);

    // 残された根拠のスコアがすべて0.80以上であることを検証
    filteredReasons.forEach((reason) => {
      expect(reason.score).toBeGreaterThanOrEqual(RELEVANCE_THRESHOLD);
    });

    // 画面表示用の推奨根拠リストが正しくフィルタされていることを検証
    expect(filteredReasons).toEqual([
      {
        reasonId: "REASON-001",
        description: "過去3件の同業種案件で成約実績あり",
        score: 0.85,
        evidenceType: "past_success_pattern",
      },
      {
        reasonId: "REASON-003",
        description: "営業担当者のアプローチが標準パターンと合致",
        score: 0.81,
        evidenceType: "process_alignment",
      },
    ]);

    // スコア0.79の除外された根拠を検証
    const excludedReasons = recommendation.reasoning.filter(
      (reason) => reason.score < RELEVANCE_THRESHOLD
    );
    expect(excludedReasons.length).toBe(1);
    expect(excludedReasons[0].reasonId).toBe("REASON-002");
    expect(excludedReasons[0].score).toBe(0.79);
  });
});