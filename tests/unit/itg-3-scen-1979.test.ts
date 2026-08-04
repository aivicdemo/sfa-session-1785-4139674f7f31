import { generatePersuasionReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1979
  test('経営層向け説得資料の自動生成機能 - 生成された説得資料がPDF形式でファイルストレージアダプタにアップロードされる', async () => {
    const customerId = 'CUST-20240115-001';
    const customerName = 'テスト株式会社';
    const industry = '製造業';
    const issue = '生産効率の向上';
    const productName = 'AI生産管理システム';
    const expectedRoi = 35;
    const implementationSchedule = '3ヶ月';

    const customerInfo = {
      id: customerId,
      name: customerName,
      industry: industry,
      issue: issue,
    };

    const proposalContent = {
      productName: productName,
      expectedRoi: expectedRoi,
      implementationSchedule: implementationSchedule,
    };

    const fileTimestamp = '20240115T110000Z';
    const fileId = `FILE-${customerId}-${fileTimestamp}`;
    const s3FilePath = `s3://sales-reports/persuasion_report_${customerId}_${fileTimestamp}.pdf`;
    const fileSize = 1250000;
    const uploadedAt = new Date('2024-01-15T11:00:00Z');

    const mockAiEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        title: '経営層向け投資提案書',
        executiveSummary: '当社のAI生産管理システムにより、生産効率を35%向上させることができます。',
        roiAnalysis: {
          initialInvestment: 5000000,
          expectedAnnualBenefit: 1750000,
          paybackPeriodMonths: 34,
          threeYearRoi: 280,
        },
        implementationEffects: [
          '生産ラインの稼働率が20%向上',
          '不良品率が15%削減',
          '納期遵守率が98%に向上',
        ],
        riskMitigation: [
          '導入期間中の既存システム並行運用',
          '段階的な機能展開による平準化',
          '24時間サポート体制の整備',
        ],
      }),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileId: fileId,
        s3Path: s3FilePath,
        uploadedAt: uploadedAt,
      }),
    };

    const mockReportMetadataRecorder = jest.fn().mockResolvedValue({
      recordId: `REC-${fileId}`,
      success: true,
    });

    const result = await generatePersuasionReport(
      customerInfo,
      proposalContent,
      mockAiEngine,
      mockFileStorage,
      mockReportMetadataRecorder,
      fileTimestamp
    );

    expect(mockAiEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: customerId,
        customerName: customerName,
        industry: industry,
        issue: issue,
        productName: productName,
        expectedRoi: expectedRoi,
        implementationSchedule: implementationSchedule,
      })
    );

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalled();
    const uploadCall = mockFileStorage.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCall.contentType).toBe('application/pdf');
    expect(uploadCall.fileContent).toBeDefined();
    expect(typeof uploadCall.fileContent === 'string' || Buffer.isBuffer(uploadCall.fileContent)).toBe(true);
    expect(uploadCall.fileName).toMatch(new RegExp(`^persuasion_report_${customerId}_${fileTimestamp}\\.pdf$`));

    expect(result.fileId).toBe(fileId);
    expect(result.s3Path).toBe(s3FilePath);
    expect(result.uploadedAt).toEqual(uploadedAt);

    expect(mockReportMetadataRecorder).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: fileId,
        customerId: customerId,
        uploadedAt: uploadedAt,
        fileSize: fileSize,
      })
    );

    const metadataCall = mockReportMetadataRecorder.mock.calls[0][0];
    expect(metadataCall.fileId).toBe(fileId);
    expect(metadataCall.customerId).toBe(customerId);
    expect(metadataCall.uploadedAt).toEqual(uploadedAt);
  });
});