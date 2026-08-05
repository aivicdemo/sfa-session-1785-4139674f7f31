import { analyzeSuccessPatternAndExtractImprovementRecommendations } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-535: [normal] チーム全体の改善課題の数値化と提示機能 - 成功パターン分析から共通の改善推奨項目が数値化されて抽出される
  test('成功案件の共通プロセスステップを分析し、実施率が高い順にソートされた改善推奨項目を抽出する', () => {
    const successful_deal_1 = {
      deal_id: 'DEAL-001',
      status: 'won',
      process_steps: [
        { step_name: '初回接触', completed: true },
        { step_name: '顧客ニーズ確認', completed: true },
        { step_name: '提案作成', completed: true },
        { step_name: '折衝段階での顧客ニーズ確認', completed: true },
        { step_name: '契約手続き', completed: true },
      ],
    };

    const successful_deal_2 = {
      deal_id: 'DEAL-002',
      status: 'won',
      process_steps: [
        { step_name: '初回接触', completed: true },
        { step_name: '顧客ニーズ確認', completed: true },
        { step_name: '提案作成', completed: true },
        { step_name: '折衝段階での顧客ニーズ確認', completed: true },
        { step_name: 'ROI分析', completed: true },
      ],
    };

    const successful_deal_3 = {
      deal_id: 'DEAL-003',
      status: 'won',
      process_steps: [
        { step_name: '初回接触', completed: true },
        { step_name: '顧客ニーズ確認', completed: true },
        { step_name: '提案作成', completed: true },
        { step_name: '折衝段階での顧客ニーズ確認', completed: true },
        { step_name: 'フォローアップ', completed: true },
      ],
    };

    const input = {
      successful_deals: [successful_deal_1, successful_deal_2, successful_deal_3],
    };

    const result = analyzeSuccessPatternAndExtractImprovementRecommendations(input);

    expect(result.improvement_recommendations.length).toBeGreaterThanOrEqual(3);

    const has_initial_contact = result.improvement_recommendations.some(
      (rec) => rec.step_name === '初回接触'
    );
    expect(has_initial_contact).toBe(true);

    const has_customer_needs_confirmation = result.improvement_recommendations.some(
      (rec) => rec.step_name === '顧客ニーズ確認'
    );
    expect(has_customer_needs_confirmation).toBe(true);

    const has_proposal_negotiation_needs = result.improvement_recommendations.some(
      (rec) => rec.step_name === '折衝段階での顧客ニーズ確認'
    );
    expect(has_proposal_negotiation_needs).toBe(true);

    const recommendation_with_100_percent = result.improvement_recommendations.find(
      (rec) => rec.execution_rate === 100
    );
    expect(recommendation_with_100_percent).toBeDefined();

    const recommendation_with_90_percent = result.improvement_recommendations.find(
      (rec) => rec.execution_rate === 90
    );
    expect(recommendation_with_90_percent).toBeDefined();

    const recommendation_with_66_percent = result.improvement_recommendations.find(
      (rec) => rec.execution_rate === 67 || rec.execution_rate === 66
    );
    expect(recommendation_with_66_percent).toBeDefined();

    for (let i = 0; i < result.improvement_recommendations.length - 1; i++) {
      expect(
        result.improvement_recommendations[i].execution_rate >=
          result.improvement_recommendations[i + 1].execution_rate
      ).toBe(true);
    }

    const folding_stage_confirmation = result.improvement_recommendations.find(
      (rec) => rec.step_name === '折衝段階での顧客ニーズ確認'
    );
    expect(folding_stage_confirmation?.execution_rate).toBe(100);

    const initial_contact_rec = result.improvement_recommendations.find(
      (rec) => rec.step_name === '初回接触'
    );
    expect(initial_contact_rec?.execution_rate).toBe(100);

    const customer_needs_rec = result.improvement_recommendations.find(
      (rec) => rec.step_name === '顧客ニーズ確認'
    );
    expect(customer_needs_rec?.execution_rate).toBe(100);

    const proposal_rec = result.improvement_recommendations.find(
      (rec) => rec.step_name === '提案作成'
    );
    expect(proposal_rec?.execution_rate).toBe(100);

    expect(result.improvement_recommendations[0].execution_rate).toBeGreaterThanOrEqual(
      result.improvement_recommendations[result.improvement_recommendations.length - 1]
        .execution_rate
    );

    expect(result.total_successful_deals_analyzed).toBe(3);
  });
});