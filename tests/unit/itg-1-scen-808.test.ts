import { calculateBehaviorPatternAnalysis } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-808: 営業プロセスのステップ数が1の場合、そのステップのみで乖離度を計算する', () => {
    // Arrange: ステップ数が1のテストデータを準備
    const processSteps = [
      {
        stepId: 'STEP-001',
        standardValue: 80,
        actualValue: 85,
      },
    ];

    const input = {
      salesEmployeeId: 'EMP-001',
      analysisName: 'Q1-2024-PatternAnalysis',
      processSteps: processSteps,
    };

    // Act: 営業担当者行動パターン分析機能を実行
    const result = calculateBehaviorPatternAnalysis(input);

    // Assert: 単一ステップの乖離度が正確に計算されていることを検証
    // 期待される乖離度 = (85 - 80) / 80 × 100 = 6.25%
    const expectedDeviationRate = 6.25;

    expect(result).toEqual({
      salesEmployeeId: 'EMP-001',
      analysisName: 'Q1-2024-PatternAnalysis',
      stepCount: 1,
      stepDeviations: [
        {
          stepId: 'STEP-001',
          deviationRate: expectedDeviationRate,
        },
      ],
      averageDeviationRate: expectedDeviationRate,
      includesMultipleStepComparison: false,
    });

    // 追加検証: 複数ステップの統合分析やステップ間比較が含まれていないことを確認
    expect(result.stepDeviations.length).toBe(1);
    expect(result.includesMultipleStepComparison).toBe(false);
  });
});