import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠の可視化機能', () => {
  test('SCEN-928: [normal] 推奨根拠が営業担当者向けに自然言語で説明文として返却される', () => {
    // 新規案件の顧客情報
    const customerInfo = {
      industry: '製造業',
      revenue: '100億円以上',
      challenge: '生産効率化'
    };

    // 過去成功事例データ
    const similarPattern = {
      caseId: 'CASE-A001',
      companyName: 'A社',
      industry: '製造業',
      revenue: '100億円以上',
      approach: '課題解決型の提案アプローチ',
      matchDegree: 0.92
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() => {
        return 'この顧客は過去の成功事例\'A社（製造業、売上100億円以上）\'と業種・規模が一致しており、同じく課題解決型の提案アプローチが有効である可能性が高いため、本アプローチを推奨します。';
      })
    };

    // 推奨根拠の可視化機能を呼び出す
    const result = explainRecommendationReasoning(
      customerInfo,
      similarPattern,
      mockAIEngine
    );

    // 返却された説明文が自然言語形式であることを確認
    expect(typeof result).toBe('string');

    // AIRecommendationEngineのexplainRecommendationReasoningメソッドが呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      customerInfo,
      similarPattern
    );

    // 返却された説明文に必要な要素が含まれていることを検証
    // 1. 類似した過去成功パターンの特性（業種・規模など）
    expect(result).toMatch(/製造業/);
    expect(result).toMatch(/100億円以上/);
    expect(result).toMatch(/A社/);

    // 2. 現在の案件との合致度を示す根拠
    expect(result).toMatch(/業種・規模が一致/);
    expect(result).toMatch(/可能性が高い/);

    // 3. 推奨内容が適用可能である理由を営業担当者が理解できる文体
    expect(result).toMatch(/本アプローチを推奨/);

    // 返却された説明文が営業担当者向けに理解しやすい形式であることを確認
    expect(result).toContain('この顧客は');
    expect(result).toContain('過去の成功事例');
    expect(result).toContain('推奨します');

    // 期待される説明文の内容と合致することを確認
    const expectedExplanation = 'この顧客は過去の成功事例\'A社（製造業、売上100億円以上）\'と業種・規模が一致しており、同じく課題解決型の提案アプローチが有効である可能性が高いため、本アプローチを推奨します。';
    expect(result).toBe(expectedExplanation);
  });
});