import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2041
  test('経営層向け説得資料の自動生成機能 - 生成された資料がAmazon S3へのアップロードに成功した場合、ダウンロードURLが返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '当社のクラウドソリューション導入により、年間30%のコスト削減を実現',
        reasoning: '顧客の既存システムの複雑性と保守コスト増加が主要課題であり、クラウド化により運用効率向上が期待される',
        successCases: [
          {
            caseId: 'CASE-2025-001',
            industry: '金融',
            companySize: '大規模企業',
            result: '成約',
            roi: '320%'
          },
          {
            caseId: 'CASE-2025-002',
            industry: '製造',
            companySize: '中堅企業',
            result: '成約',
            roi: '280%'
          }
        ],
        riskFactors: ['既存システムからの移行期間の業務影響', '従業員教育時間の確保'],
        improvementProposals: ['段階的マイグレーション計画の提案', '専任技術サポート体制の構築']
      })
    };

    const mockFileAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3ObjectKey: 'reports/proposal_20260801_abc123.pdf'
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://bucket.s3.amazonaws.com/reports/proposal_20260801_abc123.pdf?X-Amz-Signature=AQoDYXdzEJr..&X-Amz-Expires=3600&X-Amz-SignedHeaders=host',
        expiresIn: 3600
      })
    };

    const customerInfo = {
      customerId: 'CUST-20260801-001',
      companyName: '株式会社テクノロジー',
      industry: '金融',
      companySize: '大規模企業',
      annualRevenue: 50000000000,
      currentSystemChallenges: ['システム保守コストの増加', 'スケーラビリティの限界'],
      managementObjectives: ['コスト削減', '業務効率化', 'デジタル変革']
    };

    const proposalContent = {
      proposalId: 'PROP-20260801-001',
      productServices: ['クラウドマイグレーション', 'クラウド運用保守サービス'],
      estimatedInvestment: 150000000,
      expectedBenefit: 450000000,
      implementationPeriod: 12,
      timeline: '2026年9月〜2027年8月'
    };

    const result = await generateExecutivePersuasionMaterial(
      customerInfo,
      proposalContent,
      mockAIEngine,
      mockFileAdapter
    );

    expect(result.downloadUrl).toMatch(/^https:\/\/bucket\.s3\.amazonaws\.com/);
    expect(result.downloadUrl).toContain('X-Amz-Signature');
    expect(result.downloadUrl).toContain('X-Amz-Expires=3600');
    expect(result.expiresIn).toBe(3600);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20260801-001',
        industry: '金融',
        companySize: '大規模企業'
      })
    );
    expect(mockFileAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalApproach: expect.any(String),
        reasoning: expect.any(String)
      })
    );
    expect(mockFileAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      'reports/proposal_20260801_abc123.pdf'
    );
  });
});