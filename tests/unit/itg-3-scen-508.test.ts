import { decideSalesCoachingDirection } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定機能', () => {
  // SCEN-508
  test('指導内容が空文字列のとき、エラーが発生する', () => {
    const salesPersonId = 'SA001';
    const dealConditions = {
      customerIndustry: 'IT',
      budget: 5000000,
      dealStage: 'proposal',
    };
    const coachingContent = '';

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
    };

    expect(() =>
      decideSalesCoachingDirection(
        salesPersonId,
        dealConditions,
        coachingContent,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/指導内容/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});