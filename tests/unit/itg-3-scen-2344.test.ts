import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2344
  test('推奨データが複数件のときレポートに全件分の内容が記載される', async () => {
    fetchMock.resetMocks();

    const mockRecommendations = [
      {
        recommendationId: 'rec-001',
        proposalApproach: 'フェーズ1：初期ヒアリング→ニーズ分析→概算提案',
        reasoning: '過去の類似案件（顧客規模500-1000名、製造業）で成功した営業フロー',
        patternRelevanceScore: 0.95,
        successPatternId: 'pattern-A001',
        recommendedTiming: '初期商談から3営業日以内',
        confidenceScore: 93,
      },
      {
        recommendationId: 'rec-002',
        proposalApproach: 'フェーズ2：ROI試算→経営層プレゼン→契約交渉',
        reasoning: '同業種の大型案件（予算規模5000万円以上）の成約データ',
        patternRelevanceScore: 0.88,
        successPatternId: 'pattern-B002',
        recommendedTiming: '合意形成から1週間以内',
        confidenceScore: 85,
      },
      {
        recommendationId: 'rec-003',
        proposalApproach: 'フェーズ3：導入支援→運用トレーニング→成功事例化',
        reasoning: '購買後失敗リスク回避パターン（導入時のユーザー抵抗が高い顧客向け）',
        patternRelevanceScore: 0.82,
        successPatternId: 'pattern-C003',
        recommendedTiming: '契約締結から2週間以内',
        confidenceScore: 78,
      },
    ];

    const inputParams = {
      dealId: 'deal-2024-001',
      customerId: 'cust-ABC123',
      recommendations: mockRecommendations,
      generatedAt: new Date('2024-01-15T11:00:00Z'),
    };

    let capturedReportContent: string = '';

    fetchMock.mockResponseOnce((req: any) => {
      const body = req.body;
      if (typeof body === 'string') {
        capturedReportContent = body;
      }
      return {
        status: 200,
        body: JSON.stringify({
          success: true,
          uploadedKey: 's3://reports/rec-2024-01-15-deal-2024-001.pdf',
          downloadUrl: 'https://s3.amazonaws.com/reports/rec-2024-01-15-deal-2024-001.pdf?expires=2024-01-22',
        }),
      };
    });

    const result = await generateRecommendationReport(inputParams, {
      uploadRecommendationReport: async (reportData: any) => {
        capturedReportContent = JSON.stringify(reportData);
        return {
          success: true,
          uploadedKey: 's3://reports/rec-2024-01-15-deal-2024-001.pdf',
          downloadUrl: 'https://s3.amazonaws.com/reports/rec-2024-01-15-deal-2024-001.pdf?expires=2024-01-22',
        };
      },
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.uploadedKey).toMatch(/rec-2024-01-15-deal-2024-001/);

    const reportContent = typeof result.reportContent === 'string'
      ? JSON.parse(result.reportContent)
      : result.reportContent;

    expect(reportContent).toBeDefined();
    expect(Array.isArray(reportContent.recommendations)).toBe(true);
    expect(reportContent.recommendations.length).toBe(3);

    // 推奨1の検証
    const rec1 = reportContent.recommendations[0];
    expect(rec1.recommendationId).toBe('rec-001');
    expect(rec1.proposalApproach).toBe('フェーズ1：初期ヒアリング→ニーズ分析→概算提案');
    expect(rec1.reasoning).toBe('過去の類似案件（顧客規模500-1000名、製造業）で成功した営業フロー');
    expect(rec1.patternRelevanceScore).toBe(0.95);
    expect(rec1.successPatternId).toBe('pattern-A001');
    expect(rec1.confidenceScore).toBe(93);

    // 推奨2の検証
    const rec2 = reportContent.recommendations[1];
    expect(rec2.recommendationId).toBe('rec-002');
    expect(rec2.proposalApproach).toBe('フェーズ2：ROI試算→経営層プレゼン→契約交渉');
    expect(rec2.reasoning).toBe('同業種の大型案件（予算規模5000万円以上）の成約データ');
    expect(rec2.patternRelevanceScore).toBe(0.88);
    expect(rec2.successPatternId).toBe('pattern-B002');
    expect(rec2.confidenceScore).toBe(85);

    // 推奨3の検証
    const rec3 = reportContent.recommendations[2];
    expect(rec3.recommendationId).toBe('rec-003');
    expect(rec3.proposalApproach).toBe('フェーズ3：導入支援→運用トレーニング→成功事例化');
    expect(rec3.reasoning).toBe('購買後失敗リスク回避パターン（導入時のユーザー抵抗が高い顧客向け）');
    expect(rec3.patternRelevanceScore).toBe(0.82);
    expect(rec3.successPatternId).toBe('pattern-C003');
    expect(rec3.confidenceScore).toBe(78);

    // データの欠落・重複がないことを確認
    expect(reportContent.dealId).toBe('deal-2024-001');
    expect(reportContent.customerId).toBe('cust-ABC123');
    expect(reportContent.generatedAt).toBeDefined();

    // 各推奨データが完全に含まれていることを確認
    mockRecommendations.forEach((expectedRec, index) => {
      const actualRec = reportContent.recommendations[index];
      expect(actualRec.recommendationId).toBe(expectedRec.recommendationId);
      expect(actualRec.proposalApproach).toBe(expectedRec.proposalApproach);
      expect(actualRec.reasoning).toBe(expectedRec.reasoning);
      expect(actualRec.patternRelevanceScore).toBe(expectedRec.patternRelevanceScore);
      expect(actualRec.successPatternId).toBe(expectedRec.successPatternId);
      expect(actualRec.confidenceScore).toBe(expectedRec.confidenceScore);
    });
  });
});