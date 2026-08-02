import { calculateValidationResultPriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-183
  test('検証結果の重度度スコアが閾値より1低いとき、より低い優先度が割り当てられる', () => {
    const severityThreshold = 50;
    const belowThresholdSeverityScore = 49;
    const validationResult = {
      severityScore: belowThresholdSeverityScore,
      issueCount: 3,
      issueTypes: ['duplicate', 'missing_field', 'format_error'],
      detectionTimestamp: new Date('2024-01-15T10:00:00Z'),
      dataQualityRuleId: 'rule-001',
    };

    const priority = calculateValidationResultPriority(
      validationResult,
      severityThreshold
    );

    expect(priority).toBe('Low');
  });
});