import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案妥当性判定', () => {
  test('SCEN-1246: 営業プロセス遵守度が閾値直上（80.1%）のときに承認判定される', async () => {
    // テスト案件データの準備
    const testProposal = {
      proposalId: 'PROP-20240115-001',
      customerId: 'CUST-001',
      processAdherenceRate: 80.1, // 営業プロセス遵守度: 閾値80.0%の直上
      customerNeedsAlignmentScore: 85,
      proposalContent: {
        approachStrategy: 'Premium Product Bundle',
        targetRevenue: 1500000,
        implementationTimeline: '2024-02-01',
      },
      riskFactors: [],
    };

    // AIRecommendationEngineのスタブ: evaluatePatternRelevanceで0.75以上を返す
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.78,
        applicablePatterns: [
          {
            patternId: 'PAT-SUCCESS-001',
            matchDegree: 0.78,
            successRate: 0.82,
          },
        ],
      }),
    };

    // FileStorageAdapterのスタブ: uploadRecommendationReportが正常終了を返す
    const mockFileStorage = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({
          reportUrl: 'https://s3.example.com/reports/PROP-20240115-001.pdf',
          uploadTimestamp: '2024-01-15T11:30:00Z',
          expirationDate: '2024-01-22T11:30:00Z',
        }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 提案妥当性判定機能を実行
    const result = await evaluateProposalFeasibility(
      testProposal,
      mockAIEngine,
      mockFileStorage
    );

    // 戻り値の検証
    expect(result.approvalFlag).toBe(true);
    expect(result.judgmentReason).toContain('営業プロセス遵守度80.1%');
    expect(result.judgmentReason).toContain('許容基準80.0%');

    // AIRecommendationEngineのevaluatePatternRelevanceが1回呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith({
      proposalContent: testProposal.proposalContent,
      customerId: testProposal.customerId,
    });

    // FileStorageAdapterのuploadRecommendationReportが1回呼び出されたことを検証
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledWith({
      proposalId: testProposal.proposalId,
      judgmentResult: result,
      format: 'pdf',
    });

    // 判定根拠オブジェクトの詳細検証
    expect(result.judgmentDetail).toEqual({
      processAdherenceCheckResult: {
        actualRate: 80.1,
        thresholdRate: 80.0,
        isMet: true,
      },
      patternRelevanceCheckResult: {
        relevanceScore: 0.78,
        isAboveThreshold: true,
      },
      overallApprovalReason:
        '営業プロセス遵守度80.1%は許容基準80.0%以上を満たし、成功パターン適用可能スコア0.78は基準値0.75以上を満たすため、提案を承認します。',
    });
  });
});