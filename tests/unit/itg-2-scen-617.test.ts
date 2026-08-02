import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-617
  test('顧客名が空値の場合、重複判定対象外となる', () => {
    const customerRecordA = {
      customer_id: 'CUST001',
      customer_name: '',
      address: '東京都渋谷区1-1-1',
      phone_number: '03-1234-5678',
    };

    const customerRecordB = {
      customer_id: 'CUST002',
      customer_name: '株式会社テスト',
      address: '東京都渋谷区1-1-1',
      phone_number: '03-1234-5678',
    };

    const result = detectDuplicateAndMergeJudgment([
      customerRecordA,
      customerRecordB,
    ]);

    expect(result).toEqual({
      is_duplicate_detected: false,
      duplicate_flag: false,
      merge_candidate_included: false,
      excluded_reason: '顧客名が空値',
      judgement_result: 'excluded_from_duplicate_check',
    });
  });
});