import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-622: 類似度スコアが閾値ちょうど80%の場合、重複と判定される', () => {
    // 顧客A：名前『田中太郎』、住所『東京都渋谷区』、電話『090-1234-5678』
    const customerA = {
      customer_id: 'CUST001',
      name: '田中太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    // 顧客B：名前『田中太郎』、住所『東京都渋谷区』、電話『090-1234-5679』
    const customerB = {
      customer_id: 'CUST002',
      name: '田中太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5679',
    };

    // 類似度スコアが正確に80.0%となるペアを入力
    const result = detectDuplicateCustomers([customerA, customerB], {
      similarity_threshold: 80.0,
    });

    // 戻り値の重複フラグおよび判定ステータスを検証
    expect(result).toEqual({
      is_duplicate: true,
      status: '重複候補',
      similarity_score: 80.0,
      customer_pair: {
        primary_id: 'CUST001',
        duplicate_id: 'CUST002',
      },
    });
  });
});