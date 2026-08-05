import { calculateFollowupSuccessRate } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質月次分析機能 - フォローアップ成功率計算', () => {
  // SCEN-919: [edge] フォローアップ成功率計算で割算により端数が発生するときの丸め処理が正しく適用される
  test('成功件数3、総件数7のとき、フォローアップ成功率は42.86（小数点第2位で四捨五入）として返される', () => {
    const successCount = 3;
    const totalCount = 7;
    
    const result = calculateFollowupSuccessRate(successCount, totalCount);
    
    expect(result).toBe(42.86);
  });
});