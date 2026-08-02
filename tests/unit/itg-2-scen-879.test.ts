import { decideMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-879
  test('統合判定の信頼度スコアがちょうど閾値のとき、統合推奨と判定される', () => {
    const record_a = {
      customer_id: 'CUST001',
      customer_name: '株式会社サンプル',
      customer_name_kana: 'カブシキガイシャサンプル',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内1-1-1',
      phone_number: '03-1234-5678',
      email: 'info@sample.co.jp',
      created_at: new Date('2024-01-01T09:00:00Z'),
      updated_at: new Date('2024-01-15T10:30:00Z'),
    };

    const record_b = {
      customer_id: 'CUST002',
      customer_name: '株式会社サンプル',
      customer_name_kana: 'カブシキガイシャサンプル',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内1-1-1',
      phone_number: '03-1234-5678',
      email: 'info@sample.co.jp',
      created_at: new Date('2024-01-05T14:00:00Z'),
      updated_at: new Date('2024-01-10T16:45:00Z'),
    };

    const confidence_threshold = 0.75;

    const result = decideMergeJudgment(
      record_a,
      record_b,
      confidence_threshold,
    );

    expect(result.merge_status).toBe('推奨');
    expect(result.confidence_score).toBe(0.75);
  });
});