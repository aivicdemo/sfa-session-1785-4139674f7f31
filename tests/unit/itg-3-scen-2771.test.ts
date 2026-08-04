import { describe, test, expect, beforeEach } from '@jest/globals';
import { RecommendationReasoningVisualizer } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2771
  test('推奨根拠の可視化機能 - 生成された重み付けルールから推奨根拠の説明テキストが構成される', () => {
    // Arrange: 重み付けルール群とスタブからの説明テキストを定義
    const weightedRules = [
      {
        name: '顧客規模マッチ',
        weight: 0.35,
        score: 0.92,
      },
      {
        name: '業界適合性',
        weight: 0.30,
        score: 0.88,
      },
      {
        name: '過去成功事例数',
        weight: 0.25,
        score: 0.95,
      },
      {
        name: '提案タイミング適切性',
        weight: 0.10,
        score: 0.78,
      },
    ];

    const explanationTexts = [
      '顧客規模マッチ(重要度35%)：貴社のターゲット顧客規模と合致しており、成功確度が高い',
      '業界適合性(重要度30%)：同業界での過去成功事例が多数存在する',
      '過去成功事例数(重要度25%)：類似商談パターンが過去95件成功している',
      '提案タイミング適切性(重要度10%)：現在の商談進捗段階での提案が効果的',
    ];

    // Act: RecommendationReasoningVisualizerをインスタンス化し、generateReasoningText()を実行
    const visualizer = new RecommendationReasoningVisualizer(
      weightedRules,
      explanationTexts
    );
    const generatedText = visualizer.generateReasoningText();

    // Assert: 生成された説明テキストが期待される構造で構成されていることを検証

    // ①4つのルール全てが重み付け順(0.35→0.30→0.25→0.10)で記載されていること
    const rule1Index = generatedText.indexOf('顧客規模マッチ');
    const rule2Index = generatedText.indexOf('業界適合性');
    const rule3Index = generatedText.indexOf('過去成功事例数');
    const rule4Index = generatedText.indexOf('提案タイミング適切性');

    expect(rule1Index).toBeGreaterThanOrEqual(0);
    expect(rule2Index).toBeGreaterThan(rule1Index);
    expect(rule3Index).toBeGreaterThan(rule2Index);
    expect(rule4Index).toBeGreaterThan(rule3Index);

    // ②各ルール説明に『重要度XX%』の数値が含まれていること
    expect(generatedText).toMatch(/重要度35%/);
    expect(generatedText).toMatch(/重要度30%/);
    expect(generatedText).toMatch(/重要度25%/);
    expect(generatedText).toMatch(/重要度10%/);

    // ③スタブから返された説明テキストがそのまま組み込まれていること
    expect(generatedText).toContain(
      '貴社のターゲット顧客規模と合致しており、成功確度が高い'
    );
    expect(generatedText).toContain('同業界での過去成功事例が多数存在する');
    expect(generatedText).toContain('類似商談パターンが過去95件成功している');
    expect(generatedText).toContain(
      '現在の商談進捗段階での提案が効果的'
    );

    // ④ルール間に適切な句読点や接続詞が挿入され、営業担当者が読みやすい自然言語文として統合されていること
    expect(generatedText).toMatch(/[。、，]/);

    // ⑤テキスト全体の文字数が200～500文字の範囲内であること
    expect(generatedText.length).toBeGreaterThanOrEqual(200);
    expect(generatedText.length).toBeLessThanOrEqual(500);
  });
});