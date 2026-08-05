import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx11Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 AIエージェント', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('SCEN-1297: 分類結果を知識ベースに登録する自律処理が正常に実行される', async () => {
    // Arrange: テスト用の営業事例データを定義
    const mockSalesExamples = [
      {
        example_id: 'EX-001',
        example_type: 'success',
        customer_name: 'ABC株式会社',
        proposal_content: '既存顧客への追加営業で3ヶ月のフォローアップを実施',
        deal_result: 'won',
        deal_amount: 500000,
        sales_rep_id: 'REP-001',
        created_at: '2024-01-10T09:00:00Z'
      },
      {
        example_id: 'EX-002',
        example_type: 'success',
        customer_name: 'XYZ太郎商事',
        proposal_content: '初回接触後1週間以内に提案資料を送付し、2日後にフォローアップ電話',
        deal_result: 'won',
        deal_amount: 750000,
        sales_rep_id: 'REP-002',
        created_at: '2024-01-12T10:30:00Z'
      },
      {
        example_id: 'EX-003',
        example_type: 'success',
        customer_name: '株式会社デジタル',
        proposal_content: 'ニーズ分析会議を開催後、カスタマイズ提案を実施',
        deal_result: 'won',
        deal_amount: 1200000,
        sales_rep_id: 'REP-003',
        created_at: '2024-01-15T14:15:00Z'
      },
      {
        example_id: 'EX-004',
        example_type: 'failure',
        customer_name: 'テスト企業A',
        proposal_content: '初回接触のみで提案資料を未送付のまま放置',
        deal_result: 'lost',
        deal_amount: 0,
        sales_rep_id: 'REP-004',
        created_at: '2024-01-08T11:00:00Z'
      },
      {
        example_id: 'EX-005',
        example_type: 'failure',
        customer_name: 'テスト企業B',
        proposal_content: '提案後の顧客フォローアップが2週間以上途絶',
        deal_result: 'lost',
        deal_amount: 0,
        sales_rep_id: 'REP-005',
        created_at: '2024-01-18T15:45:00Z'
      }
    ];

    // 既存パターンマスタデータ
    const mockExistingPatterns = [
      {
        pattern_id: 'PAT-001',
        pattern_name: '継続的フォローアップ成功パターン',
        success_factor: '定期的な接触と提案資料の早期送付',
        correlation_score: 0.92
      },
      {
        pattern_id: 'PAT-002',
        pattern_name: 'ニーズ分析駆動成功パターン',
        success_factor: 'カスタマイズ提案による高額受注',
        correlation_score: 0.88
      },
      {
        pattern_id: 'PAT-003',
        pattern_name: '接触途絶失敗パターン',
        success_factor: '初期対応後のフォローアップ停止',
        correlation_score: -0.85
      }
    ];

    // AI分類結果スタブ
    const mockAiClassificationResults = [
      {
        example_id: 'EX-001',
        matched_pattern_id: 'PAT-001',
        success_factors: '既存顧客への3ヶ月継続フォローアップが成功要因',
        failure_factors: null,
        classification_confidence: 0.88,
        extracted_factors_text: '定期的なフォローアップと顧客関係の維持'
      },
      {
        example_id: 'EX-002',
        matched_pattern_id: 'PAT-001',
        success_factors: '初回接触から1週間以内の提案送付と迅速なフォローアップ',
        failure_factors: null,
        classification_confidence: 0.91,
        extracted_factors_text: '迅速なレスポンスと時間的余裕を持たせた提案'
      },
      {
        example_id: 'EX-003',
        matched_pattern_id: 'PAT-002',
        success_factors: 'ニーズ分析会議の開催とカスタマイズ提案',
        failure_factors: null,
        classification_confidence: 0.85,
        extracted_factors_text: 'ニーズ深堀りに基づいたカスタマイズ提案による高額受注'
      },
      {
        example_id: 'EX-004',
        matched_pattern_id: 'PAT-003',
        success_factors: null,
        failure_factors: '初回接触のみで提案資料送付なし',
        classification_confidence: 0.89,
        extracted_factors_text: '初期接触後の対応停止による失注'
      },
      {
        example_id: 'EX-005',
        matched_pattern_id: 'PAT-003',
        success_factors: null,
        failure_factors: '提案後2週間以上フォローアップなし',
        classification_confidence: 0.87,
        extracted_factors_text: 'フォローアップ途絶による顧客関心低下と失注'
      }
    ];

    // モックレスポンス設定
    // 1. 営業システムから事例データ抽出
    fetchMock.mockResponseOnce(JSON.stringify({
      status: 'success',
      data: mockSalesExamples,
      count: 5
    }), { status: 200 });

    // 2. 既存パターン参照
    fetchMock.mockResponseOnce(JSON.stringify({
      status: 'success',
      data: mockExistingPatterns,
      count: 3
    }), { status: 200 });

    // 3. AI分類実行（事例5件分の応答を個別に用意）
    for (let i = 0; i < 5; i++) {
      fetchMock.mockResponseOnce(JSON.stringify({
        status: 'success',
        classification_result: mockAiClassificationResults[i]
      }), { status: 200 });
    }

    // 4. 知識ベース登録（事例5件分）
    for (let i = 0; i < 5; i++) {
      fetchMock.mockResponseOnce(JSON.stringify({
        status: 'success',
        registered_example_id: mockAiClassificationResults[i].example_id,
        knowledge_base_id: `KB-${String(i + 1).padStart(5, '0')}`,
        timestamp: '2024-01-20T10:00:00Z'
      }), { status: 200 });
    }

    // Act: オーケストレーター関数を実行
    const result = await runTx11Imp1Agent({
      batch_execution_id: 'BATCH-TX11-20240120-001',
      trigger_timestamp: '2024-01-20T10:00:00Z',
      ai_agent_id: 'AI-AGENT-TX11-001'
    });

    // Assert
    // (1) オーケストレーター関数が正常終了し、処理サマリーを返すことを確認
    expect(result).toHaveProperty('status');
    expect(result.status).toBe('success');

    expect(result).toHaveProperty('processing_summary');
    expect(result.processing_summary).toHaveProperty('total_processed_count');
    expect(result.processing_summary.total_processed_count).toBe(5);

    expect(result.processing_summary).toHaveProperty('registered_count');
    expect(result.processing_summary.registered_count).toBe(5);

    expect(result.processing_summary).toHaveProperty('skipped_count');
    expect(result.processing_summary.skipped_count).toBe(0);

    expect(result.processing_summary).toHaveProperty('escalation_count');
    expect(result.processing_summary.escalation_count).toBe(0);

    // (2) 登録ペイロードの内容を確認
    expect(result).toHaveProperty('registered_payloads');
    expect(Array.isArray(result.registered_payloads)).toBe(true);
    expect(result.registered_payloads.length).toBe(5);

    // 最初の成功事例の登録ペイロード検証
    const firstSuccessPayload = result.registered_payloads[0];
    expect(firstSuccessPayload).toHaveProperty('example_id');
    expect(firstSuccessPayload.example_id).toBe('EX-001');

    expect(firstSuccessPayload).toHaveProperty('example_type');
    expect(firstSuccessPayload.example_type).toBe('success');

    expect(firstSuccessPayload).toHaveProperty('classified_pattern_id');
    expect(firstSuccessPayload.classified_pattern_id).toBe('PAT-001');

    expect(firstSuccessPayload).toHaveProperty('extracted_factors_text');
    expect(firstSuccessPayload.extracted_factors_text).toBe('定期的なフォローアップと顧客関係の維持');

    expect(firstSuccessPayload).toHaveProperty('classification_timestamp');
    expect(firstSuccessPayload.classification_timestamp).toBe('2024-01-20T10:00:00Z');

    expect(firstSuccessPayload).toHaveProperty('ai_agent_id');
    expect(firstSuccessPayload.ai_agent_id).toBe('AI-AGENT-TX11-001');

    // 失敗事例のペイロードも検証（最後の登録ペイロード）
    const lastFailurePayload = result.registered_payloads[4];
    expect(lastFailurePayload).toHaveProperty('example_id');
    expect(lastFailurePayload.example_id).toBe('EX-005');

    expect(lastFailurePayload).toHaveProperty('example_type');
    expect(lastFailurePayload.example_type).toBe('failure');

    expect(lastFailurePayload).toHaveProperty('classified_pattern_id');
    expect(lastFailurePayload.classified_pattern_id).toBe('PAT-003');

    expect(lastFailurePayload).toHaveProperty('extracted_factors_text');
    expect(lastFailurePayload.extracted_factors_text).toBe('フォローアップ途絶による顧客関心低下と失注');

    // (3) 監査ログの記録を確認
    expect(result).toHaveProperty('audit_log_events');
    expect(Array.isArray(result.audit_log_events)).toBe(true);
    expect(result.audit_log_events.length).toBeGreaterThanOrEqual(1);

    const autonomousActionEvent = result.audit_log_events.find(
      (event: any) => event.event_type === 'autonomous_action_executed'
    );
    expect(autonomousActionEvent).toBeDefined();

    expect(autonomousActionEvent).toHaveProperty('action_name');
    expect(autonomousActionEvent.action_name).toBe('register_classification_to_knowledge_base');

    expect(autonomousActionEvent).toHaveProperty('executed_at');
    expect(autonomousActionEvent.executed_at).toBe('2024-01-20T10:00:00Z');

    expect(autonomousActionEvent).toHaveProperty('processed_count');
    expect(autonomousActionEvent.processed_count).toBe(5);

    expect(autonomousActionEvent).toHaveProperty('result_status');
    expect(autonomousActionEvent.result_status).toBe('success');

    // (4) 自動抽出・分類・登録の一連の流れが完結していることを確認
    expect(result).toHaveProperty('orchestration_trace');
    expect(result.orchestration_trace).toHaveProperty('step_sequence');
    expect(result.orchestration_trace.step_sequence).toContain('extract_examples');
    expect(result.orchestration_trace.step_sequence).toContain('analyze_classifications');
    expect(result.orchestration_trace.step_sequence).toContain('register_to_knowledge_base');

    // (5) 分類精度が80%以上であることを確認
    const allClassificationConfidenceScores = result.registered_payloads.map(
      (payload: any) => payload.classification_confidence_score
    );
    allClassificationConfidenceScores.forEach((score: number) => {
      expect(score).toBeGreaterThanOrEqual(0.80);
    });

    // (6) 成功・失敗事例の分類が正確に行われていることを確認
    const successExamplesInResult = result.registered_payloads.filter(
      (payload: any) => payload.example_type === 'success'
    );
    expect(successExamplesInResult.length).toBe(3);

    const failureExamplesInResult = result.registered_payloads.filter(
      (payload: any) => payload.example_type === 'failure'
    );
    expect(failureExamplesInResult.length).toBe(2);
  });
});