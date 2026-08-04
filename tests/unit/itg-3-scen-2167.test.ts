import { calculateProcessDeviationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案プロセス乖離度の数値化', () => {
  // SCEN-2167
  test('標準プロセスからの乖離度がちょうど 0% のとき、乖離スコアが 0 で算出される', () => {
    const standardProcessSteps = [
      {
        stepId: 'step_1',
        stepName: '初期接触',
        sequenceOrder: 1,
        isRequired: true,
      },
      {
        stepId: 'step_2',
        stepName: 'ニーズヒアリング',
        sequenceOrder: 2,
        isRequired: true,
      },
      {
        stepId: 'step_3',
        stepName: '提案資料作成',
        sequenceOrder: 3,
        isRequired: true,
      },
      {
        stepId: 'step_4',
        stepName: '提案プレゼンテーション',
        sequenceOrder: 4,
        isRequired: true,
      },
      {
        stepId: 'step_5',
        stepName: '契約締結',
        sequenceOrder: 5,
        isRequired: true,
      },
    ];

    const actualProposalProcess = [
      {
        stepId: 'step_1',
        stepName: '初期接触',
        sequenceOrder: 1,
        isCompleted: true,
        completionDate: new Date('2024-01-10T10:00:00Z'),
      },
      {
        stepId: 'step_2',
        stepName: 'ニーズヒアリング',
        sequenceOrder: 2,
        isCompleted: true,
        completionDate: new Date('2024-01-11T14:30:00Z'),
      },
      {
        stepId: 'step_3',
        stepName: '提案資料作成',
        sequenceOrder: 3,
        isCompleted: true,
        completionDate: new Date('2024-01-12T09:15:00Z'),
      },
      {
        stepId: 'step_4',
        stepName: '提案プレゼンテーション',
        sequenceOrder: 4,
        isCompleted: true,
        completionDate: new Date('2024-01-13T16:45:00Z'),
      },
      {
        stepId: 'step_5',
        stepName: '契約締結',
        sequenceOrder: 5,
        isCompleted: true,
        completionDate: new Date('2024-01-15T11:00:00Z'),
      },
    ];

    const deviationScore = calculateProcessDeviationScore(
      standardProcessSteps,
      actualProposalProcess
    );

    expect(typeof deviationScore).toBe('number');
    expect(deviationScore).toBe(0);
  });
});