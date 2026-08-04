import { verifyInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推論精度検証', () => {
  test('SCEN-386: 検証実行日が月初1日のとき、前月全体のデータを月次検証対象に含める', () => {
    const verificationExecutionDate = new Date('2026-02-01T00:00:00Z');
    
    const mockAIRecommendationEngine = {
      getMonthlyVerificationDataset: jest.fn(() => ({
        datasetPeriodStart: new Date('2026-01-01T00:00:00Z'),
        datasetPeriodEnd: new Date('2026-01-31T23:59:59Z'),
        records: [
          {
            recordId: 'record_001',
            occurrenceDate: new Date('2026-01-15T10:30:00Z'),
            recommendationId: 'rec_001',
            actualOutcome: true,
          },
          {
            recordId: 'record_002',
            occurrenceDate: new Date('2026-01-28T14:20:00Z'),
            recommendationId: 'rec_002',
            actualOutcome: false,
          },
        ],
        totalRecords: 2,
      })),
    };

    const result = verifyInferenceAccuracy(
      verificationExecutionDate,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.getMonthlyVerificationDataset).toHaveBeenCalledWith(
      expect.objectContaining({
        targetYear: 2026,
        targetMonth: 1,
      })
    );

    expect(result.verificationTargetPeriodStart).toEqual(
      new Date('2026-01-01T00:00:00Z')
    );
    expect(result.verificationTargetPeriodEnd).toEqual(
      new Date('2026-01-31T23:59:59Z')
    );

    expect(result.verificationTargetPeriodStart.getFullYear()).toBe(2026);
    expect(result.verificationTargetPeriodStart.getMonth()).toBe(0);
    expect(result.verificationTargetPeriodStart.getDate()).toBe(1);

    expect(result.verificationTargetPeriodEnd.getFullYear()).toBe(2026);
    expect(result.verificationTargetPeriodEnd.getMonth()).toBe(0);
    expect(result.verificationTargetPeriodEnd.getDate()).toBe(31);

    expect(result.includedRecords.length).toBe(2);
    expect(
      result.includedRecords.every(
        (record) =>
          record.occurrenceDate >= result.verificationTargetPeriodStart &&
          record.occurrenceDate <= result.verificationTargetPeriodEnd
      )
    ).toBe(true);

    expect(result.excludedCurrentMonthRecords).toBeDefined();
    expect(result.excludedCurrentMonthRecords.length).toBe(0);
  });
});