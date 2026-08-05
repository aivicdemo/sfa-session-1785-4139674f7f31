import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeProposalAndCustomerResponsePattern } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-726
  it('提案内容と顧客対応パターンの標準プロセス比較分析 - 重複する顧客対応記録が含まれる場合の異常パターン検出に対する影響を検証', async () => {
    // 準備: 同一顧客ID「CUST-001」に対して、同じ日時「2024-01-15 10:00」で記録された2件の顧客対応記録
    const duplicateCustomerResponseRecords = [
      {
        record_id: 'REC-100',
        customer_id: 'CUST-001',
        response_date: '2024-01-15T10:00:00Z',
        response_type: 'email',
        response_content: 'Thank you for your proposal',
        sales_person_id: 'SP-001',
      },
      {
        record_id: 'REC-101',
        customer_id: 'CUST-001',
        response_date: '2024-01-15T10:00:00Z',
        response_type: 'email',
        response_content: 'Thank you for your proposal',
        sales_person_id: 'SP-001',
      },
    ];

    const proposalData = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-001',
      sales_person_id: 'SP-001',
      proposal_content: 'Enterprise package at 500,000 JPY',
      proposal_date: '2024-01-10T14:30:00Z',
      standard_process_step: 'presentation',
    };

    const standardProcessDefinition = {
      steps: [
        { step_name: 'initial_contact', expected_duration_days: 3 },
        { step_name: 'presentation', expected_duration_days: 7 },
        { step_name: 'negotiation', expected_duration_days: 5 },
        { step_name: 'contract', expected_duration_days: 1 },
      ],
      success_response_pattern: ['follow_up_contact', 'email', 'phone_call'],
    };

    // スタブ化された外部検証サービスの重複チェックレスポンス
    fetchMock.mockResponseOnce(
      JSON.stringify({
        has_duplicates: true,
        duplicate_records: ['REC-100', 'REC-101'],
        duplicate_count: 2,
        confidence: 0.98,
      }),
      { status: 200 }
    );

    // 分析エンジンを実行
    const analysisResult = await analyzeProposalAndCustomerResponsePattern({
      proposal: proposalData,
      customer_response_records: duplicateCustomerResponseRecords,
      standard_process_definition: standardProcessDefinition,
      base_compliance_score: 0.85,
    });

    // 異常パターン検出により、重複する顧客対応記録が識別されることを確認
    expect(analysisResult.anomaly_detected).toBe(true);
    expect(analysisResult.duplicate_records).toBe(true);
    expect(analysisResult.duplicate_record_ids).toEqual(['REC-100', 'REC-101']);
    expect(analysisResult.duplicate_count).toBe(2);

    // 標準プロセス比較スコアが重複の影響を受けて0.15ポイント減点されることを確認
    expect(analysisResult.standard_process_compliance_score).toBe(0.70);
    expect(analysisResult.impact_score_reduction).toBe(0.15);

    // 外部検証サービスへのリクエストが送信されたことを確認
    expect(fetchMock.mock.calls.length).toBe(1);
    expect(fetchMock.mock.calls[0][0]).toContain('/duplicate-check');
  });
});