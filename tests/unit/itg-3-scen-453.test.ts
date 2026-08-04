import { extractSalesRepsByImprovementTarget } from '../../src/logic/itg-3';

const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

describe('AIエージェント推奨支援システム - 営業担当者別改善対象抽出', () => {
  // SCEN-453
  test('改善対象項目を所有する営業担当者が複数人の場合、全員が重複なく抽出される', () => {
    // テストデータ: 改善対象項目と営業担当者の関連付け
    const improvementTargetName = '顧客ニーズ把握プロセス';
    
    const testData = {
      improvementTargets: [
        {
          id: 'target_001',
          name: improvementTargetName,
          category: 'process',
          priority: 'high',
        },
      ],
      salesRepsAssignments: [
        {
          id: 'assignment_001',
          improvementTargetId: 'target_001',
          salesRepId: 'rep_001',
          salesRepName: '営業太郎',
          assignedDate: '2024-01-10T08:00:00Z',
        },
        {
          id: 'assignment_002',
          improvementTargetId: 'target_001',
          salesRepId: 'rep_002',
          salesRepName: '営業花子',
          assignedDate: '2024-01-10T08:00:00Z',
        },
        {
          id: 'assignment_003',
          improvementTargetId: 'target_001',
          salesRepId: 'rep_003',
          salesRepName: '営業次郎',
          assignedDate: '2024-01-10T08:00:00Z',
        },
      ],
    };

    // AIRecommendationEngineのスタブ: 正常系レスポンス
    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      status: 'success',
      recommendation: {
        targetName: improvementTargetName,
        suggestedApproach: 'structured_interview',
        confidence: 0.92,
      },
    });

    // 改善対象項目抽出機能を実行
    const result = extractSalesRepsByImprovementTarget(
      improvementTargetName,
      testData,
      mockAIRecommendationEngine
    );

    // 取得した所有営業担当者一覧の件数を確認
    expect(result.salesReps.length).toBe(3);

    // 取得した所有営業担当者の名前を確認
    const extractedNames = result.salesReps.map((rep) => rep.name).sort();
    const expectedNames = ['営業太郎', '営業花子', '営業次郎'].sort();
    expect(extractedNames).toEqual(expectedNames);

    // 抽出結果に重複がないことを確認
    const uniqueRepIds = new Set(result.salesReps.map((rep) => rep.id));
    expect(uniqueRepIds.size).toBe(3);

    // 抽出された営業担当者の詳細情報を検証
    const taroRep = result.salesReps.find((rep) => rep.name === '営業太郎');
    expect(taroRep).toBeDefined();
    expect(taroRep?.id).toBe('rep_001');

    const hanakoRep = result.salesReps.find((rep) => rep.name === '営業花子');
    expect(hanakoRep).toBeDefined();
    expect(hanakoRep?.id).toBe('rep_002');

    const jiroRep = result.salesReps.find((rep) => rep.name === '営業次郎');
    expect(jiroRep).toBeDefined();
    expect(jiroRep?.id).toBe('rep_003');
  });
});