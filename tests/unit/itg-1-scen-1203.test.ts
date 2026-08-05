import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateAiInferenceAccuracyAndAlert } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1203
  test('相関分析レポート生成機能 - 分析開始日が分析終了日より後の日付のとき処理がエラーになる', () => {
    const analysis_start_date = new Date('2024-12-31T00:00:00Z');
    const analysis_end_date = new Date('2024-12-25T00:00:00Z');

    expect(() =>
      calculateAiInferenceAccuracyAndAlert({
        analysis_start_date,
        analysis_end_date,
        inference_logs: [],
        threshold_accuracy_score: 95,
      })
    ).toThrow(/分析開始日は分析終了日以前の日付/);
  });
});