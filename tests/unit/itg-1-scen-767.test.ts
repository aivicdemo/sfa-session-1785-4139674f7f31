import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-767
  test('行動パターン分析対象指標の自動選定機能 - 分析対象指標が0件の場合、空の分析対象指標リストが返される', () => {
    const result = selectAnalysisIndicators([]);

    expect(result.indicators).toEqual([]);
    expect(result.count).toBe(0);
  });
});