import { hasRecommendationHistory } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-320
  test('推奨履歴テーブルのレコード件数が0件のとき、履歴存在判定メソッドはfalseを返す', () => {
    const mockDatabaseStub = {
      query: jest.fn().mockResolvedValue([]),
    };

    const result = hasRecommendationHistory(mockDatabaseStub);

    expect(result).resolves.toBe(false);
    expect(mockDatabaseStub.query).toHaveBeenCalledWith(
      expect.stringContaining('RecommendationHistory')
    );
  });
});