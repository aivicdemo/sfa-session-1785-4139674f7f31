import { generateExecutiveSummaryReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('経営層向け説得資料の自動生成機能 - リスク要因0件のケース', () => {
  test('SCEN-2017: リスク要因リストが0件のとき、リスク列が「なし」と記載される', async () => {
    // ========== Setup: テストデータ準備 ==========
    const customerData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト',
      industry: '情報通信',
      scale: '中堅企業',
      businessChallenge: '営業効率の低下',
    };

    const proposalContent = {
      proposalId: 'PROP-20240115-001',
      productName: 'AI営業支援システム',
      description: '営業活動の自動化と提案精度向上',
      expectedROI: 35,
      investmentAmount: 5000000,
      paybackPeriodMonths: 18,
    };

    // ========== Setup: AIRecommendationEngine スタブ ==========
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalId: proposalContent.proposalId,
        recommendationType: 'EXECUTIVE_SUMMARY',
        confidenceScore: 85,
        riskFactors: [],
        improvementProposals: [
          '段階的な導入で組織への影響を最小化',
          'ユーザー研修を事前に実施',
        ],
        successPatterns: [
          '類似企業での導入で営業効率35%向上を実現',
        ],
      }),
    };

    // ========== Setup: FileStorageAdapter スタブ ==========
    const fileStorageStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileUrl: 'https://s3.example.com/reports/EXEC-20240115-001.pdf',
        expirationTimestamp: new Date('2024-01-22T11:00:00Z').toISOString(),
      }),
    };

    // ========== Act: 経営層向け説得資料生成機能を実行 ==========
    const generatedReport = await generateExecutiveSummaryReport(
      customerData,
      proposalContent,
      aiEngineStub,
      fileStorageStub
    );

    // ========== Assert: リスク列が「なし」と明記されているか検証 ==========
    expect(generatedReport).toBeDefined();
    expect(generatedReport.reportType).toBe('EXECUTIVE_SUMMARY');

    // リスク要因セクションの検証
    expect(generatedReport.riskSection).toBeDefined();
    expect(generatedReport.riskSection.riskItems).toBe('なし');
    expect(generatedReport.riskSection.hasRisks).toBe(false);

    // その他の必須セクションの検証
    expect(generatedReport.proposalValueSection).toBeDefined();
    expect(generatedReport.proposalValueSection.expectedROI).toBe(35);
    expect(generatedReport.proposalValueSection.investmentAmount).toBe(5000000);

    expect(generatedReport.improvementSection).toBeDefined();
    expect(generatedReport.improvementSection.length).toBe(2);
    expect(generatedReport.improvementSection[0]).toBe('段階的な導入で組織への影響を最小化');

    expect(generatedReport.successPatternSection).toBeDefined();
    expect(generatedReport.successPatternSection.length).toBe(1);

    // ファイルアップロード検証
    expect(fileStorageStub.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        reportType: 'EXECUTIVE_SUMMARY',
        riskSection: expect.objectContaining({
          riskItems: 'なし',
          hasRisks: false,
        }),
      })
    );

    // 生成レポートのURL確認
    expect(generatedReport.downloadUrl).toBe('https://s3.example.com/reports/EXEC-20240115-001.pdf');
    expect(generatedReport.fileExpiration).toBe(new Date('2024-01-22T11:00:00Z').toISOString());
  });
});