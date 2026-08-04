import { generateExecutivePersuasionDocument } from '../../src/logic/it-1-br-3-2-1-1';

describe('経営層向け説得資料の自動生成機能 - リスク要因重複排除', () => {
  test('SCEN-2035: 重複を含むリスク要因リストが重複排除されて資料に記載される', () => {
    // 準備: テストデータとスタブの定義
    const duplicateRiskFactors = [
      'コスト増加リスク',
      'コスト増加リスク',
      '導入期間の遅延',
      '導入期間の遅延',
      '導入期間の遅延',
    ];

    const proposalId = 'PROP-001';
    const customerId = 'CUST-001';
    const proposalContent = {
      title: 'クラウド導入提案',
      description: 'エンタープライズ向けクラウドシステム導入',
      investmentAmount: 5000000,
      expectedROI: 30,
    };

    const customerConstraints = {
      maxBudget: 10000000,
      implementationTimelineMonths: 6,
      requiredCompliance: ['ISO27001'],
    };

    const matchingEvaluationResult = {
      compatibilityScore: 85,
      riskFactors: duplicateRiskFactors,
      feasibilityAssessment: '実装可能',
    };

    // スタブ: AIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        confidenceScore: 92,
        proposedApproach: '段階的導入戦略',
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: '過去の同規模顧客で成功実績あり',
        supportingData: ['事例A', '事例B'],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 88,
        applicablePatterns: ['Pattern-Enterprise-Cloud'],
      }),
    };

    // スタブ: FileStorageAdapter
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileId: 'FILE-001',
        uploadedAt: '2024-01-15T11:00:00Z',
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://storage.example.com/FILE-001',
        expiresAt: '2024-01-16T11:00:00Z',
      }),
    };

    // 実行: 経営層向け説得資料の自動生成
    const result = generateExecutivePersuasionDocument(
      {
        proposalId: proposalId,
        customerId: customerId,
        proposalContent: proposalContent,
        customerConstraints: customerConstraints,
        matchingEvaluationResult: matchingEvaluationResult,
      },
      mockAIEngine,
      mockFileStorage
    );

    // 検証: 生成された資料に記載されるリスク要因が重複排除されている
    expect(result).toBeDefined();
    expect(result.documentContent).toBeDefined();

    // リスク要因リストを抽出
    const reportedRiskFactors = result.documentContent.riskFactors;

    // 期待結果: 各リスク要因が1件ずつのみ記載されている
    expect(reportedRiskFactors).toEqual(['コスト増加リスク', '導入期間の遅延']);
    expect(reportedRiskFactors.length).toBe(2);

    // 重複データが存在しないことを確認
    const uniqueRiskFactors = Array.from(new Set(reportedRiskFactors));
    expect(reportedRiskFactors).toEqual(uniqueRiskFactors);

    // 資料のメタデータ検証
    expect(result.documentContent.title).toBe('経営層向け説得資料');
    expect(result.documentContent.proposalId).toBe(proposalId);
    expect(result.documentContent.customerId).toBe(customerId);

    // 提案の妥当性が記載されていること
    expect(result.documentContent.proposalFeasibility).toBeDefined();
    expect(result.documentContent.proposalFeasibility.compatibilityScore).toBe(85);

    // 投資対効果が数値化されて記載されていること
    expect(result.documentContent.investmentAnalysis).toBeDefined();
    expect(result.documentContent.investmentAnalysis.investmentAmount).toBe(5000000);
    expect(result.documentContent.investmentAnalysis.expectedROI).toBe(30);

    // ファイル保存が正常に実行されたことを確認
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalled();
    expect(result.uploadResult.fileId).toBe('FILE-001');
  });
});