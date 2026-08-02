import { describe, test, expect } from '@jest/globals';
import { normalizeAddress } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-148: 住所の全角スペース除去正規化により、全角スペースが削除される', () => {
    const input_address = '東京都　渋谷区　道玄坂';
    const expected_address = '東京都渋谷区道玄坂';

    const result = normalizeAddress(input_address);

    expect(result).toBe(expected_address);
  });
});