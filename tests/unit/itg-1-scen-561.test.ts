import { groupProblemaByResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-561
  test('対応時期別の問題グループ化機能 - 複数の問題が入力されない場合、処理が失敗する', () => {
    const emptyProblems: any[] = [];

    const result = groupProblemaByResponseTiming(emptyProblems);

    expect(result).toEqual({
      errorCode: 'INVALID_INPUT_EMPTY',
      errorMessage: '問題データが1件以上必要です'
    });
  });
});