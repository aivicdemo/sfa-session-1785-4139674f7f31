import { validateProposal } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1247: リスク要因スコアがちょうど上限（5.0）のときに承認判定される', () => {
    // リスク要因スコアが5.0（上限値）である商談条件データを準備
    const dealConditionData = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      proposalApproach: 'digital_transformation',
      riskFactorScore: 5.0,
      customerBudget: 50000000,
      implementationTimeline: 180,
      competitorPresence: true,
      pastSuccessPatternMatch: 0.85
    };

    // AIRecommendationEngineのスタブを構成
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalContent: 'Recommended proposal for digital transformation',
        confidenceScore: 82,
        approachDetails: 'Phase-based implementation strategy'
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pastDealId: 'PAST-001',
          matchScore: 0.88,
          successOutcome: true
        }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: 'Risk factor score 5.0 is within acceptable threshold. Customer industry and scale align with success patterns.',
        rationale: 'Manufacturing large-scale customers with 5.0 risk score have demonstrated 85% success rate in similar proposals.'
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(5.0)
    };

    // FileStorageAdapterのスタブを構成
    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'reports/DEAL-001/proposal_validation_20240115.pdf',
        uploadStatus: 'success',
        uploadTimestamp: new Date('2024-01-15T11:00:00Z')
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://s3.example.com/reports/DEAL-001/proposal_validation_20240115.pdf?expires=20240115T12:00:00Z',
        expirationTime: 3600
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 0
      })
    };

    // validateProposalメソッドを呼び出し、リスク要因スコア5.0のデータを渡す
    const validationResult = validateProposal(
      dealConditionData,
      aiRecommendationEngineStub,
      fileStorageAdapterStub
    );

    // 判定結果のステータス、承認フラグ、判定根拠を検証
    expect(validationResult).toEqual({
      dealId: 'DEAL-001',
      approvalStatus: 'approved',
      isApproved: true,
      riskFactorScore: 5.0,
      riskEvaluation: 'acceptable',
      confidenceScore: 82,
      validationJustification: {
        riskFactorReasoning: 'Risk factor score 5.0 is within acceptable threshold. Customer industry and scale align with success patterns.',
        thresholdComparison: 'Score 5.0 equals maximum acceptable limit (5.0)',
        similarPatternMatches: [
          {
            pastDealId: 'PAST-001',
            matchScore: 0.88,
            successOutcome: true
          }
        ]
      },
      recommendationReady: true,
      fileUploadExecuted: false,
      displayableForSalesTeam: true,
      validationTimestamp: new Date('2024-01-15T11:00:00Z')
    });

    // S3ファイルストレージへのアップロードが実行されないことを確認
    expect(fileStorageAdapterStub.uploadRecommendationReport).not.toHaveBeenCalled();

    // AIRecommendationEngineのメソッド呼び出しを検証
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith({
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      proposalApproach: 'digital_transformation',
      riskFactorScore: 5.0,
      customerBudget: 50000000,
      implementationTimeline: 180,
      competitorPresence: true,
      pastSuccessPatternMatch: 0.85
    });

    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalled();

    // 推奨内容が営業画面で表示可能な状態になることを確認
    expect(validationResult.displayableForSalesTeam).toBe(true);
    expect(validationResult.recommendationReady).toBe(true);
  });
});