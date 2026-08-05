import { convertProcessStandardToDraft } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-176: [error] 営業プロセス標準書の要件仕様変換機能 - プロセス標準書ドラフトが空文字列のとき、入力値不正エラーが発生する
  test('プロセス標準書ドラフトが空文字列のとき、INVALID_INPUT_EMPTY_DRAFTエラーが発生する', () => {
    const input = {
      processDraft: '',
      salesStages: ['初回接触', '提案', '交渉', '成約'],
      targetProducts: ['商品A', '商品B'],
      executorRole: '営業担当者',
      kpiCriteria: {
        minContactFrequency: 2,
        proposalSuccessRate: 0.6,
        followUpIntervalDays: 7,
      },
    };

    expect(() => convertProcessStandardToDraft(input)).toThrow(/INVALID_INPUT_EMPTY_DRAFT/);
  });
});