import { analyzeCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-838
  test('成約実績が1件の場合、その1件に基づき相関を計算し、計算根拠をメタデータに記録する', () => {
    const dealRecords = [
      {
        dealId: 'DEAL_001',
        salesPersonId: 'SALES_A',
        contractDate: new Date('2024-01-15'),
        contractAmount: 5000000,
        deviationFlag: false,
      },
    ];

    const standardProcess = {
      stepsCount: 5,
      averageDaysToContract: 30,
    };

    const result = analyzeCorrelation({
      dealRecords,
      standardProcess,
    });

    expect(result).toHaveProperty('correlationCoefficient');
    expect(
      result.correlationCoefficient === null ||
        (typeof result.correlationCoefficient === 'number' &&
          result.correlationCoefficient >= 0 &&
          result.correlationCoefficient <= 1)
    ).toBe(true);

    expect(result).toHaveProperty('metadata');
    expect(result.metadata).toBeDefined();
    expect(result.metadata.datasetUsed).toBe('成約実績1件');
    expect(result.metadata.calculationMethod).toBe(
      '単一レコードに対する相関分析ロジック'
    );
    expect(Array.isArray(result.metadata.sourceRecords)).toBe(true);
    expect(result.metadata.sourceRecords).toHaveLength(1);
    expect(result.metadata.sourceRecords[0].dealId).toBe('DEAL_001');
  });
});