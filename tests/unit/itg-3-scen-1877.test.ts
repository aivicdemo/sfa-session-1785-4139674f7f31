import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

// Import the function under test
import { matchAndRecommend } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1877
  it('新規案件の商談IDが null のとき照合に失敗する', () => {
    // テストデータ: 商談IDが null の新規案件オブジェクト
    const newDealWithNullId = {
      deal_id: null,
      customer_name: '顧客A',
      product_category: '営業支援ツール',
      budget_amount: 5000000,
      industry: 'IT',
      company_size: '中堅企業',
      contact_date: new Date('2024-01-15T11:00:00Z'),
      sales_person_id: 'SP001'
    };

    // AIRecommendationEngine のスタブ化
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'PT001',
          customer_industry: 'IT',
          success_rate: 0.85,
          description: 'IT企業向け提案パターン'
        }
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 照合処理が null 判定で失敗することを確認
    expect(() =>
      matchAndRecommend(newDealWithNullId, aiRecommendationEngineStub)
    ).toThrow(/商談ID/);

    // 外部の AIRecommendationEngine スタブが呼び出されていないことを確認
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
  });
});