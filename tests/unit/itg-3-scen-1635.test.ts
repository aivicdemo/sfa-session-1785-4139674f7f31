import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { calculateRecommendationRelevanceScore } from "../../src/logic/it-1-br-3-1-1-1";

interface PurchaseHistory {
  purchaseId: string;
  customerId: string;
  purchaseDate: string;
  amount: number;
  productCategory: string;
}

interface ProposalContent {
  proposalId: string;
  title: string;
  description: string;
  recommendedCategory: string;
}

interface PatternRelevanceResult {
  score: number;
  patternId: string;
  evaluatedAt: string;
}

interface RecommendationScoreResult {
  purchaseHistoryId: string;
  proposalContentId: string;
  relevanceScore: number;
  patternBasisCode: string;
  evaluationTimestamp: string;
}

interface AIRecommendationEngine {
  generateRecommendation: jest.Mock;
  findSimilarPatterns: jest.Mock;
  evaluatePatternRelevance: jest.Mock;
}

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-1635
  test("推奨妥当性スコア算出機能 - 購買履歴が過去12ヶ月内の複数件で、提案内容が複数件の場合、各組み合わせが正しく評価される", () => {
    // Setup: 購買履歴データ3件を過去12ヶ月内で準備
    const purchaseHistory: PurchaseHistory[] = [
      {
        purchaseId: "PH001",
        customerId: "CUST001",
        purchaseDate: "2024-03-15T09:30:00Z",
        amount: 150000,
        productCategory: "software_license",
      },
      {
        purchaseId: "PH002",
        customerId: "CUST001",
        purchaseDate: "2024-06-20T14:00:00Z",
        amount: 250000,
        productCategory: "consulting_service",
      },
      {
        purchaseId: "PH003",
        customerId: "CUST001",
        purchaseDate: "2024-09-10T11:15:00Z",
        amount: 180000,
        productCategory: "maintenance_contract",
      },
    ];

    // Setup: 提案内容データ2件を準備
    const proposalContents: ProposalContent[] = [
      {
        proposalId: "PROP001",
        title: "デジタル変革推進パッケージ",
        description: "クラウド基盤とAI導入による業務効率化",
        recommendedCategory: "digital_transformation",
      },
      {
        proposalId: "PROP002",
        title: "セキュリティ強化ソリューション",
        description: "エンタープライズグレードのセキュリティ対策",
        recommendedCategory: "security_enhancement",
      },
    ];

    // Setup: AIRecommendationEngineのスタブ実装
    const mockAIEngine: AIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 購買履歴と提案の各組み合わせに対してスコアを定義
    const scoreMatrix: { [key: string]: number } = {
      "PH001-PROP001": 0.825,
      "PH001-PROP002": 0.642,
      "PH002-PROP001": 0.751,
      "PH002-PROP002": 0.589,
      "PH003-PROP001": 0.893,
      "PH003-PROP002": 0.714,
    };

    const patternIdMatrix: { [key: string]: string } = {
      "PH001-PROP001": "PAT_DT_SW_001",
      "PH001-PROP002": "PAT_SEC_SW_001",
      "PH002-PROP001": "PAT_DT_CS_001",
      "PH002-PROP002": "PAT_SEC_CS_001",
      "PH003-PROP001": "PAT_DT_MC_001",
      "PH003-PROP002": "PAT_SEC_MC_001",
    };

    // evaluatePatternRelevanceスタブの実装
    mockAIEngine.evaluatePatternRelevance.mockImplementation(
      (
        purchaseHistId: string,
        proposalContId: string
      ): PatternRelevanceResult => {
        const key = `${purchaseHistId}-${proposalContId}`;
        return {
          score: scoreMatrix[key] || 0.5,
          patternId: patternIdMatrix[key] || "PAT_UNKNOWN",
          evaluatedAt: "2024-12-15T10:00:00Z",
        };
      }
    );

    // findSimilarPatternsスタブの実装
    mockAIEngine.findSimilarPatterns.mockImplementation(() => ({
      patterns: [
        { patternId: "PAT_DT_SW_001", similarity: 0.92 },
        { patternId: "PAT_DT_CS_001", similarity: 0.88 },
        { patternId: "PAT_DT_MC_001", similarity: 0.95 },
      ],
    }));

    // generateRecommendationスタブの実装
    mockAIEngine.generateRecommendation.mockImplementation(() => ({
      recommendedApproach: "顧客の過去購買パターンに基づいた段階的提案",
      confidence: 0.82,
    }));

    // テスト対象の関数を実行
    const results: RecommendationScoreResult[] =
      calculateRecommendationRelevanceScore(
        purchaseHistory,
        proposalContents,
        mockAIEngine
      );

    // 検証: evaluatePatternRelevanceが6回呼び出されたこと
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(6);

    // 検証: 結果セットに6件の組み合わせが含まれていること
    expect(results).toHaveLength(6);

    // 検証: 各スコアが降順でソートされていること
    expect(results[0].relevanceScore).toBe(0.893);
    expect(results[1].relevanceScore).toBe(0.825);
    expect(results[2].relevanceScore).toBe(0.751);
    expect(results[3].relevanceScore).toBe(0.714);
    expect(results[4].relevanceScore).toBe(0.642);
    expect(results[5].relevanceScore).toBe(0.589);

    // 検証: 最高スコアの組み合わせの詳細を確認
    expect(results[0].purchaseHistoryId).toBe("PH003");
    expect(results[0].proposalContentId).toBe("PROP001");
    expect(results[0].relevanceScore).toBeCloseTo(0.893, 3);
    expect(results[0].patternBasisCode).toBe("PAT_DT_MC_001");
    expect(results[0].evaluationTimestamp).toBe("2024-12-15T10:00:00Z");

    // 検証: 2番目のスコアの組み合わせ
    expect(results[1].purchaseHistoryId).toBe("PH001");
    expect(results[1].proposalContentId).toBe("PROP001");
    expect(results[1].relevanceScore).toBeCloseTo(0.825, 3);
    expect(results[1].patternBasisCode).toBe("PAT_DT_SW_001");

    // 検証: 最低スコアの組み合わせ
    expect(results[5].purchaseHistoryId).toBe("PH002");
    expect(results[5].proposalContentId).toBe("PROP002");
    expect(results[5].relevanceScore).toBeCloseTo(0.589, 3);
    expect(results[5].patternBasisCode).toBe("PAT_SEC_CS_001");

    // 検証: すべての結果がスコア値の範囲内(0.0～1.0)であること
    results.forEach((result) => {
      expect(result.relevanceScore).toBeGreaterThanOrEqual(0.0);
      expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    });

    // 検証: すべての結果が根拠パターンIDを持つこと
    results.forEach((result) => {
      expect(result.patternBasisCode).toMatch(/^PAT_[A-Z]+_[A-Z]+_\d{3}$/);
    });

    // 検証: すべての結果がタイムスタンプを持つこと
    results.forEach((result) => {
      expect(result.evaluationTimestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
    });

    // 検証: PH003-PROP001の組み合わせが最高スコアを獲得していることを確認
    const ph3Prop1Result = results.find(
      (r) => r.purchaseHistoryId === "PH003" && r.proposalContentId === "PROP001"
    );
    expect(ph3Prop1Result?.relevanceScore).toBe(results[0].relevanceScore);

    // 検証: findSimilarPatternsが呼び出されたこと
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();

    // 検証: generateRecommendationが呼び出されたこと
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
  });
});