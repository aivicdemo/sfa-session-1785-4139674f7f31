import { determineNextAction } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-986
  test('品質検証結果が1件の場合に次のアクション判定が正しく実行される', () => {
    const qualityValidationResult = {
      validationResultId: 'VR-20240115-001',
      qualityCheckTimestamp: new Date('2024-01-15T11:00:00Z'),
      salesDataId: 'SD-2024-001',
      customerId: 'CUST-0001',
      validationStatus: 'FAILED',
      errorCount: 2,
      duplicateDetected: false,
      inconsistencyDetected: true,
      inconsistencyDetails: [
        {
          fieldName: 'customerPhone',
          expectedFormat: '^\\d{10,11}$',
          actualValue: '090-1234',
          severity: 'HIGH'
        },
        {
          fieldName: 'customerEmail',
          expectedFormat: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          actualValue: 'invalid-email',
          severity: 'MEDIUM'
        }
      ],
      cleaningApplicable: true,
      normalizationRulesMatched: ['RULE-PHONE-001', 'RULE-EMAIL-001'],
      qualityScore: 65,
      allowableErrorThreshold: 80,
      passedValidation: false
    };

    const result = determineNextAction([qualityValidationResult]);

    expect(result).toEqual({
      actionId: 'ACT-20240115-001',
      actionStatus: 'CORRECTION_REQUIRED',
      actionName: '営業データ修正要',
      targetSalesDataId: 'SD-2024-001',
      targetCustomerId: 'CUST-0001',
      recommendedActions: [
        {
          actionType: 'APPLY_NORMALIZATION',
          priority: 1,
          targetField: 'customerPhone',
          normalizationRule: 'RULE-PHONE-001',
          description: '電話番号形式を正規化'
        },
        {
          actionType: 'APPLY_NORMALIZATION',
          priority: 2,
          targetField: 'customerEmail',
          normalizationRule: 'RULE-EMAIL-001',
          description: 'メールアドレス形式を正規化'
        }
      ],
      executionSequence: 1,
      executionStartTime: new Date('2024-01-15T11:05:00Z'),
      estimatedCompletionTime: new Date('2024-01-15T11:10:00Z'),
      qualityScoreAfterCorrection: 92,
      nextPhase: 'QUALITY_REVALIDATION',
      validationResultReference: 'VR-20240115-001'
    });
  });
});