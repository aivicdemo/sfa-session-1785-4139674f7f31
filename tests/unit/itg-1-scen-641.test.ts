import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateDivergenceAndAlignment } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-641
  it('乖離度・合致度の計算に端数が発生する入力値のとき、小数点以下が正しく丸められる', () => {
    // Arrange
    const proposalPatternCount = 3;
    const standardStepCount = 7;

    // Act
    const result = calculateDivergenceAndAlignment({
      proposalPatternCount,
      standardStepCount,
    });

    // Assert
    // 乖離度 = (標準ステップ数 - 提案パターン数) / 標準ステップ数
    // 乖離度 = (7 - 3) / 7 = 4 / 7 = 0.571428... → 0.57（小数点以下2桁に四捨五入）
    expect(result.divergence).toBe(0.57);

    // 合致度 = 提案パターン数 / 標準ステップ数
    // 合致度 = 3 / 7 = 0.428571... → 0.43（小数点以下2桁に四捨五入）
    expect(result.alignment).toBe(0.43);

    // 乖離度 + 合致度 = 1.00 となることを確認
    expect(result.divergence + result.alignment).toBe(1.0);
  });
});