import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠説明生成機能', () => {
  test('SCEN-056: 複数件の成功パターンが説明文に正常に生成される', () => {
    // Arrange: 複数件の成功パターン（3件以上）をスタブデータとして定義
    const patternA = {
      patternId: 'PAT-001',
      industry: '製造業',
      dealAmount: 5000000,
      successFactor: '技術提案による差別化',
      relevanceScore: 0.85,
    };

    const patternB = {
      patternId: 'PAT-002',
      industry: '流通業',
      dealAmount: 8000000,
      successFactor: 'コスト削減効果の明示',
      relevanceScore: 0.78,
    };

    const patternC = {
      patternId: 'PAT-003',
      industry: '金融業',
      dealAmount: 12000000,
      successFactor: 'リスク軽減戦略の提示',
      relevanceScore: 0.92,
    };

    const similarPatterns = [patternA, patternB, patternC];

    // Act: explainRecommendationReasoningメソッドを呼び出し、複数パターンから説明文を生成
    const explanation = explainRecommendationReasoning({
      similarPatterns,
      currentCustomerIndustry: '製造業',
      currentDealAmount: 6500000,
      recommendedApproach: '技術提案とコスト削減効果を組み合わせたアプローチ',
    });

    // Assert: 生成された説明文が要件を満たすことを確認
    // 1. 説明文全体の長さが500文字以上1500文字以下であることを確認
    expect(explanation.length).toBeGreaterThanOrEqual(500);
    expect(explanation.length).toBeLessThanOrEqual(1500);

    // 2. 3件すべてのパターンIDが説明文に含まれていることを確認
    expect(explanation).toMatch(/PAT-001/);
    expect(explanation).toMatch(/PAT-002/);
    expect(explanation).toMatch(/PAT-003/);

    // 3. 各パターンの顧客業界が説明文に含まれていることを確認
    expect(explanation).toMatch(/製造業/);
    expect(explanation).toMatch(/流通業/);
    expect(explanation).toMatch(/金融業/);

    // 4. 各パターンの商談金額が説明文に含まれていることを確認（数値形式）
    expect(explanation).toMatch(/500.*万/);
    expect(explanation).toMatch(/800.*万/);
    expect(explanation).toMatch(/1200.*万/);

    // 5. 各パターンの成功要因が説明文に含まれていることを確認
    expect(explanation).toMatch(/技術提案/);
    expect(explanation).toMatch(/コスト削減/);
    expect(explanation).toMatch(/リスク軽減/);

    // 6. 説明文が複数の段落または箇条書きで構成されていることを確認
    const paragraphs = explanation.split(/[\n\r]+/).filter((line) => line.trim().length > 0);
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
  });
});