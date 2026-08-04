import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('推奨根拠表示機能', () => {
  test('SCEN-1576: 根拠情報が0件のとき、エラーハンドリングが実行される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
    };

    const testNewCaseData = {
      customerId: 'TEST-001',
      dealCondition: 'standard_pattern',
    };

    const mockPatternMasterWithFallback = {
      patternId: 'PATTERN-001',
      simplifiedExplanation: '標準的な営業パターンです',
    };

    // Act & Assert
    const result = explainRecommendationReasoning(
      testNewCaseData,
      mockAIRecommendationEngine,
      mockPatternMasterWithFallback
    );

    // (1) エラーログに『根拠情報が取得できません』というメッセージが記録される
    expect(result.errorLog).toMatch(/根拠情報が取得できません/);

    // (2) 画面には『推奨根拠の生成に失敗しました。営業担当者にお問い合わせください』というエラーメッセージが表示される
    expect(result.userMessage).toBe(
      '推奨根拠の生成に失敗しました。営業担当者にお問い合わせください'
    );

    // (3) 根拠情報表示領域は空状態（根拠リスト: 空配列）となる
    expect(result.reasoningList).toEqual([]);

    // (4) 代替表示として推奨パターンマスタの簡略版根拠説明が表示される
    expect(result.fallbackExplanation).toBe('標準的な営業パターンです');

    // (5) エラーコードは予期された値である
    expect(result.errorCode).toBe('REASONING_DATA_EMPTY');
  });
});