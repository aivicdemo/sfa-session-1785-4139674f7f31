import { calculateDivergenceScore, judgeImprovementPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-268
  test('[normal] 行動パターン分析と改善指導優先順位判定機能 - 成約実績が複数件の営業担当者について、商談進捗と提案内容の乖離度から改善指導内容が判定される', () => {
    // Arrange: 営業担当者Aの3件の商談データを設定
    const salesPersonId = 'sales-person-A';
    const deals = [
      {
        dealId: 'deal-1',
        progressRate: 80,
        proposedContent: 'low_price_plan',
        customerPurchaseStage: 'initial_contact',
      },
      {
        dealId: 'deal-2',
        progressRate: 30,
        proposedContent: 'high_feature_plan',
        customerPurchaseStage: 'initial_contact',
      },
      {
        dealId: 'deal-3',
        progressRate: 60,
        proposedContent: 'standard_plan',
        customerPurchaseStage: 'comparison_review',
      },
    ];

    // 顧客の購買段階と提案内容のマッピング定義（スタブ）
    const stageProposalMapping = {
      initial_contact: ['low_price_plan', 'standard_plan'],
      comparison_review: ['standard_plan', 'high_feature_plan'],
      purchase_decision: ['high_feature_plan'],
    };

    // Act: 各商談について乖離度を算出
    const divergenceScores = deals.map((deal) => ({
      dealId: deal.dealId,
      divergenceScore: calculateDivergenceScore(
        deal.customerPurchaseStage,
        deal.proposedContent,
        stageProposalMapping
      ),
      progressRate: deal.progressRate,
      proposedContent: deal.proposedContent,
      customerPurchaseStage: deal.customerPurchaseStage,
    }));

    // Act: 改善指導優先順位を判定
    const improvementResult = judgeImprovementPriority(
      salesPersonId,
      divergenceScores
    );

    // Assert: 期待結果の検証
    // deal-2が最優先の改善指導対象として判定されることを確認
    expect(improvementResult.priorityRanking[0].dealId).toBe('deal-2');
    expect(improvementResult.priorityRanking[0].divergenceScore).toBe(1.0);
    expect(improvementResult.priorityRanking[0].priority).toBe('high');

    // deal-2に対する改善指導内容が正しく生成されていることを確認
    expect(improvementResult.improvementGuidance).toContain('初期接触段階');
    expect(improvementResult.improvementGuidance).toContain('低価格プラン');
    expect(improvementResult.improvementGuidance).toContain('参入障壁');

    // 乖離度スコアの検証（deal-2の乖離度が最大）
    const deal2Score = divergenceScores.find((d) => d.dealId === 'deal-2');
    const deal1Score = divergenceScores.find((d) => d.dealId === 'deal-1');
    const deal3Score = divergenceScores.find((d) => d.dealId === 'deal-3');

    expect(deal2Score?.divergenceScore).toBeGreaterThan(
      deal1Score?.divergenceScore || 0
    );
    expect(deal2Score?.divergenceScore).toBeGreaterThan(
      deal3Score?.divergenceScore || 0
    );

    // 改善優先順位ランキングの全件検証
    expect(improvementResult.priorityRanking).toHaveLength(3);
    expect(improvementResult.priorityRanking[1].dealId).toBe('deal-3');
    expect(improvementResult.priorityRanking[2].dealId).toBe('deal-1');

    // salesPersonIdが正しく保持されていることを確認
    expect(improvementResult.salesPersonId).toBe('sales-person-A');
  });
});