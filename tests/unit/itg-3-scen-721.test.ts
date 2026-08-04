import { validateDealDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-721: [error] 推奨生成前データ完全性判定機能 - 商談予定日が空のとき推奨生成不可と判定される', () => {
    const dealData = {
      customerName: 'テスト顧客A',
      productCategory: 'ソフトウェア',
      budget: '500万円',
      plannedDealDate: null,
    };

    expect(() => validateDealDataCompleteness(dealData)).toThrow(/商談予定日/);
  });
});