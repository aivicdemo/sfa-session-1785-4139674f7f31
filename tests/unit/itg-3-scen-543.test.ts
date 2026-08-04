import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import type { AIRecommendationEngine } from "../../src/logic/it-1-br-3-1-1-1";
import {
  decideSalesGuidancePolicy,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 営業指導方針決定", () => {
  let mockAIEngine: jest.Mocked<AIRecommendationEngine>;

  beforeEach(() => {
    mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    } as jest.Mocked<AIRecommendationEngine>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-543
  it("データ品質スコア49のとき指導方針が要改善と判定される", () => {
    // 初期化：AIRecommendationEngineのスタブを設定
    mockAIEngine.evaluatePatternRelevance.mockReturnValue(49);

    // 営業指導方針決定ロジックにデータ品質スコア49を入力
    const dataQualityScore = 49;
    const guidancePolicy = decideSalesGuidancePolicy(
      dataQualityScore,
      mockAIEngine
    );

    // 指導方針が『要改善』として返却されることを検証
    expect(guidancePolicy).toBe("要改善");
  });
});