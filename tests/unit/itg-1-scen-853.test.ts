import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-853
  test('行動パターンデータが未入力の場合、VALIDATION_ERROR_BEHAVIOR_PATTERN_MISSINGエラーをスロー', () => {
    const invalidRequest = {
      salesPersonId: 'SP001',
      analysisStartDate: '2024-01-01T00:00:00Z',
      analysisEndDate: '2024-01-31T23:59:59Z',
      behaviorPatternData: [],
      standardProcessSteps: [
        { stepId: 'STEP001', stepName: '初回接触', expectedDurationDays: 3 },
        { stepId: 'STEP002', stepName: '提案', expectedDurationDays: 7 },
        { stepId: 'STEP003', stepName: '交渉', expectedDurationDays: 14 },
        { stepId: 'STEP004', stepName: '成約', expectedDurationDays: 0 },
      ],
      contractResults: [
        {
          contractId: 'CON001',
          customerId: 'CUST001',
          contractAmount: 500000,
          contractDate: '2024-01-25T00:00:00Z',
          contractStatus: 'completed',
        },
      ],
    };

    expect(() => analyzeProcessDeviationAndCorrelation(invalidRequest)).toThrow(/行動パターンデータ/);
  });
});