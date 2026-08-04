import { describe, test, expect, beforeEach } from '@jest/globals';
import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

interface SimilarPattern {
  patternId: string;
  industry: string;
  dealSize: string;
  clientStage: string;
  successRate: number;
  approachMethod: string;
  keyFactors: string[];
}

interface AIRecommendationEngine {
  findSimilarPatterns: (input: CustomerInfo) => Promise<SimilarPattern[]>;
  explainRecommendationReasoning: (patterns: SimilarPattern[], input: CustomerInfo) => Promise<string>;
}

interface CustomerInfo {
  industry: string;
  clientStage: string;
  dealSize: string;
}

describe('推奨根拠説明生成機能', () => {
  test('SCEN-1147: マッチした過去成功パターンが1件のときの根拠説明生成', async () => {
    // Arrange: スタブの過去成功パターン（1件）を準備
    const matchedPattern: SimilarPattern = {
      patternId: 'PAT-001',
      industry: '製造業',
      dealSize: '500万円以上',
      clientStage: '経営層決裁待ち',
      successRate: 0.87,
      approachMethod: 'ROI重視提案',
      keyFactors: ['コスト削減見積提示', '導入事例共有']
    };

    // 顧客情報を準備
    const customerInput: CustomerInfo = {
      industry: '製造業',
      clientStage: '経営層決裁待ち',
      dealSize: '500万円以上'
    };

    // AIRecommendationEngineのスタブを作成
    const stubAIEngine: AIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([matchedPattern]),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          '本案件は製造業の経営層決裁待ちフェーズで、過去の成功事例（成功率87%）PAT-001と条件が一致しています。このパターンではROI重視の提案アプローチが有効であり、特にコスト削減見積提示と導入事例共有が決裁促進の鍵となります。'
        )
    };

    // Act: 推奨根拠説明生成機能を呼び出し
    const generatedExplanation = await explainRecommendationReasoning(
      stubAIEngine,
      customerInput
    );

    // Assert: 生成された説明文が必須要素をすべて含むことを検証
    // (1) マッチしたパターンの識別情報（PAT-001）
    expect(generatedExplanation).toContain('PAT-001');

    // (2) マッチの理由として業種・フェーズ・予算規模の一致
    expect(generatedExplanation).toContain('製造業');
    expect(generatedExplanation).toContain('経営層決裁待ち');

    // (3) 成功率87%という定量的根拠
    expect(generatedExplanation).toContain('87%');

    // (4) 推奨アプローチ方法（ROI重視提案）
    expect(generatedExplanation).toContain('ROI重視');

    // (5) 具体的な実施方法（コスト削減見積提示と導入事例共有）
    expect(generatedExplanation).toContain('コスト削減見積提示');
    expect(generatedExplanation).toContain('導入事例共有');

    // 複数パターン示唆の表現が含まれていないことを検証
    expect(generatedExplanation).not.toMatch(/複数の成功パターン/);
    expect(generatedExplanation).not.toMatch(/複数パターン/);
  });
});