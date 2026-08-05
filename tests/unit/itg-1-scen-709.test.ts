import { analyzeProposalAndCustomerResponsePattern } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  // SCEN-709
  test('提案実行から顧客対応記録入力までの期間がちょうど閾値と一致する場合に異常判定境界を検証', () => {
    const proposal_execution_datetime = new Date('2024-01-15T09:00:00Z');
    const customer_response_record_datetime = new Date('2024-01-18T09:00:00Z');
    const abnormality_judgment_threshold_hours = 72;
    const proposal_content = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-001',
      proposal_type: 'standard',
      proposal_summary: 'Product A proposal',
    };
    const customer_response_pattern = {
      response_id: 'RESP-001',
      response_type: 'follow_up_record',
      response_details: 'Customer acknowledged proposal',
    };

    const result = analyzeProposalAndCustomerResponsePattern({
      proposal_execution_datetime,
      customer_response_record_datetime,
      abnormality_judgment_threshold_hours,
      proposal_content,
      customer_response_pattern,
    });

    expect(result.abnormality_flag).toBe(false);
    expect(result.judgment_reason).toBe(
      '対応期間が閾値72時間と一致 - 標準プロセス範囲内'
    );
    expect(result.elapsed_time_detail.total_hours).toBe(72);
    expect(result.elapsed_time_detail.total_minutes).toBe(0);
    expect(result.elapsed_time_detail.total_seconds).toBe(0);
    expect(result.elapsed_time_detail.formatted_duration).toBe('72時間00分00秒');
  });
});