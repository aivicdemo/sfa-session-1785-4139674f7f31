import { detectDuplicateAndMergeRecommendation } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-205
  test('重複判定スコアが閾値と同じとき、統合推奨判定がYESとなる', () => {
    const customer_a = {
      customer_id: 'CUST001',
      name: '株式会社A',
      name_kana: 'カブシキガイシャエー',
      phone: '03-1234-5678',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内',
      industry: '製造業',
      employee_count: 150,
      established_date: '2000-04-15',
    };

    const customer_b = {
      customer_id: 'CUST002',
      name: '(株)A',
      name_kana: 'カブシキガイシャエー',
      phone: '03-1234-5678',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内',
      industry: '製造業',
      employee_count: 150,
      established_date: '2000-04-15',
    };

    const merge_threshold = 80;
    const duplicate_score = 80;

    const result = detectDuplicateAndMergeRecommendation(
      customer_a,
      customer_b,
      merge_threshold,
      duplicate_score
    );

    expect(result.merge_recommendation_status).toBe('YES');
    expect(result.merge_recommendation_reason).toBe(
      '重複判定スコアが閾値以上のため統合を推奨'
    );
  });
});