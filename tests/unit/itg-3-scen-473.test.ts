import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-473
  test('検証結果データセットが空でない場合、全レコードを計算に組み込んで平均スコアを返却する', () => {
    const validationResultDataset = [
      {
        recordId: 'record_001',
        validationScore: 0.85,
        timestamp: new Date('2024-01-15T10:00:00Z'),
      },
      {
        recordId: 'record_002',
        validationScore: 0.92,
        timestamp: new Date('2024-01-15T10:05:00Z'),
      },
      {
        recordId: 'record_003',
        validationScore: 0.78,
        timestamp: new Date('2024-01-15T10:10:00Z'),
      },
    ];

    const result = calculateDataQualityScore(validationResultDataset);

    const expectedScore = (0.85 + 0.92 + 0.78) / 3;
    expect(result.score).toBe(expectedScore);
    expect(result.recordsProcessed).toBe(3);
    expect(result.calculationLog).toContain('record_001');
    expect(result.calculationLog).toContain('record_002');
    expect(result.calculationLog).toContain('record_003');
  });
});