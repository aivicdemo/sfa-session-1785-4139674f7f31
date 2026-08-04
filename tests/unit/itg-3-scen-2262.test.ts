import { describe, test, expect, beforeEach } from '@jest/globals';
import { findSimilarPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2262
  test('商談IDが未設定のとき、過去パターンの照合がエラーになる', () => {
    const inputData = {
      dealId: null,
      customerName: 'サンプル企業',
      industry: 'IT',
      companySize: 'large',
      currentProposal: {
        productCategory: 'cloud_service',
        proposalAmount: 5000000
      }
    };

    const result = findSimilarPatterns(inputData);

    expect(result).toHaveProperty('error');
    expect(result.error).toBeDefined();
    expect(result.error.message).toBe('商談IDが未設定です。過去パターンの照合を実行できません');
    expect(result.error.code).toBe('MISSING_DEAL_ID');
    expect(result.error.statusCode).toBe(400);
    expect(result.similarPatterns).toBeUndefined();
    expect(result.fallbackPatterns).toBeUndefined();
  });
});