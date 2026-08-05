import { describe, it, expect } from '@jest/globals';
import { generateSalesPerformanceReportWithUnreviewedDetection } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  it('SCEN-903: 問題検出結果のレビューステータスが未レビューのとき、エラーになる', () => {
    // 問題検出結果オブジェクトを作成し、レビューステータスを「未レビュー」に設定
    const problem_detection_result = {
      issue_id: 'ISSUE-001',
      detection_timestamp: new Date('2024-01-15T10:30:00Z'),
      sales_staff_id: 'STAFF-123',
      issue_type: 'process_deviation',
      severity: 'high',
      confidence_score: 92.5,
      review_status: 'unreview',
      reviewer_id: null,
      review_timestamp: null,
      review_notes: null,
    };

    // レビューステータスが「未レビュー」である問題検出結果を引数にしてレポート生成関数を呼び出す
    expect(() => {
      generateSalesPerformanceReportWithUnreviewedDetection(problem_detection_result);
    }).toThrow(/未レビュー/);
  });
});