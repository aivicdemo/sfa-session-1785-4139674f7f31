import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  // SCEN-290
  test('OpenAI API失敗時に内部マスタから統計的平均スコアが返却される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockRejectedValue(
        new Error('Service Unavailable')
      ),
    };

    const patternId = 'PATTERN-001';
    const newDealData = {
      customerId: 'CUST-123',
      industryType: 'manufacturing',
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const result = await evaluatePatternRelevance(
      patternId,
      newDealData,
      mockAIEngine
    );

    expect(result).toEqual({
      patternId: 'PATTERN-001',
      relevanceScore: 0.78,
      source: 'internal_master',
    });
  });
});