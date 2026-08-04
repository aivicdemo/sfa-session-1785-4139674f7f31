import { visualizeReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1120
  test('成功パターン適用可能性スコアが負の値のとき、根拠可視化処理がエラーになる', () => {
    const evaluatedPattern = {
      patternId: 'pattern-001',
      patternName: '初期接触型提案',
      relevanceScore: -0.5,
      successMetrics: {
        adoptionRate: 0.72,
        contractValue: 1500000,
      },
      applicableConditions: {
        industryType: '製造業',
        companySize: '大企業',
      },
      reasoningBasis: {
        pastCaseCount: 45,
        successCaseCount: 32,
      },
    };

    expect(() => visualizeReasoning(evaluatedPattern)).toThrow(/適用可能性スコア/);
  });
});