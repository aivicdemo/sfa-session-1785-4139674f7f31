import { extractSalesProcessLogs } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-076
  test('確定後に同じ入力で再度実行しても同じ抽出範囲が得られる', () => {
    const startDateTime = '2024-01-01T09:00:00Z';
    const endDateTime = '2024-01-31T18:00:00Z';

    const firstExtractionResult = extractSalesProcessLogs({
      startDateTime,
      endDateTime,
    });

    const secondExtractionResult = extractSalesProcessLogs({
      startDateTime,
      endDateTime,
    });

    expect(firstExtractionResult.recordCount).toBe(
      secondExtractionResult.recordCount
    );

    expect(firstExtractionResult.records).toEqual(
      secondExtractionResult.records
    );

    firstExtractionResult.records.forEach((record, index) => {
      const secondRecord = secondExtractionResult.records[index];
      expect(record.id).toBe(secondRecord.id);
      expect(record.timestamp).toBe(secondRecord.timestamp);
      expect(record.processStage).toBe(secondRecord.processStage);
    });
  });
});