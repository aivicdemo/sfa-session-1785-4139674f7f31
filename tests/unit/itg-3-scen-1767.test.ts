import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1767
  test('根拠説明文が業務上の最大文字数を1文字超過するとき根拠表示内容を切り詰めて返す', () => {
    const MAX_REASONING_LENGTH = 5000;
    const OVER_LENGTH = 5001;
    const oversizedReasoning = 'A'.repeat(OVER_LENGTH);

    const aiRecommendationEngineStub = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(oversizedReasoning),
    };

    const result = explainRecommendationReasoning(
      {
        recommendationId: 'REC-001',
        customerId: 'CUST-001',
        proposalApproachId: 'PROP-001',
        confidenceScore: 85,
      },
      aiRecommendationEngineStub
    );

    expect(result.length).toBe(MAX_REASONING_LENGTH);
    expect(result).toBe('A'.repeat(MAX_REASONING_LENGTH));
    expect(result[MAX_REASONING_LENGTH - 1]).toBe('A');
  });
});