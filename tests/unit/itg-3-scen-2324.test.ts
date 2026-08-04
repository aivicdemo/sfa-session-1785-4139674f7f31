import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendationWithPatterns } from '../../src/logic/it-1-br-3-3-2-1';

// Mock for AIRecommendationEngine
interface MockAIRecommendationEngine {
  findSimilarPatterns: jest.Mock;
  generateRecommendation: jest.Mock;
}

describe('成功パターン抽出・照合機能', () => {
  let mockEngine: MockAIRecommendationEngine;

  beforeEach(() => {
    mockEngine = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
    };
  });

  // SCEN-2324
  test('適用可能な成功パターンが複数件のとき全件の提案アプローチが返却される', async () => {
    // Arrange: 適用可能な成功パターン3件を模擬データとして設定
    const similarPatterns = [
      {
        id: 'pattern_001',
        patternId: 'pat_manufact_001',
        customerIndustry: '製造業',
        budgetRange: '5000万円',
        decisionMakers: 3,
        relevanceScore: 0.88,
        successFactors: ['経営層の承認取得', '段階的な導入提案'],
      },
      {
        id: 'pattern_002',
        patternId: 'pat_manufact_002',
        customerIndustry: '製造業',
        budgetRange: '5000万円',
        decisionMakers: 3,
        relevanceScore: 0.87,
        successFactors: ['技術検証フェーズの明確化', '予算の柔軟性確保'],
      },
      {
        id: 'pattern_003',
        patternId: 'pat_manufact_003',
        customerIndustry: '製造業',
        budgetRange: '5000万円',
        decisionMakers: 3,
        relevanceScore: 0.86,
        successFactors: ['一括提案による効率化', '経営層向けROI説明'],
      },
    ];

    mockEngine.findSimilarPatterns.mockResolvedValue(similarPatterns);

    // generateRecommendationメソッドが各パターンに対応した提案アプローチを生成
    const recommendations = [
      {
        id: 'rec_001',
        patternId: 'pat_manufact_001',
        approach: '段階的提案型',
        reasoning: '経営層の段階的な承認を得ながら導入を進める提案アプローチ',
        relevanceScore: 0.88,
        suggestedNextStep: '経営層向けの初期ヒアリング実施',
      },
      {
        id: 'rec_002',
        patternId: 'pat_manufact_002',
        approach: '技術検証型',
        reasoning: 'POCによる技術検証を通じて信頼構築を進める提案アプローチ',
        relevanceScore: 0.87,
        suggestedNextStep: '技術検証フェーズの詳細計画立案',
      },
      {
        id: 'rec_003',
        patternId: 'pat_manufact_003',
        approach: '経営層向け一括提案型',
        reasoning: '経営課題の全体解決をROIで説明する一括提案アプローチ',
        relevanceScore: 0.86,
        suggestedNextStep: '経営層向け説得資料の作成',
      },
    ];

    mockEngine.generateRecommendation.mockResolvedValue({
      recommendations,
    });

    // Act: 新規案件の商談条件を入力パラメータとして定義
    const dealCondition = {
      customerIndustry: '製造業',
      budgetScale: '5000万円',
      decisionMakersCount: 3,
    };

    const result = await generateRecommendationWithPatterns(
      dealCondition,
      mockEngine
    );

    // Assert: 戻り値のrecommendations配列の要素数を検証
    expect(result.recommendations).toHaveLength(3);

    // 各推奨アプローチのrelevanceScoreが0.85以上であることを確認
    result.recommendations.forEach((rec) => {
      expect(rec.relevanceScore).toBeGreaterThanOrEqual(0.85);
    });

    // 各推奨オブジェクトが必要な構造を備えていることを確認
    result.recommendations.forEach((rec) => {
      expect(rec).toHaveProperty('id');
      expect(rec).toHaveProperty('patternId');
      expect(rec).toHaveProperty('approach');
      expect(rec).toHaveProperty('reasoning');
      expect(rec).toHaveProperty('relevanceScore');
      expect(rec).toHaveProperty('suggestedNextStep');
    });

    // 各推奨アプローチが異なることを確認
    const approaches = result.recommendations.map((rec) => rec.approach);
    const uniqueApproaches = new Set(approaches);
    expect(uniqueApproaches.size).toBe(3);

    // 具体的な推奨アプローチの内容を検証
    expect(result.recommendations[0].approach).toBe('段階的提案型');
    expect(result.recommendations[1].approach).toBe('技術検証型');
    expect(result.recommendations[2].approach).toBe('経営層向け一括提案型');

    // 提案理由が各々異なることを確認
    const reasonings = result.recommendations.map((rec) => rec.reasoning);
    const uniqueReasonings = new Set(reasonings);
    expect(uniqueReasonings.size).toBe(3);

    // mockが期待通りに呼ばれたことを検証
    expect(mockEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(mockEngine.generateRecommendation).toHaveBeenCalledWith(
      similarPatterns
    );
  });
});