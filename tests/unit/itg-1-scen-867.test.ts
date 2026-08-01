import { calculateProcessDeviationCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-867
  test('営業プロセス標準書との乖離分析と成約実績の相関分析 - 乖離が成果に与える影響を正の相関・負の相関・無相関で正確に分類する', () => {
    const standardProcess = {
      steps: 5,
      processName: '標準営業プロセス',
    };

    const salesActivities = [
      {
        activityId: 'ACT001',
        actualSteps: [1, 2, 3, 4, 5],
        contracted: true,
        contractAmount: 500000,
      },
      {
        activityId: 'ACT002',
        actualSteps: [1, 2, 3, 4, 5],
        contracted: true,
        contractAmount: 450000,
      },
      {
        activityId: 'ACT003',
        actualSteps: [1, 2, 3, 4, 5],
        contracted: true,
        contractAmount: 480000,
      },
      {
        activityId: 'ACT004',
        actualSteps: [1, 2, 3, 4, 5],
        contracted: true,
        contractAmount: 520000,
      },
      {
        activityId: 'ACT005',
        actualSteps: [1, 2, 3, 4, 5],
        contracted: true,
        contractAmount: 460000,
      },
      {
        activityId: 'ACT006',
        actualSteps: [1, 2, 4, 5],
        contracted: false,
        contractAmount: 0,
      },
      {
        activityId: 'ACT007',
        actualSteps: [1, 2, 4, 5],
        contracted: false,
        contractAmount: 0,
      },
      {
        activityId: 'ACT008',
        actualSteps: [1, 2, 4, 5],
        contracted: false,
        contractAmount: 0,
      },
      {
        activityId: 'ACT009',
        actualSteps: [1, 3, 2, 4, 5],
        contracted: true,
        contractAmount: 300000,
      },
      {
        activityId: 'ACT010',
        actualSteps: [1, 3, 2, 4, 5],
        contracted: true,
        contractAmount: 310000,
      },
      {
        activityId: 'ACT011',
        actualSteps: [1, 3, 2, 4, 5],
        contracted: true,
        contractAmount: 290000,
      },
      {
        activityId: 'ACT012',
        actualSteps: [2, 3, 4, 5],
        contracted: true,
        contractAmount: 400000,
      },
    ];

    const result = calculateProcessDeviationCorrelation(
      standardProcess,
      salesActivities
    );

    expect(result.positiveCorrelationCases.length).toBeGreaterThan(0);
    expect(result.negativeCorrelationCases.length).toBeGreaterThan(0);
    expect(result.noCorrelationCases.length).toBeGreaterThan(0);

    result.positiveCorrelationCases.forEach((positiveCase) => {
      expect(positiveCase.correlationCoefficient).toBeGreaterThanOrEqual(0.3);
    });

    result.negativeCorrelationCases.forEach((negativeCase) => {
      expect(negativeCase.correlationCoefficient).toBeLessThanOrEqual(-0.3);
    });

    result.noCorrelationCases.forEach((noCorrelationCase) => {
      expect(noCorrelationCase.correlationCoefficient).toBeGreaterThanOrEqual(
        -0.3
      );
      expect(noCorrelationCase.correlationCoefficient).toBeLessThanOrEqual(0.3);
    });

    result.positiveCorrelationCases.forEach((positiveCase) => {
      expect(positiveCase.targetActivityCount).toBeGreaterThan(0);
      expect(typeof positiveCase.correlationCoefficient).toBe('number');
      expect(positiveCase.calculationLogicName).toBe('Pearsonの相関係数');
    });

    result.negativeCorrelationCases.forEach((negativeCase) => {
      expect(negativeCase.targetActivityCount).toBeGreaterThan(0);
      expect(typeof negativeCase.correlationCoefficient).toBe('number');
      expect(negativeCase.calculationLogicName).toBe('Pearsonの相関係数');
    });

    result.noCorrelationCases.forEach((noCorrelationCase) => {
      expect(noCorrelationCase.targetActivityCount).toBeGreaterThan(0);
      expect(typeof noCorrelationCase.correlationCoefficient).toBe('number');
      expect(noCorrelationCase.calculationLogicName).toBe('Pearsonの相関係数');
    });

    const verificationPattern1 = result.positiveCorrelationCases.find(
      (c) => c.deviationPattern === 'step_order_changed'
    );
    expect(verificationPattern1).toBeDefined();
    expect(verificationPattern1!.correlationCoefficient).toBeGreaterThanOrEqual(
      0.3
    );

    const verificationPattern2 = result.negativeCorrelationCases.find(
      (c) => c.deviationPattern === 'step_skipped'
    );
    expect(verificationPattern2).toBeDefined();
    expect(verificationPattern2!.correlationCoefficient).toBeLessThanOrEqual(
      -0.3
    );

    const verificationPattern3 = result.noCorrelationCases.find(
      (c) => c.deviationPattern === 'missing_initial_step'
    );
    expect(verificationPattern3).toBeDefined();
    expect(verificationPattern3!.correlationCoefficient).toBeGreaterThanOrEqual(
      -0.3
    );
    expect(verificationPattern3!.correlationCoefficient).toBeLessThanOrEqual(
      0.3
    );

    expect(result.totalAnalyzedActivities).toBe(12);
    expect(result.analysisCompletionTimestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );
  });
});