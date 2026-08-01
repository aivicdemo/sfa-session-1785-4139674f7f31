import { analyzeProposalExecutionPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-395
  test('分析対象となる提案実行レコードが複数件の場合、全件に対して乖離度と合致度が計算される', () => {
    const sales_representative_id = 'REP001';
    const proposal_executions = [
      {
        id: 'PROP001',
        sales_representative_id,
        proposal_date: new Date('2024-01-15T10:00:00Z'),
        proposal_content: 'Solution A',
        contract_flg: true,
        visit_count: 3,
        email_count: 5,
        proposal_document_view_time_minutes: 45,
      },
      {
        id: 'PROP002',
        sales_representative_id,
        proposal_date: new Date('2024-01-20T14:30:00Z'),
        proposal_content: 'Solution B',
        contract_flg: false,
        visit_count: 1,
        email_count: 2,
        proposal_document_view_time_minutes: 15,
      },
      {
        id: 'PROP003',
        sales_representative_id,
        proposal_date: new Date('2024-02-05T09:15:00Z'),
        proposal_content: 'Solution C',
        contract_flg: true,
        visit_count: 4,
        email_count: 7,
        proposal_document_view_time_minutes: 60,
      },
    ];

    const contract_results = [
      {
        proposal_execution_id: 'PROP001',
        contract_amount: 500000,
        contract_date: new Date('2024-01-22T16:00:00Z'),
      },
      {
        proposal_execution_id: 'PROP003',
        contract_amount: 750000,
        contract_date: new Date('2024-02-10T11:30:00Z'),
      },
    ];

    const result = analyzeProposalExecutionPatterns({
      sales_representative_id,
      proposal_executions,
      contract_results,
    });

    expect(result).toHaveProperty('analysis_results');
    expect(Array.isArray(result.analysis_results)).toBe(true);
    expect(result.analysis_results).toHaveLength(3);

    expect(result.analysis_results[0]).toEqual({
      proposal_execution_id: 'PROP001',
      deviation_score: 25,
      alignment_score: 78,
    });

    expect(result.analysis_results[1]).toEqual({
      proposal_execution_id: 'PROP002',
      deviation_score: 45,
      alignment_score: 62,
    });

    expect(result.analysis_results[2]).toEqual({
      proposal_execution_id: 'PROP003',
      deviation_score: 18,
      alignment_score: 85,
    });
  });
});