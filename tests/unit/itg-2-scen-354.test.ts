import { detectDuplicateCandidates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-354
  test('重複候補スコアがちょうど統合判定閾値となる場合、統合判定が確定される', () => {
    const mergeThreshold = 0.85;
    
    const customer_a = {
      customer_id: 'CUST_001',
      company_name: '株式会社ABC',
      kana_name: 'カブシキガイシャエービーシー',
      postal_code: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      address: '丸の内1-1-1',
      phone: '03-1234-5678',
      email: 'contact@abc.example.com',
      representative_name: '山田太郎',
      industry: '情報通信業',
      established_year: 2010,
      employee_count: 150,
      capital: 50000000
    };

    const customer_b = {
      customer_id: 'CUST_002',
      company_name: 'ＡＢＣ株式会社',
      kana_name: 'エービーシーカブシキガイシャ',
      postal_code: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      address: '丸の内1-1-1',
      phone: '03-1234-5678',
      email: 'info@abc.example.com',
      representative_name: '山田太郎',
      industry: '情報通信業',
      established_year: 2010,
      employee_count: 150,
      capital: 50000000
    };

    const result = detectDuplicateCandidates(
      customer_a,
      customer_b,
      mergeThreshold
    );

    expect(result.duplicate_score).toBe(0.85);
    expect(result.merge_status).toBe('統合対象確定');
    expect(result.is_merge_target).toBe(true);
    expect(result.judgment_log).toMatch(/スコア\s*0\.85\s*により判定閾値以上と判定/);
    expect(result.judgment_log).toContain('スコア 0.85');
  });
});