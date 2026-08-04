import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

// Mock for AIRecommendationEngine
interface RecommendationItem {
  approach: string;
  score: number;
  reasoning: string;
}

interface GenerateRecommendationResponse {
  recommendations: RecommendationItem[];
}

interface UploadReportResponse {
  downloadUrl: string;
  expiresAt: string;
}

// Mock AIRecommendationEngine
const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
};

// Mock FileStorageAdapter
const mockFileStorageAdapter = {
  uploadRecommendationReport: jest.fn(),
};

describe('AIエージェント推奨根拠の可視化機能 - レポート生成', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-697
  test('複数件の推奨内容が入力された場合、すべての内容を含むレポートが生成される', async () => {
    // Arrange: AIRecommendationEngineのモック化と複数件推奨内容の設定
    const mockRecommendations: RecommendationItem[] = [
      {
        approach: '顧客課題対応型',
        score: 0.95,
        reasoning: '顧客の経営課題に直接対応した提案アプローチ。過去事例から95%の適合度が確認されている。',
      },
      {
        approach: '予算最適化型',
        score: 0.87,
        reasoning: '顧客の予算制約を考慮した段階的導入提案。87%のリスク回避効果が期待される。',
      },
      {
        approach: '導入支援型',
        score: 0.79,
        reasoning: '導入後の成功を重視したサポート体制の提案。79%の顧客満足度実績がある。',
      },
    ];

    const generateRecommendationResponse: GenerateRecommendationResponse = {
      recommendations: mockRecommendations,
    };

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue(
      generateRecommendationResponse
    );

    // FileStorageAdapterのモック化と一時ダウンロードURLの設定
    const mockDownloadUrl =
      'https://s3.amazonaws.com/bucket/reports/temp-url-12345?expires=2026-12-31T23:59:59Z';
    const uploadReportResponse: UploadReportResponse = {
      downloadUrl: mockDownloadUrl,
      expiresAt: '2026-12-31T23:59:59Z',
    };

    mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValue(
      uploadReportResponse
    );

    // 新規案件データの入力パラメータ
    const newProjectData = {
      customerId: 'CUST-20260801-001',
      customerName: '山田商事株式会社',
      industry: '製造業',
      employeeCount: 500,
      annualRevenue: 5000000000,
      currentChallenge: 'デジタル化推進による業務効率化',
      budget: 50000000,
      timeline: 6,
      dealStage: '初期提案',
      productCategory: 'ERP導入支援',
    };

    // Act: レポート生成・保存機能の実行
    const result = await generateRecommendationReport(
      newProjectData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: 生成されたレポートの検証

    // 1. AIRecommendationEngineが呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newProjectData
    );

    // 2. FileStorageAdapterが呼び出されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // 3. 推奨内容Aが記載されていることを確認
    expect(result.reportContent).toContain('顧客課題対応型');
    expect(result.reportContent).toContain('0.95');
    expect(
      result.reportContent.includes('顧客の経営課題に直接対応した提案アプローチ')
    ).toBe(true);

    // 4. 推奨内容Bが記載されていることを確認
    expect(result.reportContent).toContain('予算最適化型');
    expect(result.reportContent).toContain('0.87');
    expect(
      result.reportContent.includes('顧客の予算制約を考慮した段階的導入提案')
    ).toBe(true);

    // 5. 推奨内容Cが記載されていることを確認
    expect(result.reportContent).toContain('導入支援型');
    expect(result.reportContent).toContain('0.79');
    expect(
      result.reportContent.includes('導入後の成功を重視したサポート体制の提案')
    ).toBe(true);

    // 6. 推奨内容の個数が3件であることを確認
    expect(result.recommendationCount).toBe(3);

    // 7. 各推奨内容の構造確認
    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations[0]).toEqual({
      approach: '顧客課題対応型',
      score: 0.95,
      reasoning: '顧客の経営課題に直接対応した提案アプローチ。過去事例から95%の適合度が確認されている。',
    });
    expect(result.recommendations[1]).toEqual({
      approach: '予算最適化型',
      score: 0.87,
      reasoning: '顧客の予算制約を考慮した段階的導入提案。87%のリスク回避効果が期待される。',
    });
    expect(result.recommendations[2]).toEqual({
      approach: '導入支援型',
      score: 0.79,
      reasoning: '導入後の成功を重視したサポート体制の提案。79%の顧客満足度実績がある。',
    });

    // 8. レポート形式がPDFであることを確認
    expect(result.reportFormat).toBe('PDF');

    // 9. 一時ダウンロードURLが有効であることを確認
    expect(result.downloadUrl).toBe(mockDownloadUrl);
    expect(result.downloadUrl).toMatch(/^https:\/\//);
    expect(result.downloadUrl).toContain('expires=');

    // 10. 有効期限が設定されていることを確認
    expect(result.expiresAt).toBe('2026-12-31T23:59:59Z');
    const expiresDate = new Date('2026-12-31T23:59:59Z');
    const currentDate = new Date();
    expect(expiresDate.getTime()).toBeGreaterThan(currentDate.getTime());

    // 11. レポート生成タイムスタンプが存在することを確認
    expect(result.generatedAt).toBeDefined();
    const generatedDate = new Date(result.generatedAt);
    expect(generatedDate).toBeInstanceOf(Date);
    expect(generatedDate.getTime()).toBeGreaterThan(currentDate.getTime() - 5000);
    expect(generatedDate.getTime()).toBeLessThanOrEqual(currentDate.getTime());

    // 12. すべての推奨内容が根拠スコアの高い順にソートされていることを確認
    expect(result.recommendations[0].score).toBe(0.95);
    expect(result.recommendations[1].score).toBe(0.87);
    expect(result.recommendations[2].score).toBe(0.79);
    expect(result.recommendations[0].score >= result.recommendations[1].score).toBe(
      true
    );
    expect(result.recommendations[1].score >= result.recommendations[2].score).toBe(
      true
    );

    // 13. カスタマーIDが記載されていることを確認
    expect(result.reportContent).toContain('CUST-20260801-001');

    // 14. 顧客名が記載されていることを確認
    expect(result.reportContent).toContain('山田商事株式会社');

    // 15. 業種情報が記載されていることを確認
    expect(result.reportContent).toContain('製造業');
  });
});