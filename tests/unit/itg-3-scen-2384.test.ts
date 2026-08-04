import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2384: [error] 推論精度スコア算出機能 - 推論結果オブジェクトが空のとき、エラーが発生する
  test('推論結果オブジェクトが空のとき、バリデーションエラーをスロー', () => {
    const emptyInferenceResult = {};

    expect(() => {
      calculateInferenceAccuracyScore(emptyInferenceResult);
    }).toThrow(/推論結果が不正な形式です|推論結果にデータが含まれていません/);
  });
});