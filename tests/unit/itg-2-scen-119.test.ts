import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-119: 統合対象データの電話番号が空値の場合、他の属性で判定を継続する', () => {
    const candidate_data = {
      customer_id: 'C001',
      name: '山田太郎',
      phone: '',
      email: 'yamada@example.com',
      address: '東京都渋谷区',
    };

    const master_data = {
      customer_id: 'C002',
      name: '山田太郎',
      phone: '09012345678',
      email: 'yamada@example.com',
      address: '東京都渋谷区',
    };

    const result = detectDuplicateAndMergeJudgment(candidate_data, master_data);

    expect(result.should_merge).toBe(true);
    expect(result.merge_reason).toContain('電話番号は空値のため判定対象外');
    expect(result.merge_reason).toContain('他属性で判定継続');
    expect(result.matched_attributes).toContain('name');
    expect(result.matched_attributes).toContain('email');
    expect(result.matched_attributes).toContain('address');
  });
});