import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { determineSuccessPatternMatrixApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-383
  test('成功商談パターンマトリクスが null のとき処理が中断される', () => {
    const dealId = 'DEAL-001';
    const businessStage = '提案段階';
    const customerIndustry = '製造業';
    const successPatternMatrix = null;

    expect(() => {
      determineSuccessPatternMatrixApplicability({
        dealId,
        businessStage,
        customerIndustry,
        successPatternMatrix,
      });
    }).toThrow(/成功商談パターンマトリクス/);
  });
});