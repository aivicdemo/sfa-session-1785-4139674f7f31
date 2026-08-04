import { describe, test, expect, beforeEach } from '@jest/globals';
import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1692
  test('抽出されたパターンが 0 件のとき、エラーが発生する', () => {
    const new_deal_condition = {
      customer_industry: 'manufacturing',
      deal_stage: 'negotiation',
      budget_scale_range: '10000000_50000000',
      deal_expected_close_date: '2024-06-30',
    };

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    expect(async () => {
      await findSimilarPatterns(new_deal_condition, mock_ai_engine);
    }).rejects.toThrow(/パターン/);
  });
});