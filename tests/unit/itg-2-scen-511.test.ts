import { normalizeCompanyName } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-511
  test('正規化ルール適用で企業名の敬称・括弧が統一される', () => {
    const input_with_honorific = '株式会社ABC';
    const input_with_bracket = 'XYZ（東京支店）';

    const result_honorific = normalizeCompanyName(input_with_honorific);
    const result_bracket = normalizeCompanyName(input_with_bracket);

    expect(result_honorific).toBe('ABC');
    expect(result_bracket).toBe('XYZ');
  });
});