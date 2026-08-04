import { describe, test, expect } from '@jest/globals';
import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  test('SCEN-476: 検証結果レポートが空配列のとき、エラーがスロー される', () => {
    const empty_validation_results: never[] = [];

    expect(() => {
      calculateDataQualityScore(empty_validation_results);
    }).toThrow(/検証結果が空です|No validation results provided/);
  });
});