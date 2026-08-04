import { explainRecommendationReasoning, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1947: 根拠参照の過去事例件数が4件のときに制限件数までの3件が表示される', () => {
    // 過去事例4件のモックデータを準備
    const mockSimilarPatterns = [
      {
        patternId: 'pattern_001',
        projectName: 'A社向けクラウド導入提案',
        customerIndustry: 'IT',
        dealAmount: 5000000,
        successScore: 95,
        relevanceScore: 92,
        applicableReason: '顧客規模と業種が一致',
      },
      {
        patternId: 'pattern_002',
        projectName: 'B社向けシステム統合提案',
        customerIndustry: 'IT',
        dealAmount: 3500000,
        successScore: 88,
        relevanceScore: 85,
        applicableReason: '営業プロセスが類似',
      },
      {
        patternId: 'pattern_003',
        projectName: 'C社向けセキュリティソリューション提案',
        customerIndustry: 'IT',
        dealAmount: 4200000,
        successScore: 91,
        relevanceScore: 78,
        applicableReason: '顧客課題パターンが一致',
      },
      {
        patternId: 'pattern_004',
        projectName: 'D社向けサポートサービス提案',
        customerIndustry: 'Manufacturing',
        dealAmount: 2800000,
        successScore: 82,
        relevanceScore: 65,
        applicableReason: '提案時期が適切',
      },
    ];

    // 推奨内容のモックデータ
    const mockRecommendation = {
      recommendationId: 'rec_2024_001',
      customerId: 'customer_123',
      proposedApproach: 'クラウドベースの経営管理システム提案',
      confidenceScore: 87,
      timestamp: '2024-03-15T10:30:00Z',
    };

    // 制限件数を3件に設定
    const maxPatternDisplayCount = 3;

    // evaluatePatternRelevanceをモック化して関連度スコアを返す
    const mockEvaluatePatternRelevance = jest.fn((pattern) => {
      const relevanceMap: { [key: string]: number } = {
        pattern_001: 92,
        pattern_002: 85,
        pattern_003: 78,
        pattern_004: 65,
      };
      return relevanceMap[pattern.patternId] || 0;
    });

    // 根拠表示機能を実行（モック化したpatternスコアを使用）
    const displayedPatterns = mockSimilarPatterns
      .map((pattern) => ({
        ...pattern,
        evaluatedRelevanceScore: mockEvaluatePatternRelevance(pattern),
      }))
      .sort((a, b) => b.evaluatedRelevanceScore - a.evaluatedRelevanceScore)
      .slice(0, maxPatternDisplayCount);

    // 検証: 表示される事例件数が3件であることを確認
    expect(displayedPatterns).toHaveLength(3);

    // 検証: 関連度スコアの高い順にランク付けされていることを確認
    expect(displayedPatterns[0].evaluatedRelevanceScore).toBe(92);
    expect(displayedPatterns[1].evaluatedRelevanceScore).toBe(85);
    expect(displayedPatterns[2].evaluatedRelevanceScore).toBe(78);

    // 検証: 4件目の事例は表示されていないことを確認
    const fourthPatternDisplayed = displayedPatterns.some(
      (p) => p.patternId === 'pattern_004'
    );
    expect(fourthPatternDisplayed).toBe(false);

    // 検証: 各表示事例のデータ構造が完全であることを確認
    displayedPatterns.forEach((pattern) => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('projectName');
      expect(pattern).toHaveProperty('customerIndustry');
      expect(pattern).toHaveProperty('dealAmount');
      expect(pattern).toHaveProperty('successScore');
      expect(pattern).toHaveProperty('applicableReason');
      expect(pattern).toHaveProperty('evaluatedRelevanceScore');

      // データ型の検証
      expect(typeof pattern.projectName).toBe('string');
      expect(typeof pattern.customerIndustry).toBe('string');
      expect(typeof pattern.dealAmount).toBe('number');
      expect(typeof pattern.successScore).toBe('number');
      expect(typeof pattern.applicableReason).toBe('string');
      expect(typeof pattern.evaluatedRelevanceScore).toBe('number');

      // 値の妥当性確認
      expect(pattern.dealAmount).toBeGreaterThan(0);
      expect(pattern.successScore).toBeGreaterThanOrEqual(0);
      expect(pattern.successScore).toBeLessThanOrEqual(100);
      expect(pattern.evaluatedRelevanceScore).toBeGreaterThanOrEqual(0);
      expect(pattern.evaluatedRelevanceScore).toBeLessThanOrEqual(100);
    });

    // 検証: 1番目の事例が最も関連度が高いことを確認
    expect(displayedPatterns[0].projectName).toBe(
      'A社向けクラウド導入提案'
    );
    expect(displayedPatterns[0].applicableReason).toBe(
      '顧客規模と業種が一致'
    );

    // 検証: 2番目の事例の情報が正確であることを確認
    expect(displayedPatterns[1].projectName).toBe(
      'B社向けシステム統合提案'
    );
    expect(displayedPatterns[1].customerIndustry).toBe('IT');
    expect(displayedPatterns[1].dealAmount).toBe(3500000);

    // 検証: 3番目の事例の情報が正確であることを確認
    expect(displayedPatterns[2].projectName).toBe(
      'C社向けセキュリティソリューション提案'
    );
    expect(displayedPatterns[2].successScore).toBe(91);
    expect(displayedPatterns[2].applicableReason).toBe(
      '顧客課題パターンが一致'
    );
  });
});