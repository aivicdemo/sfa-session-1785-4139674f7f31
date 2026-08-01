import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-493
  test('推論対象の営業担当者提案内容が0件の場合、精度スコアが算出されない', () => {
    const salesPersonId = 'SP-001';
    const proposalData: Array<{
      id: string;
      salesPersonId: string;
      content: string;
      createdAt: Date;
    }> = [];

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = calculateInferenceAccuracyScore(salesPersonId, proposalData);

    expect(result).toBeNull();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringMatching(/提案内容が0件のため精度スコア算出をスキップしました/)
    );

    consoleLogSpy.mockRestore();
  });
});