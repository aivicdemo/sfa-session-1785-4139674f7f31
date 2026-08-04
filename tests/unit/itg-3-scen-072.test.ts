import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 推奨レポート生成', () => {
  test('SCEN-072: 推奨内容がExcel形式のレポートで正常に生成される', async () => {
    // ===== Arrange =====
    const mockRecommendationData = {
      customerId: 'CUST-12345',
      customerName: '株式会社サンプル',
      industry: '製造業',
      companySize: '中堅企業',
      dealConditions: {
        productCategory: 'クラウドERP',
        estimatedBudget: 5000000,
        requiredDeliveryDate: '2024-06-30',
        decisionMakersCount: 3,
      },
      recommendedApproach: 'ROI重視のアプローチ',
    };

    const mockSimilarPatterns = [
      {
        caseId: 'CASE-001',
        customerName: '大手自動車部品メーカー',
        industry: '自動車',
        matchScore: 0.89,
        successOutcome: '3ヶ月で成約',
        approachUsed: 'ROI重視のアプローチ',
      },
      {
        caseId: 'CASE-002',
        customerName: 'テック系製造企業',
        industry: '製造業',
        matchScore: 0.76,
        successOutcome: '2ヶ月で成約',
        approachUsed: 'ROI重視のアプローチ',
      },
      {
        caseId: 'CASE-003',
        customerName: 'グローバル部品企業',
        industry: '製造業',
        matchScore: 0.71,
        successOutcome: '4ヶ月で成約',
        approachUsed: 'ROI重視のアプローチ',
      },
    ];

    const mockExplanation =
      'この提案は、顧客の経営課題である「業務効率化と原価低減」に直結するクラウドERPソリューションです。過去の類似案件では、中堅製造業での導入時に平均3ヶ月で成約に至っており、本案件も同様のタイムラインで対応可能です。予算規模も標準的で、ROI重視のアプローチが有効です。';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: mockRecommendationData.recommendedApproach,
        confidenceScore: 0.87,
        proposalSummary: 'クラウドERP導入による業務効率化提案',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(mockExplanation),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.87),
    };

    const mockUploadedFileMetadata = {
      fileName: 'recommendation_CUST-12345_20240115.xlsx',
      fileSize: 245678,
      uploadTimestamp: '2024-01-15T10:30:00Z',
      s3Url: 'https://s3.amazonaws.com/reports/recommendation_CUST-12345_20240115.xlsx',
      expiresIn: 2592000,
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue(mockUploadedFileMetadata),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://s3.amazonaws.com/reports/...',
        expiresAt: '2024-02-14T10:30:00Z',
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deleted: 1 }),
    };

    // ===== Act =====
    const result = await generateRecommendationReport(
      mockRecommendationData,
      'xlsx',
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // ===== Assert =====

    // 1. AI エンジンが正しく呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: 'サンプル',
        industry: '製造業',
      })
    );
    expect(
      mockAIRecommendationEngine.findSimilarPatterns
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        productCategory: 'クラウドERP',
      })
    );
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendedApproach: 'ROI重視のアプローチ',
      })
    );

    // 2. ファイルストレージアダプタが正確に 1 回呼び出されたことを確認
    expect(
      mockFileStorageAdapter.uploadRecommendationReport
    ).toHaveBeenCalledTimes(1);

    // 3. uploadRecommendationReport への引数を検証
    const uploadCall =
      mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCall.format).toBe('xlsx');
    expect(uploadCall.sheets).toBeDefined();
    expect(uploadCall.sheets).toHaveLength(3);

    // 4. シート名の検証
    const sheetNames = uploadCall.sheets.map(
      (sheet: { name: string }) => sheet.name
    );
    expect(sheetNames).toContain('推奨内容');
    expect(sheetNames).toContain('根拠・成功パターン');
    expect(sheetNames).toContain('営業活動ガイド');

    // 5. 『推奨内容』シートの検証
    const recommendationSheet = uploadCall.sheets.find(
      (sheet: { name: string }) => sheet.name === '推奨内容'
    );
    expect(recommendationSheet).toBeDefined();
    expect(recommendationSheet.data).toEqual(
      expect.objectContaining({
        customerName: '株式会社サンプル',
        industry: '製造業',
        companySize: '中堅企業',
        productCategory: 'クラウドERP',
        estimatedBudget: 5000000,
        requiredDeliveryDate: '2024-06-30',
      })
    );

    // 6. 『根拠・成功パターン』シートの検証
    const patternSheet = uploadCall.sheets.find(
      (sheet: { name: string }) => sheet.name === '根拠・成功パターン'
    );
    expect(patternSheet).toBeDefined();
    expect(patternSheet.data.similarCases).toBeDefined();
    expect(patternSheet.data.similarCases).toHaveLength(3);

    // 7. 類似成功事例と適用可能スコアの検証
    const firstCase = patternSheet.data.similarCases[0];
    expect(firstCase.caseId).toBe('CASE-001');
    expect(firstCase.matchScore).toBe(0.89);
    expect(typeof firstCase.matchScore).toBe('number');
    expect(firstCase.matchScore).toBeGreaterThanOrEqual(0.0);
    expect(firstCase.matchScore).toBeLessThanOrEqual(1.0);

    const secondCase = patternSheet.data.similarCases[1];
    expect(secondCase.matchScore).toBe(0.76);

    const thirdCase = patternSheet.data.similarCases[2];
    expect(thirdCase.matchScore).toBe(0.71);

    // 8. 『営業活動ガイド』シートの検証
    const guideSheet = uploadCall.sheets.find(
      (sheet: { name: string }) => sheet.name === '営業活動ガイド'
    );
    expect(guideSheet).toBeDefined();
    expect(guideSheet.data.explanation).toBeDefined();
    expect(typeof guideSheet.data.explanation).toBe('string');
    expect(guideSheet.data.explanation.length).toBeGreaterThanOrEqual(200);
    expect(guideSheet.data.explanation).not.toBe('');

    // 9. 戻り値の検証
    expect(result).toEqual(
      expect.objectContaining({
        fileName: 'recommendation_CUST-12345_20240115.xlsx',
        s3Url: 'https://s3.amazonaws.com/reports/recommendation_CUST-12345_20240115.xlsx',
        format: 'xlsx',
      })
    );
    expect(result.fileSize).toBe(245678);
    expect(result.uploadTimestamp).toBe('2024-01-15T10:30:00Z');
  });
});