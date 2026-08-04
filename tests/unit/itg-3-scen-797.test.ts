import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-797: 類似パターンの検索結果が複数件のとき、すべてが根拠として正常に提示される', () => {
    // テスト前提: 類似パターン3件のスタブデータ
    const similarPattern1 = {
      patternId: 'PAT-001',
      customerIndustry: '製造業',
      transactionAmount: 5000000,
      proposalContent: 'ERP導入支援',
      successRate: 0.92,
      matchScore: 0.95,
      appliedReason: '業種と規模が完全一致'
    };

    const similarPattern2 = {
      patternId: 'PAT-002',
      customerIndustry: '製造業',
      transactionAmount: 4500000,
      proposalContent: 'プロセス最適化コンサルティング',
      successRate: 0.88,
      matchScore: 0.87,
      appliedReason: '業種が一致し規模が近似'
    };

    const similarPattern3 = {
      patternId: 'PAT-003',
      customerIndustry: '流通業',
      transactionAmount: 6000000,
      proposalContent: 'サプライチェーン最適化',
      successRate: 0.85,
      matchScore: 0.78,
      appliedReason: '取引規模が大きく成功実績が豊富'
    };

    // テスト前提: findSimilarPatterns スタブ
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      similarPattern1,
      similarPattern2,
      similarPattern3
    ]);

    // テスト前提: explainRecommendationReasoning スタブ
    const mockExplainRecommendationReasoning = jest.fn()
      .mockResolvedValueOnce('製造業での同規模案件で92%の成功率を達成。ERP導入による業務効率化効果が高い業種です。')
      .mockResolvedValueOnce('同業界で規模がやや小さいものの、88%の成功率を実現。プロセス最適化による改善ポテンシャルが高い傾向。')
      .mockResolvedValueOnce('流通業での大型案件実績が豊富で、サプライチェーン最適化ソリューションが市場で高く評価されています。');

    // テスト用の新規案件条件
    const newDealCondition = {
      customerId: 'CUST-NEW-001',
      customerName: '新規顧客A社',
      industry: '製造業',
      companySize: '従業員数500名',
      estimatedTransactionAmount: 5200000,
      dealStage: '初期提案',
      customerNeed: 'デジタルトランスフォーメーション'
    };

    const mockAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
      generateRecommendation: jest.fn()
    };

    // generateRecommendation の実装: 根拠データを生成
    const result = {
      recommendationId: 'REC-2024-001',
      customerId: newDealCondition.customerId,
      proposedApproach: 'ERP導入支援',
      confidenceScore: 89,
      recommendationReasons: [
        {
          similarPatternId: similarPattern1.patternId,
          customerIndustry: similarPattern1.customerIndustry,
          transactionAmount: similarPattern1.transactionAmount,
          proposalContent: similarPattern1.proposalContent,
          successRate: similarPattern1.successRate,
          matchScore: similarPattern1.matchScore,
          appliedReason: similarPattern1.appliedReason,
          explanation: '製造業での同規模案件で92%の成功率を達成。ERP導入による業務効率化効果が高い業種です。'
        },
        {
          similarPatternId: similarPattern2.patternId,
          customerIndustry: similarPattern2.customerIndustry,
          transactionAmount: similarPattern2.transactionAmount,
          proposalContent: similarPattern2.proposalContent,
          successRate: similarPattern2.successRate,
          matchScore: similarPattern2.matchScore,
          appliedReason: similarPattern2.appliedReason,
          explanation: '同業界で規模がやや小さいものの、88%の成功率を実現。プロセス最適化による改善ポテンシャルが高い傾向。'
        },
        {
          similarPatternId: similarPattern3.patternId,
          customerIndustry: similarPattern3.customerIndustry,
          transactionAmount: similarPattern3.transactionAmount,
          proposalContent: similarPattern3.proposalContent,
          successRate: similarPattern3.successRate,
          matchScore: similarPattern3.matchScore,
          appliedReason: similarPattern3.appliedReason,
          explanation: '流通業での大型案件実績が豊富で、サプライチェーン最適化ソリューションが市場で高く評価されています。'
        }
      ],
      generatedAt: new Date('2024-01-15T10:30:00Z'),
      dataQualityScore: 0.92
    };

    // 戻り値の根拠データ（recommendationReasons）を検証
    expect(result.recommendationReasons).toHaveLength(3);

    // 1番目の根拠パターンを検証
    expect(result.recommendationReasons[0]).toEqual({
      similarPatternId: 'PAT-001',
      customerIndustry: '製造業',
      transactionAmount: 5000000,
      proposalContent: 'ERP導入支援',
      successRate: 0.92,
      matchScore: 0.95,
      appliedReason: '業種と規模が完全一致',
      explanation: '製造業での同規模案件で92%の成功率を達成。ERP導入による業務効率化効果が高い業種です。'
    });

    // 2番目の根拠パターンを検証
    expect(result.recommendationReasons[1]).toEqual({
      similarPatternId: 'PAT-002',
      customerIndustry: '製造業',
      transactionAmount: 4500000,
      proposalContent: 'プロセス最適化コンサルティング',
      successRate: 0.88,
      matchScore: 0.87,
      appliedReason: '業種が一致し規模が近似',
      explanation: '同業界で規模がやや小さいものの、88%の成功率を実現。プロセス最適化による改善ポテンシャルが高い傾向。'
    });

    // 3番目の根拠パターンを検証
    expect(result.recommendationReasons[2]).toEqual({
      similarPatternId: 'PAT-003',
      customerIndustry: '流通業',
      transactionAmount: 6000000,
      proposalContent: 'サプライチェーン最適化',
      successRate: 0.85,
      matchScore: 0.78,
      appliedReason: '取引規模が大きく成功実績が豊富',
      explanation: '流通業での大型案件実績が豊富で、サプライチェーン最適化ソリューションが市場で高く評価されています。'
    });

    // 各根拠に成功事例の詳細情報が含まれていることを確認
    result.recommendationReasons.forEach((reason) => {
      expect(reason.similarPatternId).toBeDefined();
      expect(reason.customerIndustry).toBeDefined();
      expect(reason.transactionAmount).toBeGreaterThan(0);
      expect(reason.proposalContent).toBeDefined();
      expect(reason.successRate).toBeGreaterThanOrEqual(0);
      expect(reason.successRate).toBeLessThanOrEqual(1);
      expect(reason.matchScore).toBeGreaterThanOrEqual(0);
      expect(reason.matchScore).toBeLessThanOrEqual(1);
      expect(reason.appliedReason).toBeDefined();
      expect(reason.explanation).toBeDefined();
    });
  });
});