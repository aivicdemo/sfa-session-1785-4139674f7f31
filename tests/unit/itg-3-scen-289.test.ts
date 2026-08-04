import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  // SCEN-289
  test('evaluatePatternRelevanceが正常応答したとき、新規案件への適用可能性スコアが返却される', async () => {
    const newDealData = {
      customerIndustry: 'SaaS',
      contractAmount: 5000000,
      decisionMakerCount: 3,
      implementationPeriodMonths: 3,
    };

    const result = await evaluatePatternRelevance(newDealData);

    expect(result).toEqual({
      relevanceScore: 0.87,
      confidence: 0.92,
      applicablePatternId: 'PAT-2024-001',
    });
    expect(result.relevanceScore).toBe(0.87);
    expect(result.confidence).toBe(0.92);
    expect(result.applicablePatternId).toBe('PAT-2024-001');
  });
});