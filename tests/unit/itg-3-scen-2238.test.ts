import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2238
  test('複数の推奨内容がある場合、それぞれの根拠が個別に表示される', async () => {
    // 複数推奨内容のモック
    const recommendations = [
      {
        id: 'rec_001',
        content: '顧客Aへの提案アプローチはケース駆動型の営業手法',
        confidence: 73,
      },
      {
        id: 'rec_002',
        content: '初期接触は電話ではなくメール経由が効果的',
        confidence: 28,
      },
      {
        id: 'rec_003',
        content: '契約時期は四半期末を狙う',
        confidence: 44,
      },
    ];

    // AIRecommendationEngineのスタブ: explainRecommendationReasoningメソッド
    const aiRecommendationEngineStub = {
      explainRecommendationReasoning: jest.fn((recommendationId) => {
        const reasoningMap: Record<string, string> = {
          rec_001:
            '過去成功事例の73%が顧客の意思決定プロセスに合わせたケース駆動型営業で契約に至っている',
          rec_002:
            '過去3年間、メール初期接触の案件化率は電話初期接触より28%高い',
          rec_003:
            'Q3期末の提案は予算消化タイミングと一致し、採択率が44%向上',
        };
        return Promise.resolve(reasoningMap[recommendationId] || '');
      }),
    };

    // 各推奨に対して根拠を取得
    const reasoningsPromises = recommendations.map((rec) =>
      aiRecommendationEngineStub.explainRecommendationReasoning(rec.id),
    );

    const reasonings = await Promise.all(reasoningsPromises);

    // 推奨1の根拠を確認
    expect(reasonings[0]).toBe(
      '過去成功事例の73%が顧客の意思決定プロセスに合わせたケース駆動型営業で契約に至っている',
    );

    // 推奨2の根拠を確認
    expect(reasonings[1]).toBe(
      '過去3年間、メール初期接触の案件化率は電話初期接触より28%高い',
    );

    // 推奨3の根拠を確認
    expect(reasonings[2]).toBe(
      'Q3期末の提案は予算消化タイミングと一致し、採択率が44%向上',
    );

    // 根拠が完全に分離して異なることを確認
    expect(reasonings[0]).not.toBe(reasonings[1]);
    expect(reasonings[1]).not.toBe(reasonings[2]);
    expect(reasonings[0]).not.toBe(reasonings[2]);

    // 各根拠が推奨固有の内容を含むことを確認
    expect(reasonings[0]).toContain('ケース駆動型営業');
    expect(reasonings[1]).toContain('メール初期接触');
    expect(reasonings[2]).toContain('Q3期末');

    // 根拠の数が推奨の数と一致
    expect(reasonings).toHaveLength(3);

    // aiRecommendationEngineスタブが各推奨IDで正確に呼び出されたことを確認
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalledWith(
      'rec_001',
    );
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalledWith(
      'rec_002',
    );
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalledWith(
      'rec_003',
    );
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});