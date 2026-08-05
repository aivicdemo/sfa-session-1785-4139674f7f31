import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateComprehensionScoreAndJudgeCompletion } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1025
  test('理解度スコアが100を超える値のとき処理がエラーになること', () => {
    const input = {
      comprehension_score: 101,
      staff_id: 'STAFF_001',
      guideline_id: 'GUIDE_001',
    };

    expect(() => validateComprehensionScoreAndJudgeCompletion(input)).toThrow(/理解度スコア/);
  });
});