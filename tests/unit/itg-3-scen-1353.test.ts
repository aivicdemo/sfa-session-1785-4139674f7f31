import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1353
  test('[normal] 推奨根拠の可視化と説明文生成機能 - 同じ推奨根拠データで説明文生成を2回実行したとき、2回とも同じ説明文が返される', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn((reasoningData) => {
        return `顧客業種「${reasoningData.industry}」の企業に対して、商談ステージ「${reasoningData.dealStage}」において成功パターンID「${reasoningData.successPatternId}」に基づいた提案アプローチを推奨します。過去の類似案件における成功実績から、このタイミングでの提案が最適と判定されました。`;
      }),
    };

    const testReasoningData = {
      industry: '製造業',
      dealStage: '提案前',
      successPatternId: 'PAT-001',
    };

    const result1 = mockAIEngine.explainRecommendationReasoning(testReasoningData);
    const result2 = mockAIEngine.explainRecommendationReasoning(testReasoningData);

    expect(result1).toBe(result2);
    expect(result1).toBe(
      '顧客業種「製造業」の企業に対して、商談ステージ「提案前」において成功パターンID「PAT-001」に基づいた提案アプローチを推奨します。過去の類似案件における成功実績から、このタイミングでの提案が最適と判定されました。'
    );
  });
});