import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2622
  test('[normal] 推奨内容の根拠表示機能 - 推奨提案アプローチの根拠表示が営業管理職と営業担当者の合意に基づく成功パターンテンプレートと整合している', () => {
    // 成功パターンテンプレート（営業管理職が事前承認）
    const approvedTemplate_1 = {
      templateId: 'TPL-001',
      industry: '金融',
      proposalApproach: '提案アプローチA',
      successRate: 78,
      applicableConditions: '予算規模：5000万以上、規模：中堅企業',
      createdBy: 'manager001',
      approvedAt: '2024-01-10T09:00:00Z'
    };

    const approvedTemplate_2 = {
      templateId: 'TPL-002',
      industry: '製造',
      proposalApproach: '提案アプローチB',
      successRate: 82,
      applicableConditions: '予算規模：3000万以上、規模：大企業',
      createdBy: 'manager001',
      approvedAt: '2024-01-12T09:00:00Z'
    };

    const approvedTemplate_3 = {
      templateId: 'TPL-003',
      industry: '金融',
      proposalApproach: '提案アプローチC',
      successRate: 75,
      applicableConditions: '予算規模：1000万以上、規模：小規模企業',
      createdBy: 'manager001',
      approvedAt: '2024-01-14T09:00:00Z'
    };

    // 新規案件情報
    const newDealInput = {
      dealId: 'DEAL-NEW-2024-001',
      customerName: '顧客XYZ',
      industry: '金融',
      budgetRange: '5500万',
      businessChallenge: 'デジタル化推進',
      salesperson_id: 'sales001'
    };

    // 過去成功パターン（AIRecommendationEngineが返却）
    const similarPatterns = [
      {
        pastDealId: 'PAST-DEAL-2023-001',
        industry: '金融',
        budgetScale: '5000万',
        proposalApproach: '提案アプローチA',
        succeeded: true,
        similarityScore: 0.87,
        templateId: 'TPL-001'
      },
      {
        pastDealId: 'PAST-DEAL-2023-005',
        industry: '金融',
        budgetScale: '5200万',
        proposalApproach: '提案アプローチA',
        succeeded: true,
        similarityScore: 0.85,
        templateId: 'TPL-001'
      },
      {
        pastDealId: 'PAST-DEAL-2023-010',
        industry: '金融',
        budgetScale: '4800万',
        proposalApproach: '提案アプローチC',
        succeeded: false,
        similarityScore: 0.81,
        templateId: 'TPL-003'
      }
    ];

    // 推奨内容の根拠説明（AIRecommendationEngineが返却）
    const recommendationReasoning = '過去案件TPL-001（業界：金融、提案アプローチ：提案アプローチA、成約率：78%）に基づく。貴社の予算規模（5500万）と業界（金融）が過去の成功事例と合致しており、同様の提案アプローチAを採用することで高確率での成約が見込めます。';

    // AIRecommendationEngineスタブ
    const aiEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(similarPatterns),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(recommendationReasoning)
    };

    // テンプレートマスタ検索スタブ
    const templateMaster = {
      getById: jest.fn((id: string) => {
        if (id === 'TPL-001') return approvedTemplate_1;
        if (id === 'TPL-002') return approvedTemplate_2;
        if (id === 'TPL-003') return approvedTemplate_3;
        return null;
      })
    };

    // 推奨根拠ログ記録スタブ
    const recommendationReasoningLog = {
      records: [] as any[]
    };

    const logRecommendationReasoning = jest.fn((entry: any) => {
      recommendationReasoningLog.records.push(entry);
      return entry;
    });

    // 関数呼び出し
    const result = displayRecommendationReasoning(
      newDealInput,
      aiEngine,
      templateMaster,
      logRecommendationReasoning
    );

    // 期待値：推奨内容の根拠表示が、管理職承認済みテンプレートと完全に整合しているか
    expect(result.recommendedApproach).toBe('提案アプローチA');
    expect(result.recommendationReasoning).toBe(
      '過去案件TPL-001（業界：金融、提案アプローチ：提案アプローチA、成約率：78%）に基づく。貴社の予算規模（5500万）と業界（金融）が過去の成功事例と合致しており、同様の提案アプローチAを採用することで高確率での成約が見込めます。'
    );

    // 根拠に紐付くテンプレート情報が完全一致しているか
    expect(result.templateId).toBe('TPL-001');
    expect(result.templateIndustry).toBe('金融');
    expect(result.templateApproach).toBe('提案アプローチA');
    expect(result.templateSuccessRate).toBe(78);
    expect(result.templateApplicableConditions).toBe('予算規模：5000万以上、規模：中堅企業');

    // 類似度スコア0.85以上の過去パターンが含まれているか
    expect(result.similarPatterns).toHaveLength(3);
    expect(result.similarPatterns[0].similarityScore).toBeGreaterThanOrEqual(0.85);
    expect(result.similarPatterns[1].similarityScore).toBeGreaterThanOrEqual(0.85);

    // 営業担当者が根拠に合意した場合の記録
    const agreementTimestamp = '2024-01-15T11:30:00Z';
    const agreementEntry = {
      dealId: newDealInput.dealId,
      salesperson_id: newDealInput.salesperson_id,
      templateId: 'TPL-001',
      recommendationReasoning: result.recommendationReasoning,
      agreedAt: agreementTimestamp,
      agreedBy: newDealInput.salesperson_id
    };

    logRecommendationReasoning(agreementEntry);

    // 営業管理職が管理画面から推奨根拠ログを確認
    expect(recommendationReasoningLog.records).toHaveLength(1);
    const savedLog = recommendationReasoningLog.records[0];

    // 保存された根拠ログが、テンプレートと完全に整合しているか
    expect(savedLog.dealId).toBe('DEAL-NEW-2024-001');
    expect(savedLog.templateId).toBe('TPL-001');
    expect(savedLog.recommendationReasoning).toContain('過去案件TPL-001');
    expect(savedLog.recommendationReasoning).toContain('業界：金融');
    expect(savedLog.recommendationReasoning).toContain('提案アプローチ：提案アプローチA');
    expect(savedLog.recommendationReasoning).toContain('成約率：78%');
    expect(savedLog.agreedAt).toBe('2024-01-15T11:30:00Z');
    expect(savedLog.agreedBy).toBe('sales001');

    // AIRecommendationEngineが正しく呼び出されたか
    expect(aiEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: '金融',
        budgetRange: '5500万',
        businessChallenge: 'デジタル化推進'
      })
    );
    expect(aiEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        newDealInput: newDealInput,
        similarPatterns: expect.any(Array)
      })
    );
  });
});