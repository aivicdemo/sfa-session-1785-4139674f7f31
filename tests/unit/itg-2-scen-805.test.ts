import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-805: 重複度スコアが統合判定閾値未満の場合、統合対象外として判定される', () => {
    // 統合判定閾値を 0.80 に設定
    const mergeThreshold = 0.80;
    const duplicateScoreFromStub = 0.75;

    // 顧客データA: 同一企業名だが住所が異なる
    const customerDataA = {
      customer_id: 'CUST-001',
      company_name: 'TechCorp Inc.',
      address: '123 Main Street, Tokyo, Japan',
      phone_number: '+81-90-1234-5678',
    };

    // 顧客データB: 同一企業名だが電話番号が異なる
    const customerDataB = {
      customer_id: 'CUST-002',
      company_name: 'TechCorp Inc.',
      address: '456 Side Avenue, Osaka, Japan',
      phone_number: '+81-90-8765-4321',
    };

    // 重複検出ロジックを実行
    // duplicateScore = 0.75（スタブで固定）、mergeThreshold = 0.80
    const result = detectDuplicateCustomers(
      [customerDataA, customerDataB],
      mergeThreshold,
      duplicateScoreFromStub
    );

    // 期待結果の検証
    expect(result).toEqual({
      merge_status: '統合対象外',
      duplicate_score: 0.75,
      merge_threshold: 0.80,
      judgment_reason: '重複度スコア 0.75 が閾値 0.80 未満のため統合対象外',
      customer_pair: {
        customer_id_a: 'CUST-001',
        customer_id_b: 'CUST-002',
      },
    });

    // スコアが閾値未満であることを確認
    expect(result.duplicate_score).toBeLessThan(result.merge_threshold);
    expect(result.merge_status).toBe('統合対象外');
  });
});