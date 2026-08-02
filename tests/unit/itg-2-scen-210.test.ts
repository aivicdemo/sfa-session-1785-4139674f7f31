import { calculateDuplicateJudgmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-210
  test('住所が完全一致するとき、重複判定スコアが満点となる', () => {
    const customer_record_1 = {
      customer_id: 'CUST001',
      customer_name: '株式会社太郎',
      prefecture: '東京都',
      city: '渋谷区',
      address: '1-2-3',
      building: 'アルファビル5F',
    };

    const customer_record_2 = {
      customer_id: 'CUST002',
      customer_name: '株式会社次郎',
      prefecture: '東京都',
      city: '渋谷区',
      address: '1-2-3',
      building: 'アルファビル5F',
    };

    const duplicate_judgment_score = calculateDuplicateJudgmentScore(
      customer_record_1,
      customer_record_2,
    );

    expect(duplicate_judgment_score).toBe(100);
  });
});