import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - AIエージェント失敗時の内部パターンマスタ代替', () => {
  test('SCEN-916: AIRecommendationEngine失敗時に内部パターンマスタから統計的に最上位のパターンが代替推奨される', async () => {
    // === セットアップ: AIエージェント失敗をシミュレート ===
    let callCount = 0;
    const aiEngineStub = {
      generateRecommendation: jest.fn(async () => {
        callCount++;
        if (callCount <= 3) {
          throw new Error('Network timeout');
        }
        return { approach: 'fallback', confidence: 0 };
      }),
    };

    // === セットアップ: 推奨パターンマスタの確認 ===
    const recommendationPatterns = [
      {
        id: 'pattern_001',
        name: 'ハイタッチ営業モデル',
        successRate: 80,
        applicableSegments: ['mid-market', 'manufacturing'],
      },
      {
        id: 'pattern_002',
        name: 'オンライン提案',
        successRate: 75,
        applicableSegments: ['mid-market', 'manufacturing'],
      },
    ];

    // === 入力: 新規案件データ ===
    const newDealData = {
      customerSize: 'mid-market',
      industry: 'manufacturing',
      budget: 5000000,
    };

    // === 実行 ===
    const result = await generateRecommendationWithFallback(
      newDealData,
      aiEngineStub,
      recommendationPatterns
    );

    // === 検証1: AIエージェント呼び出しが指数バックオフで最大3回試みられたこと ===
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // === 検証2: 内部パターンマスタから成功率最上位の『ハイタッチ営業モデル』が返却されること ===
    expect(result.recommendedApproach).toBe('ハイタッチ営業モデル');
    expect(result.successRate).toBe(80);

    // === 検証3: 『内部パターンマスタから自動選定』フラグが付与されていること ===
    expect(result.isFromFallback).toBe(true);

    // === 検証4: 根拠説明が簡略版（テンプレート形式）で返却されること ===
    expect(result.reasoning).toMatch(/過去案件での成功率/);
    expect(result.reasoning).toMatch(/80%/);
    expect(result.reasoning).toContain('ハイタッチ営業モデル');

    // === 検証5: ユーザーインターフェース表示メッセージが返却されること ===
    expect(result.uiMessage).toMatch(/推奨の生成に遅延が発生しています/);
    expect(result.uiMessage).toMatch(/過去の推奨履歴から類似案件を表示します/);

    // === 検証6: 返却結果のスキーマが完全であること ===
    expect(result).toHaveProperty('recommendedApproach');
    expect(result).toHaveProperty('successRate');
    expect(result).toHaveProperty('isFromFallback');
    expect(result).toHaveProperty('reasoning');
    expect(result).toHaveProperty('uiMessage');
  });
});