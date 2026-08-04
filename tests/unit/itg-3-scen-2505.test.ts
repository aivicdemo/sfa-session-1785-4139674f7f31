import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('成功パターンテンプレート設計機能 - プロセスステップ順序検証', () => {
  // SCEN-2505
  test('営業プロセスステップが逆順のときテンプレート生成がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        const error = new Error('営業プロセスステップは昇順（ステップ1→2→3）で定義してください');
        (error as any).code = 'INVALID_PROCESS_STEP_ORDER';
        throw error;
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      processSteps: [
        {
          stepNumber: 3,
          stepName: 'クロージング',
          successCondition: {
            metric: '成約率',
            threshold: 50,
          },
        },
        {
          stepNumber: 2,
          stepName: '提案',
          successCondition: {
            metric: '承認率',
            threshold: 60,
          },
        },
        {
          stepNumber: 1,
          stepName: 'ヒアリング',
          successCondition: {
            metric: '完了率',
            threshold: 80,
          },
        },
      ],
      aiEngine: mockAIEngine,
    };

    expect(() => generateSuccessPatternTemplate(input)).toThrow(/INVALID_PROCESS_STEP_ORDER/);
    expect(() => generateSuccessPatternTemplate(input)).toThrow(/営業プロセスステップは昇順/);
  });
});