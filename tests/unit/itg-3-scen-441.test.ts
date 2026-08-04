import { evaluateOperationalTransactionQuality } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業トランザクションデータの品質評価', () => {
  test('SCEN-441: 営業トランザクションのエラー件数が0件の場合、該当カテゴリのスコアが満点で算出される', () => {
    // Arrange: モック化された外部API呼び出し
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 営業トランザクションデータセット: エラー0件の正常データ5件
    const operationalTransactionData = [
      {
        transactionId: 'TXN-001',
        category: 'proposal_followup',
        dealId: 'DEAL-001',
        customerId: 'CUST-001',
        proposalDate: '2024-01-15',
        followupStatus: 'completed',
        errors: [],
      },
      {
        transactionId: 'TXN-002',
        category: 'proposal_followup',
        dealId: 'DEAL-002',
        customerId: 'CUST-002',
        proposalDate: '2024-01-16',
        followupStatus: 'completed',
        errors: [],
      },
      {
        transactionId: 'TXN-003',
        category: 'proposal_followup',
        dealId: 'DEAL-003',
        customerId: 'CUST-003',
        proposalDate: '2024-01-17',
        followupStatus: 'completed',
        errors: [],
      },
      {
        transactionId: 'TXN-004',
        category: 'proposal_followup',
        dealId: 'DEAL-004',
        customerId: 'CUST-004',
        proposalDate: '2024-01-18',
        followupStatus: 'completed',
        errors: [],
      },
      {
        transactionId: 'TXN-005',
        category: 'proposal_followup',
        dealId: 'DEAL-005',
        customerId: 'CUST-005',
        proposalDate: '2024-01-19',
        followupStatus: 'completed',
        errors: [],
      },
    ];

    const evaluationCategory = 'proposal_followup';

    // Act: 品質評価機能を実行
    const evaluationResult = evaluateOperationalTransactionQuality(
      operationalTransactionData,
      evaluationCategory,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: 該当カテゴリのスコアが満点で算出されることを検証
    expect(evaluationResult.categoryScore).toBe(100);
    expect(typeof evaluationResult.categoryScore).toBe('number');
    expect(evaluationResult.transactionCount).toBe(5);
    expect(evaluationResult.errorCount).toBe(0);
    expect(evaluationResult.evaluationStatus).toBe('completed');
  });
});