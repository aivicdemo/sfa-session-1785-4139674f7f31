import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2546
  test('同じ入力で2回実行したとき、同じテンプレートが生成される', () => {
    const customer_info = {
      industry: 'IT',
      company_size: 'medium',
      region: 'Tokyo'
    };

    const transaction_conditions = {
      budget_amount: 5000000,
      implementation_period_days: 90,
      decision_timeline: '3months'
    };

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockReturnValue({
        template_id: 'TPL-2024-001',
        proposal_approach: 'クラウド基盤の構築と段階的な既存システム統合により、導入リスクを最小化します。',
        confidence_score: 87,
        applicability_conditions: [
          'IT業界',
          '従業員数100～1000名',
          '予算500万円以上',
          '導入期間3ヶ月以内'
        ],
        success_factors: [
          'CTO在籍企業',
          '既存クラウド利用経験',
          'アジャイル開発文化'
        ]
      })
    };

    const first_result = extractSuccessPatterns(
      customer_info,
      transaction_conditions,
      mock_ai_engine
    );

    const second_result = extractSuccessPatterns(
      customer_info,
      transaction_conditions,
      mock_ai_engine
    );

    expect(first_result).toEqual(second_result);
    expect(first_result.template_id).toBe('TPL-2024-001');
    expect(first_result.proposal_approach).toBe(
      'クラウド基盤の構築と段階的な既存システム統合により、導入リスクを最小化します。'
    );
    expect(first_result.confidence_score).toBe(87);
    expect(first_result.applicability_conditions).toEqual([
      'IT業界',
      '従業員数100～1000名',
      '予算500万円以上',
      '導入期間3ヶ月以内'
    ]);
    expect(JSON.stringify(first_result)).toBe(JSON.stringify(second_result));
  });
});