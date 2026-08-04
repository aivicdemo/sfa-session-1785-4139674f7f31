import { validateTrainingData } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-177
  test('学習データ検証と推論実行判定の統合機能 - 同じ入力パラメータで学習データ検証を2回実行して同じ結果が返却される', () => {
    const aiRecommendationEngineStub = {
      validateTrainingData: jest.fn((params: {
        customerIndustry: string;
        dealSize: string;
        proposalCategory: string;
      }) => ({
        validationId: 'val-2024-001',
        patternMatchScore: 0.87,
        validationTimestamp: '2024-01-15T11:00:00Z',
        isValid: true,
      })),
    };

    const inputParams = {
      customerIndustry: 'IT',
      dealSize: '1000万円',
      proposalCategory: 'クラウド導入',
    };

    const firstValidationResult = validateTrainingData(inputParams, aiRecommendationEngineStub);
    const secondValidationResult = validateTrainingData(inputParams, aiRecommendationEngineStub);

    expect(firstValidationResult.validationId).toBe(secondValidationResult.validationId);
    expect(firstValidationResult.validationId).toBe('val-2024-001');
    expect(firstValidationResult.patternMatchScore).toBe(secondValidationResult.patternMatchScore);
    expect(firstValidationResult.patternMatchScore).toBe(0.87);
    expect(firstValidationResult.validationTimestamp).toBe(secondValidationResult.validationTimestamp);
    expect(firstValidationResult.validationTimestamp).toBe('2024-01-15T11:00:00Z');
    expect(firstValidationResult.isValid).toBe(secondValidationResult.isValid);
    expect(firstValidationResult.isValid).toBe(true);
    expect(aiRecommendationEngineStub.validateTrainingData).toHaveBeenCalledTimes(2);
    expect(aiRecommendationEngineStub.validateTrainingData).toHaveBeenCalledWith(inputParams);
  });
});