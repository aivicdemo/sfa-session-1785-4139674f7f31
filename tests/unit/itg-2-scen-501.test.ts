import { evaluateDuplicateAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-501
  test('重複スコアが許容閾値ちょうどのとき、統合対象として判定される', () => {
    const customer_a = {
      id: 'CUST-001',
      name: '山田太郎',
      email: 'yamada@example.com',
    };

    const customer_b = {
      id: 'CUST-002',
      name: '山田太郎',
      email: 'yamada.taro@example.com',
    };

    const duplicate_score = 80.0;
    const threshold = 80.0;

    const result = evaluateDuplicateAndMerge({
      customer_a,
      customer_b,
      duplicate_score,
      threshold,
    });

    expect(result.should_merge).toBe(true);
    expect(result.merge_reason).toBe('重複スコア: 80.0点（閾値: 80.0点）');
  });
});