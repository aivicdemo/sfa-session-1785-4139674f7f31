import { validateProblemDetectionId } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-824: 問題検出結果IDが空文字列の場合にエラーが発生すること', () => {
    const invalidProblemDetectionId = '';

    expect(() => validateProblemDetectionId(invalidProblemDetectionId)).toThrow(/INVALID_PROBLEM_DETECTION_ID/);
  });
});