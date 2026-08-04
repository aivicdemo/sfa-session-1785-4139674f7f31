import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-150
  test('推奨内容に対応する根拠が存在しない場合に空として表示される', () => {
    const recommendationWithoutReasoning = {
      recommendationId: 'rec_001',
      proposalApproach: '既存顧客との関係強化を通じた追加提案',
      recommendedTiming: '2024-02-15',
      recommendedQuantity: 5,
      confidenceScore: 78,
      reasoningData: null,
    };

    const result = explainRecommendationReasoning(
      recommendationWithoutReasoning
    );

    expect(result.reasoningExplanation).toBe('');
    expect(result.supportingEvidence).toEqual([]);
    expect(result.hasReasoning).toBe(false);
    expect(result.placeholderMessage).toBeUndefined();
  });
});