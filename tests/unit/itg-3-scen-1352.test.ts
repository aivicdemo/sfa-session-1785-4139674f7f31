import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1352
  test('[normal] 推奨根拠の可視化と説明文生成機能 - 推奨根拠データが複数件のとき、すべての根拠が統合された説明文が生成される', () => {
    const recommendationId = 'rec-001';
    
    const multipleReasoningData = [
      {
        type: 'industry_match',
        description: '顧客業界が過去成功事例と一致',
        scorePercentage: 92,
      },
      {
        type: 'proposal_amount_range',
        description: '提案金額帯が類似案件の成約ボーダーライン内',
        scorePercentage: 88,
      },
      {
        type: 'deal_cycle_match',
        description: '商談期間が標準成約サイクルに合致',
        scorePercentage: 85,
      },
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(multipleReasoningData),
      explainRecommendationReasoning: jest.fn(
        (recId: string, reasoningData: typeof multipleReasoningData) => {
          const reasons = reasoningData
            .map(
              (r) =>
                `${r.description}（信頼度${r.scorePercentage}%）`
            )
            .join('、さらに');

          return `本案件は${reasons}しています。これらの複合要因から、本提案アプローチの成功確度は高いと判断されます。`;
        }
      ),
    };

    const explanation = explainRecommendationReasoning(
      recommendationId,
      multipleReasoningData,
      mockAIRecommendationEngine
    );

    expect(explanation).toContain('顧客業界が過去成功事例と一致');
    expect(explanation).toContain('92%');
    expect(explanation).toContain('提案金額帯が類似案件の成約ボーダーライン内');
    expect(explanation).toContain('88%');
    expect(explanation).toContain('商談期間が標準成約サイクルに合致');
    expect(explanation).toContain('85%');
    expect(explanation).toMatch(/さらに|、|また/);
    expect(explanation).toContain('複合要因');
    expect(explanation).toContain('成功確度は高い');
  });
});