import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-127
  test('プロセス標準書のシステム要件変換機能 - プロセス段階に重複が含まれている場合、エラーになる', () => {
    const process_standard_book_data = {
      process_id: 'PROC-001',
      process_name: '営業標準プロセス',
      stages: [
        {
          stage_id: 'STAGE-001',
          stage_name: '初回接触',
          sequence: 1,
          decision_criteria: '顧客情報取得',
          data_items: ['customer_name', 'contact_info'],
        },
        {
          stage_id: 'STAGE-002',
          stage_name: '提案',
          sequence: 2,
          decision_criteria: '提案内容確定',
          data_items: ['proposal_content', 'estimated_price'],
        },
        {
          stage_id: 'STAGE-001',
          stage_name: '初回接触（重複）',
          sequence: 3,
          decision_criteria: '顧客情報取得',
          data_items: ['customer_name', 'contact_info'],
        },
        {
          stage_id: 'STAGE-003',
          stage_name: '交渉',
          sequence: 4,
          decision_criteria: '条件調整',
          data_items: ['negotiation_terms', 'final_price'],
        },
      ],
      approval_status: 'approved',
    };

    expect(() =>
      convertProcessStandardToSystemRequirements(process_standard_book_data)
    ).toThrow(/DUPLICATE_PROCESS_STAGE/);
  });
});