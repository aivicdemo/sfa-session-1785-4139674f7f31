import { analyzeProposalAndCustomerInteraction } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-666: [normal] 提案実行と顧客対応記録の入力によるAIエージェント分析開始
  test('提案実行レコードが存在する状態で顧客対応記録を入力した場合、AIエージェント分析が自動開始される', () => {
    // 入力データ: 営業担当者が顧客対応記録を入力
    const proposalId = 'PROP-001';
    const customerId = 'CUST-123';
    const contactDateTime = new Date('2024-01-15T14:30:00Z');
    const contactType = '訪問';
    const contactContent = '顧客から追加要件の確認を受け、納期を2月末に調整することで合意';
    const contactResult = '合意';

    // 提案実行レコードの既存データ
    const existingProposal = {
      proposal_id: proposalId,
      customer_id: customerId,
      proposal_status: '実行中',
      created_at: new Date('2024-01-10T10:00:00Z'),
    };

    // AIエージェント分析開始イベント
    const analysisStartEvent = {
      proposal_id: proposalId,
      event_type: 'analysis_start',
      timestamp: new Date('2024-01-15T14:30:00Z'),
    };

    // 関数呼び出し
    const result = analyzeProposalAndCustomerInteraction({
      proposal_id: proposalId,
      customer_id: customerId,
      contact_datetime: contactDateTime,
      contact_type: contactType,
      contact_content: contactContent,
      contact_result: contactResult,
      existing_proposal: existingProposal,
    });

    // 期待結果の検証
    // 1. 顧客対応記録が正常に保存されていることを確認
    expect(result.contact_record_saved).toBe(true);
    expect(result.contact_record_id).toBeDefined();

    // 2. 分析ステータスが「分析待機中」から「分析実行中」に変更されていることを確認
    expect(result.previous_analysis_status).toBe('分析待機中');
    expect(result.current_analysis_status).toBe('分析実行中');

    // 3. 分析用レコードが作成されていることを確認（分析ID自動採番）
    expect(result.analysis_id).toBeDefined();
    expect(result.analysis_record_created).toBe(true);

    // 4. 分析開始タイムスタンプが記録されていることを確認
    expect(result.analysis_start_timestamp).toEqual(new Date('2024-01-15T14:30:00Z'));

    // 5. AIエージェント分析タスクがシステムキューに投入されていることを確認
    expect(result.analysis_task_queued).toBe(true);
    expect(result.queued_event.proposal_id).toBe('PROP-001');
    expect(result.queued_event.event_type).toBe('analysis_start');
    expect(result.queued_event.timestamp).toEqual(new Date('2024-01-15T14:30:00Z'));

    // 6. 提案ID と分析IDの紐付けが正しいことを確認
    expect(result.analysis_id).toMatch(/^ANALYSIS-/);
    expect(result.linked_proposal_id).toBe('PROP-001');

    // 7. 顧客対応記録の内容が分析用レコードに正しく反映されていることを確認
    expect(result.analysis_input_data.contact_type).toBe('訪問');
    expect(result.analysis_input_data.contact_result).toBe('合意');
    expect(result.analysis_input_data.contact_content).toBe('顧客から追加要件の確認を受け、納期を2月末に調整することで合意');
  });
});