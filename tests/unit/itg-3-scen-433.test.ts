import { generateGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  test('SCEN-433: 改善対象項目が複数件の場合、全項目が方針に正しく含まれる', () => {
    // 準備: 複数の改善項目を含む商談条件データ
    const dealConditions = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      businessType: 'IT',
      dealStage: 'proposal',
      customerChallenges: ['cost reduction', 'system modernization'],
    };

    // スタブ: AIRecommendationEngine.generateRecommendation()
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'multi-phase implementation',
        confidenceScore: 78,
        improvements: [
          {
            id: 'IMP-001',
            title: '提案資料の充実度向上',
            description: 'customer case studies and ROI analysis を追加',
            priority: 1,
          },
          {
            id: 'IMP-002',
            title: '顧客課題のヒアリング深掘り',
            description: 'current system pain points の詳細ヒアリング',
            priority: 2,
          },
          {
            id: 'IMP-003',
            title: 'フォローアップ頻度の増加',
            description: '週1回から週2回へ',
            priority: 3,
          },
        ],
      }),
    };

    // 実行
    const guidancePolicy = generateGuidancePolicy(dealConditions, mockAIEngine);

    // 検証: 返却されたオブジェクトの構造
    expect(guidancePolicy).toHaveProperty('improvements');
    expect(Array.isArray(guidancePolicy.improvements)).toBe(true);

    // 検証: 改善項目の件数（3件以上が含まれること）
    expect(guidancePolicy.improvements.length).toBe(3);

    // 検証: 各改善項目が存在し、入力順序と一致していること
    expect(guidancePolicy.improvements[0]).toEqual({
      id: 'IMP-001',
      title: '提案資料の充実度向上',
      description: 'customer case studies and ROI analysis を追加',
      priority: 1,
    });

    expect(guidancePolicy.improvements[1]).toEqual({
      id: 'IMP-002',
      title: '顧客課題のヒアリング深掘り',
      description: 'current system pain points の詳細ヒアリング',
      priority: 2,
    });

    expect(guidancePolicy.improvements[2]).toEqual({
      id: 'IMP-003',
      title: 'フォローアップ頻度の増加',
      description: '週1回から週2回へ',
      priority: 3,
    });

    // 検証: 改善項目の重複がないこと（titleで一意性確認）
    const uniqueTitles = new Set(guidancePolicy.improvements.map((imp: any) => imp.title));
    expect(uniqueTitles.size).toBe(3);

    // 検証: 方針オブジェクトがその他の必須フィールドを持つこと
    expect(guidancePolicy).toHaveProperty('dealId');
    expect(guidancePolicy).toHaveProperty('guidanceDirection');
    expect(guidancePolicy.dealId).toBe('DEAL-001');
    expect(typeof guidancePolicy.guidanceDirection).toBe('string');
  });
});