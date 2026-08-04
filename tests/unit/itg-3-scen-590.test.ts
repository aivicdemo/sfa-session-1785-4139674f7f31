import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - レポート生成フォールバック', () => {
  // SCEN-590
  test('FileStorageAdapter.uploadRecommendationReportが3回すべて失敗するときHTML形式で返される', async () => {
    const mockRecommendationData = {
      customerId: 'CUST001',
      customerName: '株式会社ABC',
      industry: '製造業',
      companySize: '従業員500名',
      proposedApproach: '既存製品との連携を強化した段階的導入アプローチ',
      reasoningBasis: [
        {
          factorType: '顧客事例',
          content: '同業種で段階的導入により導入期間を30%短縮した実績がある'
        },
        {
          factorType: '成功パターン',
          content: '大規模製造業では保守部門との事前調整が採用率向上の鍵'
        },
        {
          factorType: 'リスク対策',
          content: '既存システム連携が重要なため、API仕様書の事前確認を推奨'
        }
      ],
      recommendationScore: 87,
      generatedAt: '2024-12-15T10:30:00Z'
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('Upload failed: S3 connection timeout'))
        .mockRejectedValueOnce(new Error('Upload failed: S3 service unavailable'))
        .mockRejectedValueOnce(new Error('Upload failed: S3 access denied'))
    };

    const result = await generateRecommendationReportWithFallback(
      mockRecommendationData,
      mockFileStorageAdapter
    );

    expect(typeof result).toBe('string');
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<html');
    expect(result).toContain(mockRecommendationData.customerName);
    expect(result).toContain(mockRecommendationData.proposedApproach);
    expect(result).toContain('株式会社ABC');
    expect(result).toContain('製造業');
    expect(result).toContain('段階的導入アプローチ');
    expect(result).toContain('87');
    expect(result).toContain('同業種で段階的導入により導入期間を30%短縮した実績がある');
    expect(result).toContain('大規模製造業では保守部門との事前調整が採用率向上の鍵');
    expect(result).toContain('既存システム連携が重要なため、API仕様書の事前確認を推奨');
    expect(result).toContain('</html>');

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        customerId: 'CUST001',
        customerName: '株式会社ABC'
      })
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        customerId: 'CUST001',
        customerName: '株式会社ABC'
      })
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        customerId: 'CUST001',
        customerName: '株式会社ABC'
      })
    );
  });
});