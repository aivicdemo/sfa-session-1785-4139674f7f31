import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1753
  test('根拠カテゴリが欠落しているとき根拠を不分類として処理する', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: 'rec_20240115_001',
        explanation: '過去12ヶ月の類似案件では、顧客業種がIT企業で従業員数が500名以上の場合、3月から4月のタイミングで導入予算が確保される傾向があります。本件顧客も同様の属性を持つため、提案タイミングを3月中旬に設定することを推奨します。',
        supportingData: [
          {
            dataPoint: '類似案件の成約率',
            value: 0.72
          },
          {
            dataPoint: '購買タイミング一致度',
            value: 0.85
          }
        ]
      })
    };

    const recommendationId = 'rec_20240115_001';
    const result = explainRecommendationReasoning(
      recommendationId,
      mockAIEngine
    );

    expect(result).toEqual({
      recommendationId: 'rec_20240115_001',
      explanation: '過去12ヶ月の類似案件では、顧客業種がIT企業で従業員数が500名以上の場合、3月から4月のタイミングで導入予算が確保される傾向があります。本件顧客も同様の属性を持つため、提案タイミングを3月中旬に設定することを推奨します。',
      reasoningCategory: 'unclassified',
      supportingData: [
        {
          dataPoint: '類似案件の成約率',
          value: 0.72
        },
        {
          dataPoint: '購買タイミング一致度',
          value: 0.85
        }
      ],
      displayLabel: '不分類'
    });

    expect(result.reasoningCategory).toBe('unclassified');
    expect(result.displayLabel).toBe('不分類');
    expect(result.explanation).toBeTruthy();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(recommendationId);
  });
});