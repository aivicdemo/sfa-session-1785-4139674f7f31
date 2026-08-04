import {
  validateLearningDataQuality,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-035
  test("同じ学習データセットで複数回検証を実行しても同じ結果が返される", () => {
    // 学習データセット準備
    const sampleLearningDataset = {
      dealRecords: [
        {
          dealId: "DEAL001",
          customerId: "CUST001",
          industry: "IT",
          dealSize: 5000000,
          proposalApproach: "クラウド導入支援",
          result: "success",
          successFactors: ["ROI提示", "導入タイムライン明確化"],
        },
        {
          dealId: "DEAL002",
          customerId: "CUST002",
          industry: "製造",
          dealSize: 8000000,
          proposalApproach: "効率化ソリューション",
          result: "success",
          successFactors: ["現場ヒアリング", "カスタマイズ提案"],
        },
        {
          dealId: "DEAL003",
          customerId: "CUST003",
          industry: "金融",
          dealSize: 3000000,
          proposalApproach: "セキュリティ強化",
          result: "success",
          successFactors: ["コンプライアンス対応", "段階的導入"],
        },
        {
          dealId: "DEAL004",
          customerId: "CUST004",
          industry: "IT",
          dealSize: 4500000,
          proposalApproach: "クラウド導入支援",
          result: "failure",
          failureFactors: ["予算削減要求", "納期圧迫"],
        },
        {
          dealId: "DEAL005",
          customerId: "CUST005",
          industry: "小売",
          dealSize: 2000000,
          proposalApproach: "POSシステム更新",
          result: "success",
          successFactors: ["業界実績提示", "運用保守体制"],
        },
        {
          dealId: "DEAL006",
          customerId: "CUST006",
          industry: "医療",
          dealSize: 6000000,
          proposalApproach: "電子カルテシステム",
          result: "success",
          successFactors: ["医療業界知見", "サポート体制"],
        },
        {
          dealId: "DEAL007",
          customerId: "CUST007",
          industry: "IT",
          dealSize: 5500000,
          proposalApproach: "クラウド導入支援",
          result: "success",
          successFactors: ["ROI提示", "既存システム連携"],
        },
        {
          dealId: "DEAL008",
          customerId: "CUST008",
          industry: "製造",
          dealSize: 7000000,
          proposalApproach: "効率化ソリューション",
          result: "success",
          successFactors: ["生産性改善数値化", "段階的導入"],
        },
        {
          dealId: "DEAL009",
          customerId: "CUST009",
          industry: "金融",
          dealSize: 4000000,
          proposalApproach: "セキュリティ強化",
          result: "failure",
          failureFactors: ["競合提案採用", "予算枠削減"],
        },
        {
          dealId: "DEAL010",
          customerId: "CUST010",
          industry: "小売",
          dealSize: 2500000,
          proposalApproach: "POSシステム更新",
          result: "success",
          successFactors: ["業界実績提示", "保守サービス充実"],
        },
      ],
      successPatterns: [
        {
          patternId: "PAT001",
          industry: "IT",
          sizeRange: { min: 4000000, max: 6000000 },
          approachType: "クラウド導入支援",
          keySuccessFactors: ["ROI提示", "導入タイムライン明確化"],
          applicabilityScore: 92,
        },
        {
          patternId: "PAT002",
          industry: "製造",
          sizeRange: { min: 6000000, max: 9000000 },
          approachType: "効率化ソリューション",
          keySuccessFactors: ["現場ヒアリング", "カスタマイズ提案"],
          applicabilityScore: 88,
        },
        {
          patternId: "PAT003",
          industry: "金融",
          sizeRange: { min: 3000000, max: 5000000 },
          approachType: "セキュリティ強化",
          keySuccessFactors: ["コンプライアンス対応", "段階的導入"],
          applicabilityScore: 85,
        },
      ],
    };

    const verificationInput = {
      targetIndustry: "IT",
      dealSize: 5000000,
      proposalApproach: "クラウド導入支援",
      learningDatasetId: "DATASET001",
    };

    // モック AIRecommendationEngine
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(
        (pattern: typeof sampleLearningDataset.successPatterns[0]) => {
          return {
            patternId: pattern.patternId,
            relevanceScore: pattern.applicabilityScore,
            isApplicable: pattern.applicabilityScore >= 80,
          };
        }
      ),
      generateEmbedding: jest.fn((text: string) => {
        // 固定ベクトル返却で再現性確保
        const mockEmbedding = new Array(128).fill(0).map((_, i) => {
          if (text === "IT_クラウド導入支援_5000000") {
            return 0.85 + i * 0.0001;
          }
          return 0.5 + i * 0.00001;
        });
        return mockEmbedding;
      }),
    };

    // 1回目の検証実行
    const result1 = validateLearningDataQuality(
      sampleLearningDataset,
      verificationInput,
      mockAIEngine
    );

    // 2回目の検証実行
    const result2 = validateLearningDataQuality(
      sampleLearningDataset,
      verificationInput,
      mockAIEngine
    );

    // 3回目の検証実行
    const result3 = validateLearningDataQuality(
      sampleLearningDataset,
      verificationInput,
      mockAIEngine
    );

    // 検証スコアの一致確認
    expect(result1.validationScore).toBe(result2.validationScore);
    expect(result2.validationScore).toBe(result3.validationScore);
    expect(result1.validationScore).toBe(88);

    // 抽出パターン数の一致確認
    expect(result1.extractedPatternCount).toBe(result2.extractedPatternCount);
    expect(result2.extractedPatternCount).toBe(result3.extractedPatternCount);
    expect(result1.extractedPatternCount).toBe(1);

    // 推奨ランキング順序の一致確認
    expect(result1.recommendationRanking).toEqual(result2.recommendationRanking);
    expect(result2.recommendationRanking).toEqual(result3.recommendationRanking);
    expect(result1.recommendationRanking).toEqual(["PAT001"]);

    // 各パターンの適用可能性スコアの一致確認
    expect(result1.patternApplicabilityScores).toEqual(
      result2.patternApplicabilityScores
    );
    expect(result2.patternApplicabilityScores).toEqual(
      result3.patternApplicabilityScores
    );
    expect(result1.patternApplicabilityScores).toEqual({
      PAT001: 92,
    });

    // すべての結果が完全に同一であることを確認
    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });
});