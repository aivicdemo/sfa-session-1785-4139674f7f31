import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2507
  test('成功パターンテンプレート設計機能 - ワークショップの開催日時がnullのとき、テンプレート生成がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputData = {
      workshopDateTime: null,
      successFactors: ['顧客との信頼構築', '提案の段階的展開'],
      failureFactors: ['一括提案による抵抗感'],
      salesProcessSteps: [
        { stepId: 1, stepName: '初回接触', successPattern: '丁寧なヒアリング' },
        { stepId: 2, stepName: '提案', successPattern: '段階的な提案' },
      ],
    };

    expect(() => {
      generateSuccessPatternTemplate(inputData, mockAIEngine);
    }).toThrow(/ワークショップの開催日時/);
  });
});