import { classifyProblemSeverityAndPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-778: 低重要度・低優先度の問題は長期的な改善対応が必要と判定される', () => {
    // Arrange: 低重要度・低優先度の問題検出結果を準備
    const problemDetectionResult = {
      problemId: 'PROB-20240115-001',
      problemType: 'minor_process_deviation',
      detectionTimestamp: new Date('2024-01-15T10:30:00Z'),
      affectedSalesPersonId: 'SP-0042',
      affectedCustomerId: 'CUST-20240115-0001',
      problemDescription: '提案資料のテンプレート適用率が軽微に低下（業界標準比95%）',
      severityIndicators: {
        customerImpactScore: 15,
        processDeviation: 8,
        frequencyCount: 2,
        estimatedLossPotential: 5000,
      },
      priorityIndicators: {
        timelinessUrgency: 2,
        dependencyCount: 0,
        riskEscalationPotential: 1,
      },
    };

    // Act: 問題検出結果を重要度・優先度分類機能に入力
    const classificationResult = classifyProblemSeverityAndPriority(
      problemDetectionResult
    );

    // Assert: 分類結果が「低重要度・低優先度」で長期的な改善対応と判定される
    expect(classificationResult.severity).toBe('low');
    expect(classificationResult.priority).toBe('low');
    expect(classificationResult.responseStrategy).toBe(
      '長期的な改善対応'
    );
    expect(classificationResult.targetedForImmediateResponse).toBe(false);
    expect(classificationResult.responseTimelineInDays).toBe(90);
    expect(classificationResult.responseCategoryClassification).toBe(
      '改善対象'
    );
    expect(classificationResult.requiresExecutiveReview).toBe(false);
  });
});