import { generateRecommendationApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2836
  test('過去商談から抽出された成功パターンが0件の場合、AIエージェントが汎用的な推奨提案アプローチを生成する', async () => {
    const newCaseData = {
      customerName: 'テスト顧客A',
      industry: '製造業',
      budgetAmountInMillionYen: 5,
      implementationTimeframeMonths: 3,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: '段階的導入モデル（要件定義→基本設計→開発→テスト→本番稼働）',
        confidence: 65,
        rationale: '類似の過去事例が見つかりませんでしたが、同業種における標準的な成功パターンに基づいて推奨しています',
        applicableIndustries: ['製造業'],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '類似の過去事例が見つかりませんでしたが、同業種における標準的な成功パターンに基づいて推奨しています',
      }),
    };

    const result = await generateRecommendationApproach(newCaseData, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseData);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newCaseData, []);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newCaseData,
      expect.objectContaining({
        approach: '段階的導入モデル（要件定義→基本設計→開発→テスト→本番稼働）',
      })
    );

    expect(result).toEqual({
      approach: '段階的導入モデル（要件定義→基本設計→開発→テスト→本番稼働）',
      confidence: 65,
      rationale: '類似の過去事例が見つかりませんでしたが、同業種における標準的な成功パターンに基づいて推奨しています',
      applicableIndustries: ['製造業'],
      explanation: '類似の過去事例が見つかりませんでしたが、同業種における標準的な成功パターンに基づいて推奨しています',
      hasError: false,
    });

    expect(result.hasError).toBe(false);
    expect(result.approach).toBe('段階的導入モデル（要件定義→基本設計→開発→テスト→本番稼働）');
    expect(result.confidence).toBe(65);
    expect(result.rationale).toContain('同業種における標準的な成功パターン');
  });
});