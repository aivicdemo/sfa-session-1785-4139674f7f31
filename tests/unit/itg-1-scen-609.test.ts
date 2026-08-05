import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-609: [normal] AIエージェント推論精度の自動監視とアラート機能 - 同じ入力データでAIエージェント推論が2回実行された場合、両回の精度監視結果が同じ値として記録される
  test('同一入力データで2回の推論実行時に精度監視結果が完全に一致する', () => {
    const testInputData = {
      salesCaseId: 'case_001',
      customerId: 'cust_A001',
      customerAttribute: {
        industry: 'manufacturing',
        revenue: 50000000,
        numberOfEmployees: 500,
      },
      proposalContent: {
        productCategory: 'ERP_system',
        proposalAmount: 5000000,
        implementationPeriod: 6,
      },
      salesStage: 'proposal',
      contactFrequencyPerMonth: 2,
      previousSuccessPatternMatch: true,
    };

    // 1回目の推論実行と精度監視
    const firstInferenceResult = {
      inferenceId: 'inf_001',
      timestamp: '2024-01-15T10:00:00Z',
      recommendationContent: 'Recommend proceeding with phased implementation approach',
      confidenceLevel: 'high',
      selectedLogicPath: 'pattern_match_success_case_001',
      recommendationScore: 0.92,
    };

    const firstMonitoringRecord = monitorAiInferenceAccuracy({
      inferenceResult: firstInferenceResult,
      inputData: testInputData,
      executionOrder: 1,
    });

    // 2回目の推論実行と精度監視
    const secondInferenceResult = {
      inferenceId: 'inf_002',
      timestamp: '2024-01-15T10:05:00Z',
      recommendationContent: 'Recommend proceeding with phased implementation approach',
      confidenceLevel: 'high',
      selectedLogicPath: 'pattern_match_success_case_001',
      recommendationScore: 0.92,
    };

    const secondMonitoringRecord = monitorAiInferenceAccuracy({
      inferenceResult: secondInferenceResult,
      inputData: testInputData,
      executionOrder: 2,
    });

    // 精度スコアが完全に一致する
    expect(firstMonitoringRecord.accuracyScore).toBe(92);
    expect(secondMonitoringRecord.accuracyScore).toBe(92);
    expect(firstMonitoringRecord.accuracyScore).toBe(secondMonitoringRecord.accuracyScore);

    // 推論の信頼度レベルが完全に一致する
    expect(firstMonitoringRecord.confidenceLevel).toBe('high');
    expect(secondMonitoringRecord.confidenceLevel).toBe('high');
    expect(firstMonitoringRecord.confidenceLevel).toBe(secondMonitoringRecord.confidenceLevel);

    // 選択経路が完全に一致する
    expect(firstMonitoringRecord.selectedLogicPath).toBe('pattern_match_success_case_001');
    expect(secondMonitoringRecord.selectedLogicPath).toBe('pattern_match_success_case_001');
    expect(firstMonitoringRecord.selectedLogicPath).toBe(secondMonitoringRecord.selectedLogicPath);

    // 推奨判定内容が完全に一致する
    expect(firstMonitoringRecord.recommendationContent).toBe(
      'Recommend proceeding with phased implementation approach'
    );
    expect(secondMonitoringRecord.recommendationContent).toBe(
      'Recommend proceeding with phased implementation approach'
    );
    expect(firstMonitoringRecord.recommendationContent).toBe(
      secondMonitoringRecord.recommendationContent
    );

    // 入力データへの適合度が完全に一致する
    expect(firstMonitoringRecord.inputDataCompatibilityScore).toBe(
      secondMonitoringRecord.inputDataCompatibilityScore
    );

    // 監視レコード全体が完全に一致する（タイムスタンプとレコードIDを除く）
    expect({
      accuracyScore: firstMonitoringRecord.accuracyScore,
      confidenceLevel: firstMonitoringRecord.confidenceLevel,
      selectedLogicPath: firstMonitoringRecord.selectedLogicPath,
      recommendationContent: firstMonitoringRecord.recommendationContent,
      inputDataCompatibilityScore: firstMonitoringRecord.inputDataCompatibilityScore,
      trustworthinessLevel: firstMonitoringRecord.trustworthinessLevel,
    }).toEqual({
      accuracyScore: secondMonitoringRecord.accuracyScore,
      confidenceLevel: secondMonitoringRecord.confidenceLevel,
      selectedLogicPath: secondMonitoringRecord.selectedLogicPath,
      recommendationContent: secondMonitoringRecord.recommendationContent,
      inputDataCompatibilityScore: secondMonitoringRecord.inputDataCompatibilityScore,
      trustworthinessLevel: secondMonitoringRecord.trustworthinessLevel,
    });
  });
});