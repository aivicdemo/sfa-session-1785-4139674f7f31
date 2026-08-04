import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能', () => {
  // SCEN-674
  test('顧客条件が1件のとき、その条件に照合した成功パターンを返す', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValueOnce([
        {
          pattern_id: 'PAT-001',
          proposal_approach: '顧客課題に基づくカスタマイズ提案',
          success_rate: 78
        }
      ])
    };

    const customerCondition = {
      industry: '製造業',
      issue: '生産効率化',
      budget: '500万円以上'
    };

    const result = await findSimilarPatterns(customerCondition, mockAIEngine);

    expect(result).toHaveLength(1);
    expect(result[0].pattern_id).toBe('PAT-001');
    expect(result[0].proposal_approach).toBe('顧客課題に基づくカスタマイズ提案');
    expect(result[0].success_rate).toBe(78);
  });
});