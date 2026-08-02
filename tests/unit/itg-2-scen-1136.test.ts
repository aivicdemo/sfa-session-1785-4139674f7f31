import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-1136: 重複スコアが閾値以上である場合、統合判定が合格する', () => {
    // Arrange
    const recordA = {
      customer_id: 'CUST001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const recordB = {
      customer_id: 'CUST002',
      name: '山田 太郎',
      address: '東京都 渋谷区',
      phone: '09012345678',
    };

    const duplicate_score_threshold = 0.80;
    const duplicate_score = 0.85;

    // Act
    const result = detectDuplicateAndMergeJudgment({
      record_a: recordA,
      record_b: recordB,
      duplicate_score: duplicate_score,
      duplicate_score_threshold: duplicate_score_threshold,
    });

    // Assert
    expect(result.judgment_status).toBe('APPROVED');
    expect(result.merge_target_flag).toBe(true);
    expect(result.judgment_log).toEqual(
      expect.stringContaining('重複スコア：0.85')
    );
    expect(result.judgment_log).toEqual(
      expect.stringContaining('閾値：0.80')
    );
    expect(result.judgment_log).toEqual(
      expect.stringContaining('判定：閾値以上のため合格')
    );
  });
});