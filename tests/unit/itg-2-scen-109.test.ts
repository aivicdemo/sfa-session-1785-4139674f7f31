import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と統合判定機能', () => {
  test('SCEN-109: 正規化ルール設定が0件の場合、正規化なしで判定を実行する', () => {
    const input_customer_record_1 = {
      customer_id: 'C001',
      customer_name: '株式会社ABC',
      address: '東京都渋谷区1-2-3',
    };

    const input_customer_record_2 = {
      customer_id: 'C001',
      customer_name: 'ABC株式会社',
      address: '東京都渋谷区1丁目2番3号',
    };

    const input_normalization_rules = [];

    const result = detectDuplicateAndMergeJudgment(
      [input_customer_record_1, input_customer_record_2],
      input_normalization_rules
    );

    expect(result.match_score).toBeGreaterThanOrEqual(65);
    expect(result.match_score).toBeLessThan(70);
    expect(result.merge_judgment_status).toBe('要確認');
  });
});