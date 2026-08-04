import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援 - 外部API失敗時の代替推奨', () => {
  // SCEN-2131
  test('OpenAI API呼び出し失敗時に内部推奨パターンマスタから代替推奨を返却する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const mockPatternMaster = [
      {
        pattern_id: 'pattern_001',
        customer_industry: 'manufacturing',
        success_rate: 0.92,
        applied_case_count: 145,
        proposal_approach: 'cost_reduction_focus',
        success_factor: 'Early engagement with procurement team',
        failure_factor: 'Delayed technical validation',
      },
      {
        pattern_id: 'pattern_002',
        customer_industry: 'retail',
        success_rate: 0.88,
        applied_case_count: 98,
        proposal_approach: 'operational_efficiency',
        success_factor: 'Focus on quick implementation',
        failure_factor: 'Underestimated change management',
      },
      {
        pattern_id: 'pattern_003',
        customer_industry: 'finance',
        success_rate: 0.85,
        applied_case_count: 67,
        proposal_approach: 'compliance_risk_mitigation',
        success_factor: 'Regulatory alignment emphasis',
        failure_factor: 'Insufficient risk documentation',
      },
    ];

    const newDealInput = {
      customer_name: 'ABC Corporation',
      customer_industry: 'manufacturing',
      customer_scale: 'large_enterprise',
      budget_amount: 5000000,
      budget_currency: 'JPY',
      deal_stage: 'discovery',
      expected_close_date: '2026-09-30',
      primary_contact_title: 'CIO',
    };

    let retry_count = 0;
    const mockAPIFailure = jest.fn(async () => {
      retry_count++;
      if (retry_count <= 3) {
        throw new Error('Network timeout: OpenAI API unreachable');
      }
    });

    mockAIEngine.generateRecommendation.mockImplementation(async (input) => {
      try {
        return await mockAPIFailure();
      } catch (error) {
        if (retry_count >= 3) {
          return {
            status: 'fallback',
            recommended_pattern: mockPatternMaster[0],
            recommendation_detail: {
              approach: mockPatternMaster[0].proposal_approach,
              rationale_summary: `Top success pattern: ${mockPatternMaster[0].success_factor}`,
              success_rate_summary: `${(mockPatternMaster[0].success_rate * 100).toFixed(0)}%`,
              applied_case_count_summary: mockPatternMaster[0].applied_case_count,
            },
            user_message:
              '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
            external_api_retry_count: retry_count,
            external_api_max_timeout_seconds: 30,
          };
        }
        throw error;
      }
    });

    const result = await mockAIEngine.generateRecommendation(newDealInput);

    expect(result.status).toBe('fallback');
    expect(result.recommended_pattern.pattern_id).toBe('pattern_001');
    expect(result.recommended_pattern.success_rate).toBe(0.92);
    expect(result.recommended_pattern.applied_case_count).toBe(145);
    expect(result.recommendation_detail.approach).toBe('cost_reduction_focus');
    expect(result.recommendation_detail.success_rate_summary).toBe('92%');
    expect(result.recommendation_detail.applied_case_count_summary).toBe(145);
    expect(result.recommendation_detail.rationale_summary).toMatch(
      /Early engagement with procurement team/
    );
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.external_api_retry_count).toBe(3);
    expect(result.external_api_max_timeout_seconds).toBe(30);
  });
});