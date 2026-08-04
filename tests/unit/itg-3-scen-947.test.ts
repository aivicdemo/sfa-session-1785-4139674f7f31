import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 権限チェックと推奨生成', () => {
  let mockGetUserPermissions: jest.Mock;
  let mockAIGenerateRecommendation: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUserPermissions = jest.fn();
    mockAIGenerateRecommendation = jest.fn();
  });

  // SCEN-947
  test('ログインユーザーの権限情報が確認され、営業担当者のアクセス権限内でのみ推奨生成処理が実行される', async () => {
    const sessionToken = 'session_token_12345';
    const userId = 'USER-001';
    const customerId = 'CUST-001';
    const productCategory = 'A';

    const userPermissions = {
      role: '営業担当者',
      accessLevel: 3,
      allowedFeatures: ['recommendationGeneration', 'reportView'],
    };

    const recommendationResult = {
      recommendation: '提案アプローチA',
      confidence: 0.85,
    };

    mockGetUserPermissions.mockResolvedValue(userPermissions);
    mockAIGenerateRecommendation.mockResolvedValue(recommendationResult);

    const authenticationService = {
      getUserPermissions: mockGetUserPermissions,
    };

    const aiRecommendationEngine = {
      generateRecommendation: mockAIGenerateRecommendation,
    };

    const newCaseData = {
      customerId: customerId,
      productCategory: productCategory,
    };

    const result = await generateRecommendation(
      sessionToken,
      userId,
      newCaseData,
      authenticationService,
      aiRecommendationEngine
    );

    expect(mockGetUserPermissions).toHaveBeenCalledTimes(1);
    expect(mockGetUserPermissions).toHaveBeenCalledWith(sessionToken);

    expect(mockAIGenerateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIGenerateRecommendation).toHaveBeenCalledWith(newCaseData);

    expect(result.status).toBe('success');
    expect(result.recommendation).toBe('提案アプローチA');
    expect(result.confidence).toBe(0.85);
    expect(result.userId).toBe(userId);
  });
});