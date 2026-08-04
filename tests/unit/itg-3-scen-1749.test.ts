import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1749
  test('推奨根拠の可視化機能 - 根拠が重複データを含むとき重複を排除して返す', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([
        { reasonId: 'R001', text: '顧客業界が製造業' },
        { reasonId: 'R002', text: '過去成功率85%' },
        { reasonId: 'R001', text: '顧客業界が製造業' }
      ])
    };

    const recommendationId = 'REC-20240115-001';
    const dealId = 'DEAL-20240115-A001';

    const result = explainRecommendationReasoning(
      recommendationId,
      dealId,
      mockAIEngine
    );

    expect(result).toEqual([
      { reasonId: 'R001', text: '顧客業界が製造業' },
      { reasonId: 'R002', text: '過去成功率85%' }
    ]);
    expect(result).toHaveLength(2);
  });
});