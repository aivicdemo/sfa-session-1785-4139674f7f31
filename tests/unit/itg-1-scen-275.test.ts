import { identifyApplicableApproaches } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-275
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 複数の適用可能なアプローチが特定された場合、成功率が同じものは導入期間の新しい順に順序付けられる', () => {
    const successPatternMatrix = [
      {
        approachId: 'approach_a',
        approachName: 'アプローチA',
        successRate: 75,
        implementationDate: new Date('2024-01-15'),
        applicableScenarios: ['scenario_x'],
      },
      {
        approachId: 'approach_b',
        approachName: 'アプローチB',
        successRate: 75,
        implementationDate: new Date('2023-06-20'),
        applicableScenarios: ['scenario_x'],
      },
      {
        approachId: 'approach_c',
        approachName: 'アプローチC',
        successRate: 60,
        implementationDate: new Date('2024-03-10'),
        applicableScenarios: ['scenario_x'],
      },
    ];

    const currentScenario = {
      scenarioId: 'scenario_x',
      customerSegment: 'enterprise',
      productCategory: 'solution',
    };

    const result = identifyApplicableApproaches(
      successPatternMatrix,
      currentScenario
    );

    expect(result).toEqual([
      {
        approachId: 'approach_a',
        approachName: 'アプローチA',
        successRate: 75,
        implementationDate: new Date('2024-01-15'),
        applicableScenarios: ['scenario_x'],
      },
      {
        approachId: 'approach_b',
        approachName: 'アプローチB',
        successRate: 75,
        implementationDate: new Date('2023-06-20'),
        applicableScenarios: ['scenario_x'],
      },
    ]);
  });
});