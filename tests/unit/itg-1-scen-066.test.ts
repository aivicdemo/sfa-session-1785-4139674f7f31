import { describe, it, expect } from '@jest/globals';
import { confirmExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  it('SCEN-066: 抽出対象期間の開始日が月初のとき開始日が確定される', () => {
    const start_date = new Date('2024-01-01T00:00:00Z');
    const end_date = new Date('2024-01-31T23:59:59Z');

    const result = confirmExtractionRange({
      start_date,
      end_date,
    });

    expect(result.confirmed_start_date).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(result.confirmed_start_date.getUTCHours()).toBe(0);
    expect(result.confirmed_start_date.getUTCMinutes()).toBe(0);
    expect(result.confirmed_start_date.getUTCSeconds()).toBe(0);
  });
});