import { defineExtractRangeConfirmation } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  test('SCEN-072: 対象営業担当者リストが空のとき抽出範囲確定がエラーになる', () => {
    const input = {
      targetSalesRepIds: [],
      extractionStartDate: '2024-01-01',
      extractionEndDate: '2024-01-31',
      targetProcessPhase: '提案',
    };

    expect(() =>
      defineExtractRangeConfirmation(input)
    ).toThrow(/対象営業担当者/);
  });
});