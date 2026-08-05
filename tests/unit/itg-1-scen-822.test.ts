import { evaluateDetectionResultSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-822: [normal] 問題検出結果の重要度・根拠・対応必要性判定機能 - 顧客対応パターンの問題のみが検出された場合の重要度判定が実行される
  test('顧客対応パターンの問題のみが検出された場合、重要度が中（2）と判定され、根拠と対応必要性フラグが正しく設定される', () => {
    // 検出結果データ：顧客対応パターンの問題のみを含むオブジェクトを生成
    const detection_result = {
      id: 'det_001',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      sales_rep_id: 'sr_123',
      detection_type: 'customer_response_pattern',
      issue_description: '顧客からのメール返信までの日数が標準から5日以上遅延している',
      detected_issues: [
        {
          type: 'customer_response_pattern',
          severity: 'medium',
          description: '顧客対応パターンに問題が検出されました'
        }
      ],
      contract_issues: [],
      proposal_issues: [],
      activity_issues: []
    };

    // 重要度判定関数に検出結果オブジェクトを入力として渡す
    const result = evaluateDetectionResultSeverity(detection_result);

    // 期待結果の検証
    expect(result.severity_level).toBe(2);
    expect(result.reason).toBe('顧客対応パターンに問題が検出されました');
    expect(result.action_required).toBe(true);
  });
});