import { evaluateApproachesForCustomerScenario } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-274
  test('成功パターンマトリクス参照による提案アプローチ判定 - 複数適用可能なアプローチが成功率の高い順に返される', () => {
    const customerScenario = {
      isNewCustomer: true,
      industry: 'IT',
      budgetRangeMin: 5000000,
      budgetRangeMax: 10000000,
    };

    const successPatternMatrix = [
      {
        approachId: 'approach_a',
        approachName: 'アプローチA',
        successRate: 0.85,
        recommendationReason: '既存顧客への継続提案に最適',
        applicableIndustries: ['IT', 'Finance'],
        applicableBudgetMin: 3000000,
        applicableBudgetMax: 8000000,
      },
      {
        approachId: 'approach_b',
        approachName: 'アプローチB',
        successRate: 0.92,
        recommendationReason: '新規顧客の初期接触に最適',
        applicableIndustries: ['IT', 'Retail', 'Manufacturing'],
        applicableBudgetMin: 5000000,
        applicableBudgetMax: 15000000,
      },
      {
        approachId: 'approach_c',
        approachName: 'アプローチC',
        successRate: 0.78,
        recommendationReason: '中堅企業向けの段階的提案',
        applicableIndustries: ['IT', 'Healthcare'],
        applicableBudgetMin: 1000000,
        applicableBudgetMax: 6000000,
      },
    ];

    const result = evaluateApproachesForCustomerScenario(
      customerScenario,
      successPatternMatrix
    );

    expect(result).toEqual([
      {
        approachId: 'approach_b',
        approachName: 'アプローチB',
        successRate: 0.92,
        recommendationReason: '新規顧客の初期接触に最適',
      },
      {
        approachId: 'approach_a',
        approachName: 'アプローチA',
        successRate: 0.85,
        recommendationReason: '既存顧客への継続提案に最適',
      },
      {
        approachId: 'approach_c',
        approachName: 'アプローチC',
        successRate: 0.78,
        recommendationReason: '中堅企業向けの段階的提案',
      },
    ]);
  });
});