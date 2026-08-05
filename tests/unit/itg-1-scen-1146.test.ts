import { describe, it, expect } from '@jest/globals';
import { calculateConversionRate } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  it('SCEN-1146: 営業案件の総数が0のとき、成約率計算がエラーになること', () => {
    const closed_deal_count = 0;
    const total_deal_count = 0;

    expect(() => {
      calculateConversionRate(closed_deal_count, total_deal_count);
    }).toThrow(/営業案件総数が0/);
  });
});