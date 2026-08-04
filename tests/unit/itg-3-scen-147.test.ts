import { RecommendationReasoningVisualizer } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-147
  test('推奨根拠の可視化機能 - 根拠情報に重複データが含まれる場合に重複が保持される', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue([
        {
          reasonId: 'R001',
          text: '顧客業種が製造業で過去成功率85%',
          weight: 0.8,
        },
        {
          reasonId: 'R002',
          text: '契約規模5000万円以上で成約率92%',
          weight: 0.7,
        },
        {
          reasonId: 'R001',
          text: '顧客業種が製造業で過去成功率85%',
          weight: 0.8,
        },
      ]),
    };

    const visualizer = new RecommendationReasoningVisualizer(
      mockAIRecommendationEngine
    );

    const displayedReasoning = visualizer.displayReasoning({
      recommendationId: 'REC-12345',
      customerId: 'CUST-67890',
    });

    expect(displayedReasoning.reasons).toHaveLength(3);
    expect(displayedReasoning.reasons[0]).toEqual({
      reasonId: 'R001',
      text: '顧客業種が製造業で過去成功率85%',
      weight: 0.8,
    });
    expect(displayedReasoning.reasons[1]).toEqual({
      reasonId: 'R002',
      text: '契約規模5000万円以上で成約率92%',
      weight: 0.7,
    });
    expect(displayedReasoning.reasons[2]).toEqual({
      reasonId: 'R001',
      text: '顧客業種が製造業で過去成功率85%',
      weight: 0.8,
    });
  });
});