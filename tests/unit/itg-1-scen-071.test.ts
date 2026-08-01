import { extractSalesProcessLogs } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-071
  test('抽出対象期間が入力されていないとき抽出範囲確定が実行されない', () => {
    const input = {
      startDate: '',
      endDate: '',
    };

    expect(() => extractSalesProcessLogs(input)).toThrow(/抽出対象期間/);
  });
});