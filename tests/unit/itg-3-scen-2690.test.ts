import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2690
  test('推奨内容の根拠表示を同じ入力で2回実行したとき、同じ結果が返される', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn((input: {
        dealConditions: {
          industry: string;
          challenge: string;
          budget: number;
        };
      }): string => {
        return 'この案件はIT業界のコスト削減課題であり、過去事例から同様の業種・課題パターンで成功した提案アプローチが存在します。予算500万円は業界平均と一致しており、提案内容の実装可能性が高いと判定されています。成功パターンマッチ度は85%です。';
      }),
    };

    const testInput = {
      dealConditions: {
        industry: 'IT',
        challenge: 'コスト削減',
        budget: 5000000,
      },
    };

    const result1 = explainRecommendationReasoning(testInput, mockAIEngine);
    const result2 = explainRecommendationReasoning(testInput, mockAIEngine);

    expect(result1).toBe(result2);
    expect(result1).toBe('この案件はIT業界のコスト削減課題であり、過去事例から同様の業種・課題パターンで成功した提案アプローチが存在します。予算500万円は業界平均と一致しており、提案内容の実装可能性が高いと判定されています。成功パターンマッチ度は85%です。');
  });
});