import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-473
  test('検証結果データセットが空でない場合、全レコードを計算に組み込み、正確な平均スコアを返却する', () => {
    const validationResultDataset = [
      {
        recordId: '001',
        validationScore: 0.85,
        timestamp: '2024-01-15T10:00:00Z',
        ruleId: 'rule_001'
      },
      {
        recordId: '002',
        validationScore: 0.92,
        timestamp: '2024-01-15T10:05:00Z',
        ruleId: 'rule_002'
      },
      {
        recordId: '003',
        validationScore: 0.78,
        timestamp: '2024-01-15T10:10:00Z',
        ruleId: 'rule_003'
      }
    ];

    const result = calculateDataQualityScore(validationResultDataset);

    const expectedAverageScore = (0.85 + 0.92 + 0.78) / 3;
    expect(result.score).toBe(0.85);
    expect(result.recordsProcessed).toBe(3);
    expect(result.calculationLog).toContain('0.85');
    expect(result.calculationLog).toContain('0.92');
    expect(result.calculationLog).toContain('0.78');
  });
});