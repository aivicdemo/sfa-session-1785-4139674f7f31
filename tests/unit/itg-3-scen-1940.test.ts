import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1940: 推奨内容の根拠表示機能 - 根拠の有効期限が期限内のときに根拠が表示対象となる', () => {
    // Arrange: 根拠オブジェクトを準備
    const reasonId = 'REASON-001';
    const content = '顧客は過去3年で同業他社への乗り換え事例が少ない';
    const now = new Date('2025-01-15T10:00:00Z');
    const expiryDate = new Date('2025-02-14T10:00:00Z'); // 現在時刻から+30日後
    const isActive = true;

    const mockReason = {
      reasonId: reasonId,
      content: content,
      expiryDate: expiryDate.toISOString(),
      isActive: isActive,
    };

    // AIRecommendationEngineのスタブを設定
    const aiEngineMock = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(mockReason),
    };

    // 現在時刻をモック（テスト実行時刻を固定）
    const mockCurrentDate = now;
    jest.spyOn(global, 'Date').mockImplementation(() => mockCurrentDate as any);

    // Act: 推奨内容根拠表示機能のメイン処理を実行
    const recommendationId = 'REC-2025-001';
    const result = displayRecommendationReasoning(
      recommendationId,
      aiEngineMock
    );

    // Assert: 根拠の有効期限チェックが実施され、表示対象判定が正しく行われたかを確認
    expect(result).toEqual({
      isDisplayable: true,
      reasonId: reasonId,
      content: content,
      isActive: isActive,
      isWithinValidity: true,
    });

    // UIに根拠が描画されているか確認
    expect(result.isDisplayable).toBe(true);
    expect(result.reasonId).toBe('REASON-001');
    expect(result.content).toBe('顧客は過去3年で同業他社への乗り換え事例が少ない');
    expect(result.isActive).toBe(true);
    expect(result.isWithinValidity).toBe(true);

    // AIエージェンのメソッドが呼び出されたことを確認
    expect(aiEngineMock.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId
    );

    // クリーンアップ
    jest.restoreAllMocks();
  });
});