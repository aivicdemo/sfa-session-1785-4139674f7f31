import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateBehaviorPatternMatchScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-390
  test('顧客対応パターンが成功パターンと完全に合致している場合、合致度が1.0として数値化される', () => {
    const successPattern = [
      { step: '初期接触', completed: true },
      { step: 'ニーズヒアリング', completed: true },
      { step: '提案', completed: true },
      { step: '成約', completed: true }
    ];

    const salesPersonActualPattern = [
      { step: '初期接触', completed: true },
      { step: 'ニーズヒアリング', completed: true },
      { step: '提案', completed: true },
      { step: '成約', completed: true }
    ];

    const matchScore = calculateBehaviorPatternMatchScore(
      successPattern,
      salesPersonActualPattern
    );

    expect(matchScore).toBe(1.0);
  });
});