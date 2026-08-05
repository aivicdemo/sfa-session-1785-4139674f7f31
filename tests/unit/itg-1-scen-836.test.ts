import { validateDetectionResultReviewFlag } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-836: 営業部長への報告対象フラグが真偽値ではない場合にエラーになること', () => {
    // テスト対象: 問題検出結果のレビュー・判定機能
    // 入力: 営業部長への報告対象フラグに真偽値ではない値を設定
    
    // ケース1: 文字列 'true'
    expect(() => {
      validateDetectionResultReviewFlag({
        detectionResultId: 'result-001',
        reviewerComments: 'テスト評価',
        shouldReportToExecutive: 'true' as any,
      });
    }).toThrow(/営業部長への報告対象フラグ/);

    // ケース2: 数値 1
    expect(() => {
      validateDetectionResultReviewFlag({
        detectionResultId: 'result-002',
        reviewerComments: 'テスト評価',
        shouldReportToExecutive: 1 as any,
      });
    }).toThrow(/営業部長への報告対象フラグ/);

    // ケース3: null
    expect(() => {
      validateDetectionResultReviewFlag({
        detectionResultId: 'result-003',
        reviewerComments: 'テスト評価',
        shouldReportToExecutive: null as any,
      });
    }).toThrow(/営業部長への報告対象フラグ/);

    // ケース4: undefined
    expect(() => {
      validateDetectionResultReviewFlag({
        detectionResultId: 'result-004',
        reviewerComments: 'テスト評価',
        shouldReportToExecutive: undefined as any,
      });
    }).toThrow(/営業部長への報告対象フラグ/);

    // ケース5: オブジェクト
    expect(() => {
      validateDetectionResultReviewFlag({
        detectionResultId: 'result-005',
        reviewerComments: 'テスト評価',
        shouldReportToExecutive: {} as any,
      });
    }).toThrow(/営業部長への報告対象フラグ/);

    // ケース6: 配列
    expect(() => {
      validateDetectionResultReviewFlag({
        detectionResultId: 'result-006',
        reviewerComments: 'テスト評価',
        shouldReportToExecutive: [] as any,
      });
    }).toThrow(/営業部長への報告対象フラグ/);

    // 期待結果: エラーコードとメッセージの検証
    try {
      validateDetectionResultReviewFlag({
        detectionResultId: 'result-007',
        reviewerComments: 'テスト評価',
        shouldReportToExecutive: 'invalid' as any,
      });
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.code).toBe('INVALID_BOOLEAN_TYPE');
      expect(error.message).toBe('営業部長への報告対象フラグはboolean型である必要があります');
    }
  });
});