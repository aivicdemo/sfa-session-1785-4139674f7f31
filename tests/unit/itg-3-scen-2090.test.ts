import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2090
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 根拠が自然言語で説明される', () => {
    // テスト用の新規案件データ
    const caseData = {
      customerIndustry: '製造業',
      customerChallenge: '生産効率化',
      budgetRange: 5000000,
      decisionMaker: '工場長',
      factoryScale: 'medium',
    };

    // 推奨内容
    const recommendedApproach = '段階的導入アプローチ';

    // AIRecommendationEngineのスタブ
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        approach: recommendedApproach,
        confidenceScore: 82,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '過去の成功事例から、製造業における生産効率化案件では段階的導入アプローチにより契約成立率が80%以上となっています。貴社の顧客の工場規模と現在の予算規模（500万円）では、まず基礎機能を導入し、3ヶ月後の効果検証を経て追加投資を検討する段階的なアプローチが最も成功確度が高いパターンです。'
      ),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({ score: 0.85 }),
    };

    // テスト実行: 根拠説明を取得
    const result = explainRecommendationReasoning(
      caseData,
      recommendedApproach,
      aiRecommendationEngineStub
    );

    // 期待値: 根拠説明文が存在し、必須条件をすべて満たしている
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');

    // 条件①: 自然言語（日本語）で記述されている
    expect(result).toMatch(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/);

    // 条件②: 営業担当者向けの表現である
    expect(result).toMatch(/貴社|顧客|案件/);

    // 条件③: 当該案件の顧客属性（製造業、生産効率化課題）に言及している
    expect(result).toMatch(/製造業/);
    expect(result).toMatch(/生産効率化/);

    // 条件④: 過去成功パターンの類似性に基づいた説明を含んでいる
    expect(result).toMatch(/過去の成功事例|成功パターン|成功確度/);

    // 条件⑤: 推奨アプローチ（段階的導入アプローチ）とその選択理由が明確に結びついている
    expect(result).toMatch(/段階的導入|段階的なアプローチ/);
    expect(result).toMatch(/基礎機能を導入|3ヶ月後の効果検証/);

    // 期待結果: 具体的なテキストが含まれていること
    expect(result).toContain('過去の成功事例から');
    expect(result).toContain('製造業における生産効率化案件');
    expect(result).toContain('段階的導入アプローチ');
    expect(result).toContain('契約成立率が80%以上');
    expect(result).toContain('500万円');
    expect(result).toContain('基礎機能を導入');
    expect(result).toContain('3ヶ月後の効果検証');
    expect(result).toContain('最も成功確度が高いパターン');

    // AIエージェントのメソッドが適切に呼び出されたことを確認
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalledWith(
      caseData,
      recommendedApproach
    );
  });
});