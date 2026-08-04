import { validateProposalAndCustomerConstraints } from '../../src/logic/it-1-br-3-2-1-1';

describe('提案内容と顧客制約条件の自動照合機能', () => {
  // SCEN-1363
  test('提案資料が削除済みのときに照合処理がエラーになる', () => {
    // 削除済み提案資料ID
    const deletedProposalId = 'PROP-00001';
    
    // 顧客制約条件データ
    const customerConstraints = {
      customerId: 'CUST-12345',
      budgetLimit: 5000000,
      implementationDeadline: '2024-12-31',
    };

    // AIRecommendationEngineのスタブ（呼び出されないことを検証するため）
    let aiEngineCallCount = 0;
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(() => {
        aiEngineCallCount += 1;
        return {
          recommendedApproach: 'test-approach',
          confidenceScore: 85,
        };
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // FileStorageAdapterのスタブ
    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 削除済み提案資料の状態を模擬
    const proposalRepository = {
      findById: jest.fn().mockReturnValue(null),
    };

    // 実行
    const result = validateProposalAndCustomerConstraints(
      {
        proposalId: deletedProposalId,
        customerConstraints: customerConstraints,
      },
      aiRecommendationEngineStub,
      fileStorageAdapterStub,
      proposalRepository
    );

    // 検証: エラーコード
    expect(result.errorCode).toBe('PROPOSAL_NOT_FOUND');

    // 検証: エラーメッセージ
    expect(result.errorMessage).toBe('指定された提案資料が見つかりません');

    // 検証: AIRecommendationEngineへの呼び出しが発生していないこと
    expect(aiEngineCallCount).toBe(0);
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();

    // 検証: レポートファイルメタデータテーブルに新規レコードが追加されていないこと
    expect(fileStorageAdapterStub.uploadRecommendationReport).not.toHaveBeenCalled();

    // 検証: エラーオブジェクトが返却されていること
    expect(result).toHaveProperty('errorCode');
    expect(result).toHaveProperty('errorMessage');
    expect(result.success).toBe(false);
  });
});