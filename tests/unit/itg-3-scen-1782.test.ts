import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1782: 推奨根拠の可視化機能 - 顧客購買履歴データが根拠として抽出される', async () => {
    // 事前登録する顧客購買履歴データ（5件以上）
    const purchase_history = [
      {
        customer_id: 'C12345',
        purchase_date: '2024-06-15',
        product_category: 'システム構築',
        purchase_amount: 1500000,
        industry: '金融'
      },
      {
        customer_id: 'C12345',
        purchase_date: '2024-03-10',
        product_category: 'システム保守',
        purchase_amount: 800000,
        industry: '金融'
      },
      {
        customer_id: 'C12345',
        purchase_date: '2023-12-05',
        product_category: 'データ分析',
        purchase_amount: 2000000,
        industry: '金融'
      },
      {
        customer_id: 'C12345',
        purchase_date: '2023-09-20',
        product_category: 'システム構築',
        purchase_amount: 1200000,
        industry: '金融'
      },
      {
        customer_id: 'C12345',
        purchase_date: '2023-06-12',
        product_category: 'コンサルティング',
        purchase_amount: 500000,
        industry: '金融'
      }
    ];

    // 新規案件情報
    const new_proposal = {
      customer_name: '新規顧客A',
      industry: '金融',
      budget_scale: 1800000
    };

    // AIRecommendationEngineのスタブ設定
    const stub_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'REC-2024-001',
        customer_id: 'C12345',
        proposed_approach: 'システム構築プロジェクト',
        confidence_score: 92,
        recommendation_reasoning: [
          '顧客ID:C12345は2024年6月に同業界で「システム構築」の購買実績（金額150万円）があり、今回の提案との類似度が92%です。',
          '2024年3月に「システム保守」で80万円の購買実績があり、継続的なIT投資ニーズが確認されています。',
          '2023年12月に「データ分析」で200万円の大型案件の実績があり、高額投資への決定実績があります。',
          '2023年9月に「システム構築」で120万円の投資実績があり、同一カテゴリの購買パターンが確認できます。',
          '2023年6月に「コンサルティング」で50万円の案件があり、戦略的な投資判断を行う傾向が見られます。'
        ],
        supporting_data: purchase_history,
        recommendation_timestamp: '2024-01-15T11:00:00Z'
      })
    };

    // 推奨支援システムのAPI呼び出し
    const result = await generateRecommendation(new_proposal, stub_ai_engine);

    // 推奨根拠セクション内の検証
    expect(result.recommendation_reasoning).toBeDefined();
    expect(Array.isArray(result.recommendation_reasoning)).toBe(true);
    expect(result.recommendation_reasoning.length).toBeGreaterThanOrEqual(5);

    // 各根拠に顧客ID、購買日、商品カテゴリ、購買金額、業界が含まれていることを確認
    expect(result.recommendation_reasoning[0]).toMatch(/C12345/);
    expect(result.recommendation_reasoning[0]).toMatch(/2024年6月/);
    expect(result.recommendation_reasoning[0]).toMatch(/システム構築/);
    expect(result.recommendation_reasoning[0]).toMatch(/150万円/);
    expect(result.recommendation_reasoning[0]).toMatch(/92%/);

    expect(result.recommendation_reasoning[1]).toMatch(/2024年3月/);
    expect(result.recommendation_reasoning[1]).toMatch(/システム保守/);
    expect(result.recommendation_reasoning[1]).toMatch(/80万円/);

    expect(result.recommendation_reasoning[2]).toMatch(/2023年12月/);
    expect(result.recommendation_reasoning[2]).toMatch(/データ分析/);
    expect(result.recommendation_reasoning[2]).toMatch(/200万円/);

    expect(result.recommendation_reasoning[3]).toMatch(/2023年9月/);
    expect(result.recommendation_reasoning[3]).toMatch(/システム構築/);
    expect(result.recommendation_reasoning[3]).toMatch(/120万円/);

    expect(result.recommendation_reasoning[4]).toMatch(/2023年6月/);
    expect(result.recommendation_reasoning[4]).toMatch(/コンサルティング/);
    expect(result.recommendation_reasoning[4]).toMatch(/50万円/);

    // 信頼度スコアが0～100の範囲内であることを確認
    expect(result.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result.confidence_score).toBeLessThanOrEqual(100);
    expect(result.confidence_score).toBe(92);

    // 推奨根拠セクションの形式が自然言語形式であることを確認
    result.recommendation_reasoning.forEach((reasoning_item) => {
      expect(typeof reasoning_item).toBe('string');
      expect(reasoning_item.length).toBeGreaterThan(0);
    });
  });
});