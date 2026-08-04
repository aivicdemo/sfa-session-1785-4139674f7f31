import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1156
  test('[edge] 過去商談データフィルタリング機能 - 成功フラグが立っていない商談データが検索対象に含まれるとき、フィルタリングで除外する', async () => {
    // テスト用の過去商談データセットを準備
    const past_deals = [
      {
        deal_id: 'DEAL001',
        industry: '製造業',
        budget_amount: 10000000,
        success_flag: true,
        proposal_approach: 'アプローチA',
      },
      {
        deal_id: 'DEAL002',
        industry: '製造業',
        budget_amount: 10000000,
        success_flag: true,
        proposal_approach: 'アプローチB',
      },
      {
        deal_id: 'DEAL003',
        industry: '製造業',
        budget_amount: 10000000,
        success_flag: true,
        proposal_approach: 'アプローチC',
      },
      {
        deal_id: 'DEAL004',
        industry: '製造業',
        budget_amount: 10000000,
        success_flag: false,
        proposal_approach: 'アプローチD',
      },
      {
        deal_id: 'DEAL005',
        industry: '製造業',
        budget_amount: 10000000,
        success_flag: false,
        proposal_approach: 'アプローチE',
      },
    ];

    // AIRecommendationEngine.findSimilarPatterns() をスタブ化
    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(past_deals),
    };

    // 新規案件の条件を入力パラメータとして設定
    const new_deal_conditions = {
      industry: '製造業',
      budget_amount: 10000000,
    };

    // フィルタリング処理を呼び出し
    const filtered_result = await findSimilarPatterns(
      new_deal_conditions,
      mock_ai_engine
    );

    // フィルタリング処理内部で、成功フラグ=false のデータが検索結果に含まれているかアサートで確認
    const unsuccessful_deals = past_deals.filter(
      (deal) => deal.success_flag === false
    );
    expect(unsuccessful_deals.length).toBe(2);

    // フィルタリング処理の出力結果に成功フラグ=true のデータのみ3件が含まれることを検証
    expect(filtered_result.length).toBe(3);

    // 出力結果に含まれる各データの成功フラグ値を検証
    filtered_result.forEach((deal) => {
      expect(deal.success_flag).toBe(true);
    });

    // 出力結果に含まれるデータIDを検証
    const filtered_deal_ids = filtered_result.map((deal) => deal.deal_id);
    expect(filtered_deal_ids).toEqual(['DEAL001', 'DEAL002', 'DEAL003']);

    // 成功フラグ=false のデータが完全に除外されていることを検証
    const excluded_deal_ids = filtered_deal_ids.filter((id) =>
      ['DEAL004', 'DEAL005'].includes(id)
    );
    expect(excluded_deal_ids.length).toBe(0);
  });
});