import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能 - ファイルアップロード失敗時の代替処理', () => {
  test('SCEN-1896: FileStorageAdapter の uploadRecommendationReport が失敗したとき HTML 形式の代替表示を行う', () => {
    const mockRecommendationData = {
      recommendedApproach: '顧客の経営課題に対する段階的な提案アプローチ',
      reasoning: [
        '過去の類似案件で成功した提案順序を適用',
        '顧客の業種別特性に基づいた提案内容の調整',
        '予算規模と導入スケジュールの最適化'
      ],
      successPatterns: [
        {
          patternId: 'PAT-001',
          description: '製造業 1000名規模企業への ERP 導入',
          adoptionRate: 85,
          implementationPeriod: 6,
          keySuccessFactors: ['経営層の強い支援', 'プロジェクト体制の整備', '段階的な導入']
        },
        {
          patternId: 'PAT-002',
          description: '流通業における販売管理システム導入',
          adoptionRate: 78,
          implementationPeriod: 4,
          keySuccessFactors: ['現場スタッフの研修充実', 'データ移行計画の綿密性', '並行運用期間の確保']
        }
      ],
      confidenceScore: 87,
      customerContext: {
        industry: '製造業',
        companySize: 1200,
        currentChallenge: '生産管理の効率化'
      }
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValueOnce(
        new Error('S3 upload failed')
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValueOnce(mockRecommendationData),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const inputCondition = {
      customerId: 'CUST-20240115-001',
      industry: '製造業',
      companySize: 1200,
      currentChallenge: '生産管理の効率化',
      budget: 5000000,
      implementationTimeline: 6
    };

    const result = generateRecommendation(
      inputCondition,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    return result.then((output) => {
      expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();
      expect(output.displayFormat).toBe('html');
      expect(output.recommendedApproach).toBe(mockRecommendationData.recommendedApproach);
      expect(output.reasoning).toEqual(mockRecommendationData.reasoning);
      expect(output.successPatterns).toHaveLength(2);
      expect(output.successPatterns[0]).toEqual({
        patternId: 'PAT-001',
        description: '製造業 1000名規模企業への ERP 導入',
        adoptionRate: 85,
        implementationPeriod: 6,
        keySuccessFactors: ['経営層の強い支援', 'プロジェクト体制の整備', '段階的な導入']
      });
      expect(output.successPatterns[1]).toEqual({
        patternId: 'PAT-002',
        description: '流通業における販売管理システム導入',
        adoptionRate: 78,
        implementationPeriod: 4,
        keySuccessFactors: ['現場スタッフの研修充実', 'データ移行計画の綿密性', '並行運用期間の確保']
      });
      expect(output.confidenceScore).toBe(87);
      expect(output.htmlContent).toContain(mockRecommendationData.recommendedApproach);
      expect(output.htmlContent).toContain('PAT-001');
      expect(output.htmlContent).toContain('PAT-002');
      expect(output.htmlContent).toContain('製造業 1000名規模企業への ERP 導入');
      expect(output.htmlContent).toContain('85');
      expect(output.htmlContent).toContain('流通業における販売管理システム導入');
      expect(output.htmlContent).toContain('78');
      expect(output.htmlContent).toContain('段階的な提案アプローチ');
      expect(output.isBrowserSaveable).toBe(true);
      expect(output.mimeType).toBe('text/html');
      expect(output.fileName).toMatch(/recommendation_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z\.html/);
    });
  });
});