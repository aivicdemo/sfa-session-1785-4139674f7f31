import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-050: [normal] 類似パターン検索機能 - OpenAI API呼び出しが成功した場合に検索結果が正常に返される', async () => {
    // 類似パターン検索結果のスタブレスポンス
    const mockAIResponse = {
      object: 'list',
      data: [
        {
          object: 'embedding',
          embedding: [0.0023064255, 0.001234567, -0.008815289],
          index: 0
        },
        {
          object: 'embedding',
          embedding: [-0.008815289, 0.0045678901, 0.002345678],
          index: 1
        }
      ],
      model: 'text-embedding-ada-002',
      usage: {
        prompt_tokens: 12,
        total_tokens: 12
      }
    };

    // AIRecommendationEngineのスタブ（OpenAI API呼び出しをモック）
    const mockAIEngine = {
      callCount: 0,
      async findSimilarPatternsViaOpenAI(queryEmbedding: number[]): Promise<typeof mockAIResponse> {
        this.callCount++;
        return mockAIResponse;
      }
    };

    // テスト用の商談条件オブジェクト
    const dealCondition = {
      industry: '製造業',
      budgetAmount: 50000000, // 5000万円
      implementationPeriodMonths: 3
    };

    // 過去成功事例マスタデータ（内部保持テーブル）
    const historicalSuccessPatterns = [
      {
        patternId: 'PAT-001',
        patternName: '製造業向け効率化提案',
        contractAmount: 48000000,
        dealPeriodMonths: 3,
        customerIndustry: '製造業',
        successFlag: true,
        embedding: [0.0023064255, 0.001234567, -0.008815289]
      },
      {
        patternId: 'PAT-002',
        patternName: '大規模導入支援パッケージ',
        contractAmount: 52000000,
        dealPeriodMonths: 4,
        customerIndustry: '製造業',
        successFlag: true,
        embedding: [-0.008815289, 0.0045678901, 0.002345678]
      },
      {
        patternId: 'PAT-003',
        patternName: '小規模導入パイロット',
        contractAmount: 15000000,
        dealPeriodMonths: 2,
        customerIndustry: '小売業',
        successFlag: false,
        embedding: [0.001234567, -0.002345678, 0.0089012345]
      }
    ];

    // findSimilarPatternsメソッドの呼び出し
    const result = await findSimilarPatterns(
      dealCondition,
      historicalSuccessPatterns,
      mockAIEngine
    );

    // 検証: 戻り値は類似度スコアが降順で並んだ過去成功事例の配列
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);

    // 各要素が必須フィールドを含むことを確認
    result.forEach((item: any) => {
      expect(item).toHaveProperty('similarityScore');
      expect(item).toHaveProperty('patternId');
      expect(item).toHaveProperty('patternName');
      expect(item).toHaveProperty('contractAmount');
      expect(item).toHaveProperty('dealPeriodMonths');

      // 類似度スコアは0.0～1.0の数値
      expect(typeof item.similarityScore).toBe('number');
      expect(item.similarityScore).toBeGreaterThanOrEqual(0.0);
      expect(item.similarityScore).toBeLessThanOrEqual(1.0);
    });

    // 最初の要素の類似度スコアが後続要素以上であることを確認
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].similarityScore).toBeGreaterThanOrEqual(result[i + 1].similarityScore);
    }

    // OpenAI APIスタブへの呼び出しが正確に1回行われたことを確認
    expect(mockAIEngine.callCount).toBe(1);

    // 具体的な期待値の検証
    // 最初の要素が高い類似度スコアを持つことを確認
    expect(result[0].similarityScore).toBeGreaterThan(0.5);
    expect(result[0].patternId).toBe('PAT-001');
    expect(result[0].patternName).toBe('製造業向け効率化提案');
    expect(result[0].contractAmount).toBe(48000000);
    expect(result[0].dealPeriodMonths).toBe(3);
  });
});