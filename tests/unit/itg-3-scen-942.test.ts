import { generateRecommendationAndTrack } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 提案アプローチの推奨戦略記録と実行追跡', () => {
  test('SCEN-942: 新規案件から推奨生成まで、提案アプローチテーブルに戦略が記録され実行追跡が可能になる', async () => {
    // テストデータ準備: 顧客情報
    const newProjectData = {
      customerId: 'CUST-A001',
      customerName: 'A社',
      industry: '製造業',
      budgetAmount: 5000000,
      challengeDescription: '生産効率化'
    };

    // AIRecommendationEngine のスタブを定義
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalStrategy: 'リーン生産方式導入支援',
        confidenceScore: 0.92,
        reasoningBasis: '過去3件の同業種案件で成功'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // モック DB アクセサ（提案アプローチテーブル用）
    const mockDatabaseAccessor = {
      insertProposalApproach: jest.fn().mockResolvedValue({
        projectId: 'PROJ-001',
        proposalStrategy: 'リーン生産方式導入支援',
        confidenceScore: 0.92,
        reasoningBasis: '過去3件の同業種案件で成功',
        recordedAt: new Date('2024-01-15T11:00:00Z'),
        status: '推奨生成済み'
      }),
      getProposalApproachByProjectId: jest.fn().mockResolvedValue({
        projectId: 'PROJ-001',
        proposalStrategy: 'リーン生産方式導入支援',
        confidenceScore: 0.92,
        reasoningBasis: '過去3件の同業種案件で成功',
        recordedAt: new Date('2024-01-15T11:00:00Z'),
        status: '推奨生成済み'
      })
    };

    // 推奨生成API実行
    const recommendationResult = await generateRecommendationAndTrack(
      newProjectData,
      mockAIRecommendationEngine,
      mockDatabaseAccessor
    );

    // AIRecommendationEngine の generateRecommendation が呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-A001',
        customerName: 'A社',
        industry: '製造業',
        budgetAmount: 5000000,
        challengeDescription: '生産効率化'
      })
    );

    // 返却された推奨戦略情報を検証
    expect(recommendationResult).toEqual(
      expect.objectContaining({
        projectId: expect.any(String),
        proposalStrategy: 'リーン生産方式導入支援',
        confidenceScore: 0.92,
        reasoningBasis: '過去3件の同業種案件で成功',
        status: '推奨生成済み'
      })
    );

    // DB への insertProposalApproach が呼び出されたことを確認
    expect(mockDatabaseAccessor.insertProposalApproach).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalStrategy: 'リーン生産方式導入支援',
        confidenceScore: 0.92,
        reasoningBasis: '過去3件の同業種案件で成功',
        status: '推奨生成済み'
      })
    );

    // 信頼度スコアが 0.92 であることを確認
    expect(recommendationResult.confidenceScore).toBe(0.92);

    // 提案アプローチテーブルから実行状況追跡で同一レコードが取得可能なことを確認
    const trackingResult = await generateRecommendationAndTrack(
      newProjectData,
      mockAIRecommendationEngine,
      mockDatabaseAccessor,
      true // 実行状況追跡モード
    );

    // getProposalApproachByProjectId が呼び出されたことを確認
    expect(mockDatabaseAccessor.getProposalApproachByProjectId).toHaveBeenCalled();

    // 取得したレコードの内容が完全に一致していることを確認
    expect(trackingResult).toEqual(
      expect.objectContaining({
        projectId: 'PROJ-001',
        proposalStrategy: 'リーン生産方式導入支援',
        confidenceScore: 0.92,
        reasoningBasis: '過去3件の同業種案件で成功',
        recordedAt: new Date('2024-01-15T11:00:00Z'),
        status: '推奨生成済み'
      })
    );

    // 初期ステータスが『推奨生成済み』で設定されていることを確認
    expect(trackingResult.status).toBe('推奨生成済み');
  });
});