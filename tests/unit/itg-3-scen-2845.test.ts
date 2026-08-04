import { evaluateStandardProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2845
  test('推奨内容の標準プロセス乖離度判定機能 - 営業担当者の行動パターンが標準プロセスと完全一致した場合、乖離度スコアが0に算出される', async () => {
    const salesPersonBehavior = {
      salesPersonId: 'SP001',
      customerId: 'CUST001',
      steps: [
        {
          stepName: '初期接触',
          executedAt: new Date('2024-01-15T10:00:00Z'),
          approach: 'initial_contact_standard',
          alignment: 100,
        },
        {
          stepName: 'ニーズ確認',
          executedAt: new Date('2024-01-15T10:30:00Z'),
          approach: 'needs_confirmation_standard',
          alignment: 100,
        },
        {
          stepName: '提案',
          executedAt: new Date('2024-01-15T11:00:00Z'),
          approach: 'proposal_standard',
          alignment: 100,
        },
        {
          stepName: 'クロージング',
          executedAt: new Date('2024-01-15T11:30:00Z'),
          approach: 'closing_standard',
          alignment: 100,
        },
      ],
      timingCompliance: true,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        stepAlignment: {
          initial_contact: 100,
          needs_confirmation: 100,
          proposal: 100,
          closing: 100,
        },
        timingWithinTolerance: true,
        recommendedApproachMatch: true,
      }),
    };

    const result = await evaluateStandardProcessDeviation(
      salesPersonBehavior,
      mockAIRecommendationEngine
    );

    expect(result.deviationScore).toBe(0);
    expect(result.stepByStepAlignment).toEqual({
      initial_contact: 100,
      needs_confirmation: 100,
      proposal: 100,
      closing: 100,
    });
    expect(result.timingWithinTolerance).toBe(true);
    expect(result.recommendedApproachMatch).toBe(true);
    expect(result.detailedInfo).toEqual({
      message: '営業行動パターンが標準プロセスと完全一致しています',
      stepCompliance: 100,
      timingCompliance: true,
      approachCompliance: true,
    });
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      salesPersonBehavior
    );
  });
});