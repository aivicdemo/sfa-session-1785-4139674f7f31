import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨内容の生成と説明 - 成功パターン適用可能性評価', () => {
  test('SCEN-1064: OpenAI API (evaluatePatternRelevance) が正常応答した場合、適用可能性スコアが0～100の範囲で返却される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 85,
        patternId: 'PAT-001',
        explanation: '顧客規模と業界が一致'
      })
    };

    const testInput = {
      currentDealCondition: {
        customerIndustry: 'IT',
        customerSize: 'large',
        dealAmount: 5000000,
        dealStage: 'proposal'
      },
      successPattern: {
        patternId: 'PAT-001',
        targetIndustry: 'IT',
        targetSize: 'large',
        successRate: 0.78
      }
    };

    const result = await evaluatePatternRelevance(testInput, mockAIEngine);

    expect(result).toBeDefined();
    expect(typeof result.relevanceScore).toBe('number');
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(result.relevanceScore).toBeLessThanOrEqual(100);
    expect(result.relevanceScore).toBe(85);
    expect(result.patternId).toBe('PAT-001');
    expect(result.explanation).toBe('顧客規模と業界が一致');
  });
});