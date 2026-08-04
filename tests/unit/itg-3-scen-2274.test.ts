import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2274: [error] 推奨根拠の可視化機能 - explainRecommendationReasoningの外部API呼び出しが失敗したとき、簡略版根拠説明に代替される
  test('外部API呼び出し失敗時に推奨パターンマスタから簡略版根拠説明を返す', async () => {
    const recommendationId = 'rec-20240115-001';
    const customerContext = {
      industry: 'IT',
      companySize: 'mid-market',
      previousSuccessRate: 0.85,
      challengePattern: 'cost_optimization'
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn()
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Service unavailable'))
    };

    const mockRecommendationPatternMaster = [
      {
        patternId: 'pattern-it-001',
        industry: 'IT',
        successRate: 0.85,
        briefExplanation: '推奨理由：過去商談での成功実績が高いパターンです',
        applicabilityNote: 'IT業界での成約率85%'
      },
      {
        patternId: 'pattern-it-002',
        industry: 'IT',
        successRate: 0.72,
        briefExplanation: '推奨理由：同規模企業での導入実績が豊富です',
        applicabilityNote: 'IT業界中堅企業での成約率72%'
      }
    ];

    const result = await explainRecommendationReasoning(
      recommendationId,
      customerContext,
      mockAIEngine,
      mockRecommendationPatternMaster
    );

    expect(result).toEqual({
      type: 'brief',
      explanationText: '推奨理由：過去商談での成功実績が高いパターンです',
      applicabilityNote: 'IT業界での成約率85%',
      patternId: 'pattern-it-001',
      successRate: 0.85,
      isFallback: true
    });

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});