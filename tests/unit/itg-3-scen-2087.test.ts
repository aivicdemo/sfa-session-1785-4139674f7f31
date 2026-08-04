import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AIエージェントの推奨根拠の可視化機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-2087
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 推奨根拠テーブルに記録された過去の推奨根拠が分析結果に反映される', async () => {
    const past_recommendation_basis_history = [
      {
        id: '1',
        customer_industry: 'SaaS',
        business_stage: '初期ヒアリング',
        proposal_approach: 'ROI重視',
        contract_result: 1,
        success_rate: 65,
        reasoning_basis: '同業種SaaS企業の初期ヒアリング段階では、ROI重視のアプローチにより65%の成約率を達成しており、本案件にも同様のアプローチを推奨します',
        created_at: new Date('2024-01-01T10:00:00Z'),
      },
      {
        id: '2',
        customer_industry: 'SaaS',
        business_stage: '初期ヒアリング',
        proposal_approach: 'デジタル変革',
        contract_result: 1,
        success_rate: 58,
        reasoning_basis: 'SaaS企業向けのデジタル変革提案は初期段階で58%の成功率を示しており、顧客のニーズ要件との親和性が高いパターンです',
        created_at: new Date('2024-01-05T14:30:00Z'),
      },
      {
        id: '3',
        customer_industry: 'Manufacturing',
        business_stage: '初期ヒアリング',
        proposal_approach: 'ROI重視',
        contract_result: 1,
        success_rate: 42,
        reasoning_basis: '製造業向けのROI重視提案は初期段階で42%の成功率であり、本案件の業種と異なるため参考値として扱います',
        created_at: new Date('2024-01-10T09:15:00Z'),
      },
    ];

    const ai_engine_stub = {
      generateRecommendation: async (input: {
        customer_industry: string;
        business_stage: string;
        customer_size: string;
        historical_basis_records: Array<{
          id: string;
          customer_industry: string;
          business_stage: string;
          proposal_approach: string;
          success_rate: number;
          reasoning_basis: string;
        }>;
      }) => {
        const matching_cases = input.historical_basis_records.filter(
          (record) =>
            record.customer_industry === input.customer_industry &&
            record.business_stage === input.business_stage
        );

        const similar_past_cases = matching_cases.map((case_item) => ({
          id: case_item.id,
          customer_segment: case_item.customer_industry,
          success_rate: case_item.success_rate,
          proposal_approach: case_item.proposal_approach,
          business_stage: case_item.business_stage,
        }));

        const reasoning_basis_text =
          matching_cases.length > 0
            ? matching_cases
                .map((case_item) => case_item.reasoning_basis)
                .join(' ')
            : '';

        return {
          recommendation_id: 'rec-2087-001',
          customer_industry: input.customer_industry,
          customer_size: input.customer_size,
          recommended_approach: 'ROI重視のデジタル変革提案',
          similar_past_cases: similar_past_cases,
          reasoning_basis: reasoning_basis_text,
          sourced_from_history: matching_cases.length > 0,
          confidence_score: matching_cases.length > 0 ? 85 : 0,
          generated_at: new Date('2024-01-15T11:00:00Z'),
        };
      },
    };

    const new_project_input = {
      customer_industry: 'SaaS',
      business_stage: '初期ヒアリング',
      customer_size: '中堅企業',
      historical_basis_records: past_recommendation_basis_history.map((record) => ({
        id: record.id,
        customer_industry: record.customer_industry,
        business_stage: record.business_stage,
        proposal_approach: record.proposal_approach,
        success_rate: record.success_rate,
        reasoning_basis: record.reasoning_basis,
      })),
    };

    const analysis_result = await generateRecommendation(new_project_input, ai_engine_stub);

    expect(analysis_result.similar_past_cases).toBeDefined();
    expect(Array.isArray(analysis_result.similar_past_cases)).toBe(true);
    expect(analysis_result.similar_past_cases.length).toBeGreaterThanOrEqual(2);

    const matching_count = analysis_result.similar_past_cases.filter(
      (case_item: {
        customer_segment: string;
        business_stage: string;
        success_rate: number;
        proposal_approach: string;
      }) =>
        case_item.customer_segment === 'SaaS' &&
        case_item.business_stage === '初期ヒアリング'
    ).length;

    expect(matching_count).toBeGreaterThanOrEqual(2);

    const first_matching_case = analysis_result.similar_past_cases.find(
      (case_item: { customer_segment: string; business_stage: string }) =>
        case_item.customer_segment === 'SaaS' &&
        case_item.business_stage === '初期ヒアリング'
    );

    expect(first_matching_case).toBeDefined();
    expect(first_matching_case.success_rate).toBe(65);
    expect(first_matching_case.proposal_approach).toBe('ROI重視');

    const second_matching_case = analysis_result.similar_past_cases.find(
      (case_item: {
        customer_segment: string;
        business_stage: string;
        proposal_approach: string;
      }) =>
        case_item.customer_segment === 'SaaS' &&
        case_item.business_stage === '初期ヒアリング' &&
        case_item.proposal_approach === 'デジタル変革'
    );

    expect(second_matching_case).toBeDefined();
    expect(second_matching_case.success_rate).toBe(58);

    expect(analysis_result.reasoning_basis).toBeDefined();
    expect(typeof analysis_result.reasoning_basis).toBe('string');
    expect(analysis_result.reasoning_basis.length).toBeGreaterThan(0);
    expect(analysis_result.reasoning_basis).toContain('同業種SaaS企業の初期ヒアリング段階では');
    expect(analysis_result.reasoning_basis).toContain('65%');
    expect(analysis_result.reasoning_basis).toContain('ROI重視のアプローチ');

    expect(analysis_result.sourced_from_history).toBe(true);

    expect(analysis_result.recommendation_id).toBe('rec-2087-001');
    expect(analysis_result.customer_industry).toBe('SaaS');
    expect(analysis_result.customer_size).toBe('中堅企業');
  });
});