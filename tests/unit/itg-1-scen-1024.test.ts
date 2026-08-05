import { validateCompletionJudgment } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  // SCEN-1024
  test('理解度スコアが負の値のとき処理がエラーになること', () => {
    const result = validateCompletionJudgment({
      comprehensionScore: -10,
      practicalApplicationStatus: 'completed',
      trainingCompletionDate: new Date('2024-01-15T11:00:00Z'),
    });

    expect(result).toEqual({
      isValid: false,
      errorCode: 'INVALID_SCORE_NEGATIVE',
      errorMessage: '理解度スコアは0以上の値である必要があります',
      completionJudgment: null,
    });
  });
});