import { evaluateRecommendationFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1632: 推奨妥当性スコア算出 - スコアが1～99の中間値の場合、承認判断対象として正しく記録される', async () => {
    // Setup: AIRecommendationEngineをスタブ化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 50,
        relevanceDetails: {
          customerMatch: 0.5,
          productFit: 0.5,
          timingAlignment: 0.5
        }
      })
    };

    // Setup: 営業案件データの準備
    const salesProposalInput = {
      customerId: 'CUST-20260105-001',
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      implementationTimeline: '3ヶ月以内',
      proposalPatterns: [
        {
          patternId: 'PATTERN-MFG-500M',
          industry: '製造業',
          budgetRange: { min: 3000000, max: 10000000 },
          timelineRange: { min: 60, max: 120 }
        }
      ]
    };

    // Setup: データベース模擬レポジトリ
    const mockDatabase = {
      recommendationFeasibilityRecords: [] as Array<{
        id: string;
        customerId: string;
        feasibilityScore: number;
        approvalStatus: string;
        approvalRequired: boolean;
        createdAt: string;
      }>
    };

    // Execute: 推奨妥当性スコア算出機能を実行
    const result = await evaluateRecommendationFeasibility(
      salesProposalInput,
      mockAIEngine,
      mockDatabase
    );

    // Assertion: スコア値が50であること
    expect(result.feasibilityScore).toBe(50);

    // Assertion: 承認判断ステータスが『営業管理職承認待ち』であること
    expect(result.approvalStatus).toBe('営業管理職承認待ち');

    // Assertion: 承認対象フラグがtrueであること
    expect(result.approvalRequired).toBe(true);

    // Assertion: データベースに新規レコードが1件作成されていること
    expect(mockDatabase.recommendationFeasibilityRecords).toHaveLength(1);

    // Assertion: 作成されたレコードの内容を検証
    const createdRecord = mockDatabase.recommendationFeasibilityRecords[0];
    expect(createdRecord.customerId).toBe('CUST-20260105-001');
    expect(createdRecord.feasibilityScore).toBe(50);
    expect(createdRecord.approvalStatus).toBe('営業管理職承認待ち');
    expect(createdRecord.approvalRequired).toBe(true);
    expect(createdRecord.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

    // Assertion: AIエンジンが正しく呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      salesProposalInput,
      salesProposalInput.proposalPatterns
    );
  });
});