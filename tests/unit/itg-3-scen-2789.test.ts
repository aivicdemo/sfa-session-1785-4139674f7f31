import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  let mockAIRecommendationEngine: any;

  beforeEach(() => {
    mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2789
  it('成功パターンが0件のとき、エラーを返す', async () => {
    const dealCondition = {
      customerName: 'テスト株式会社',
      productCategory: 'クラウドサービス',
      budgetRange: 'medium',
      industry: 'IT',
      companySize: 'large',
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValueOnce([]);

    const error = await extractSuccessPatternsWithWeighting(
      dealCondition,
      mockAIRecommendationEngine
    ).catch((err: Error) => err);

    expect(error).toBeDefined();
    expect(error.name).toBe('NoSuccessPatternsFoundError');
    expect(error.message).toBe('成功パターンが見つかりません。推奨を生成できません');
    expect((error as any).code).toBe('ERR_NO_PATTERNS');
  });
});