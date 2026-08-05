import { describe, test, expect, beforeEach } from '@jest/globals';
import { selectAnalysisIndicatorsAutomatically } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1077: [error] 行動パターン分析指標自動選定機能 - 営業案件と顧客の紐付けが存在しない場合にエラーが発生する
  test('営業案件と顧客の紐付けが空の状態で例外を発生させる', () => {
    const salesOpportunitiesList = [];
    const customerLinkages = [];

    expect(() =>
      selectAnalysisIndicatorsAutomatically(salesOpportunitiesList, customerLinkages)
    ).toThrow(/紐付け/);
  });
});