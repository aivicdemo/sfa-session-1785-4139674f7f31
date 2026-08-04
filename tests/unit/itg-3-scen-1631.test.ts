import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠可視化機能 - 推奨妥当性スコア算出', () => {
  // SCEN-1631
  test('スコアが100の場合、営業管理職の承認判断対象として正しく記録される', () => {
    // テスト対象: 推奨妥当性スコア算出機能
    const customerIndustry = '金融';
    const budgetRange = '5000万円以上';
    const dealStage = '提案段階';
    const dealId = 'DEAL-20240115-001';
    const customerId = 'CUST-20240115-001';
    const recommendationId = 'REC-20240115-001';
    const executedAt = new Date('2024-01-15T11:00:00Z').toISOString();

    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 100,
        matchedPatterns: [
          {
            patternId: 'PAT-001',
            patternName: '大規模金融案件向け提案パターン',
            confidence: 1.0,
          },
        ],
        reasoning: '顧客業種・予算規模・商談ステージすべてが高確度パターンと完全合致',
      }),
    };

    // 入力データ: 新規案件の顧客・商談条件
    const recommendationInput = {
      dealId,
      customerId,
      customerIndustry,
      budgetRange,
      dealStage,
      recommendationId,
      executedAt,
    };

    // 推奨妥当性スコア算出機能を実行
    const result = evaluateRecommendationRelevance(
      recommendationInput,
      aiEngineStub
    );

    // 計算結果のスコア値が100であることを確認
    expect(result.relevanceScore).toBe(100);

    // 承認判断対象フラグがtrueに設定されていることを確認
    expect(result.approvalRequiredFlag).toBe(true);

    // 承認判断対象者区分が『営業管理職』に正しく記録されていることを確認
    expect(result.approvalTargetRole).toBe('営業管理職');

    // 変更がタイムスタンプ付きで記録されていることを確認
    expect(result.auditLog).toBeDefined();
    expect(result.auditLog.length).toBeGreaterThan(0);

    const relevantAuditLog = result.auditLog.find(
      (log: { eventType: string; recommendationId: string }) =>
        log.eventType === 'approval_target_set' &&
        log.recommendationId === recommendationId
    );
    expect(relevantAuditLog).toBeDefined();
    expect(relevantAuditLog.timestamp).toBe(executedAt);
    expect(relevantAuditLog.scoredValue).toBe(100);
    expect(relevantAuditLog.targetRole).toBe('営業管理職');

    // AIエージェントが正しく呼び出されたことを確認
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId,
        customerId,
        customerIndustry,
        budgetRange,
        dealStage,
      })
    );
  });
});