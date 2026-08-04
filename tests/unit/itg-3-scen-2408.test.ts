import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推論精度スコア算出', () => {
  test('SCEN-2408: 管理職への提示対象データが空のとき、エラーが発生する', () => {
    // 入力: 空の配列
    const emptyDataset: any[] = [];
    
    expect(() => {
      calculateInferenceAccuracyScore(emptyDataset);
    }).toThrow(/提示対象データ/);
  });
});