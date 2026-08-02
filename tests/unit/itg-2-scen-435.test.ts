import { validateDataQualityAfterCorrection } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-435
  test('修正済みデータが0件の場合、改善必要項目として明示される', () => {
    const correctedData = {
      correctedRecordCount: 0,
      validationTimestamp: '2024-01-15T11:00:00Z',
      targetPeriod: '2024-01',
    };

    const result = validateDataQualityAfterCorrection(correctedData);

    expect(result.improvementRequiredItems).toContain('修正済みデータ件数');
    expect(result.itemDetails).toEqual(
      expect.objectContaining({
        修正済みデータ件数: expect.objectContaining({
          value: 0,
          status: '改善必要',
        }),
      })
    );
    expect(result.overallStatus).toBe('改善必要');
  });
});