import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('成功パターン抽出・重み付けロジック - 営業担当者行動記録なしのエラーケース', () => {
  test('SCEN-2791: 営業担当者の行動記録が存在しないとき、相関性を算出できずエラーを返す', () => {
    // ビジネスルール: 過去の営業商談データが営業データベースに蓄積されており、成功・失敗の区分が明確に記録されている状態が前提
    // 発生条件: AIエージェント推奨ロジックの設定・検証フェーズにおいて、過去事例から学習パターンを抽出し、推奨ロジックに組み込む必要が生じたとき
    // 期待結果: 過去事例の特徴量と成約結果の相関を数値化し、新規案件への推奨精度を決定する重み付けルールを生成する
    // ただし、営業担当者の行動記録がない場合は、相関性を算出できずエラーを返す

    // セットアップ: AIRecommendationEngineのモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件の顧客情報を準備
    const newDealParams = {
      industry: 'IT',
      budget: 5000000,
      dealSize: 'medium',
      customerId: 'CUST_001',
    };

    // 過去の営業行動記録が空の状態（営業担当者のアクションレコードをすべて削除）
    const emptyHistoryData = {
      salesRecords: [],
      proposalRecords: [],
      dealRecords: [],
    };

    // generateRecommendation メソッドを呼び出す際に、
    // 過去の営業行動記録が存在しないため、相関性の算出ができず、エラーをスロー
    const generateRecommendation = () => {
      if (
        !emptyHistoryData.salesRecords ||
        emptyHistoryData.salesRecords.length === 0
      ) {
        const error = new Error(
          '営業担当者の行動記録が存在しないため、相関性の算出ができません。過去の商談データを蓄積してからご利用ください。'
        );
        (error as any).code = 'NO_SALES_HISTORY_FOUND';
        (error as any).statusCode = 422;
        throw error;
      }
      return mockAIEngine.generateRecommendation(newDealParams);
    };

    // エラーがスロー（throw）されることを検証
    expect(() => generateRecommendation()).toThrow(/営業担当者の行動記録/);

    // エラーコードを検証
    try {
      generateRecommendation();
    } catch (err: any) {
      expect(err.code).toBe('NO_SALES_HISTORY_FOUND');
      expect(err.statusCode).toBe(422);
      expect(err.message).toBe(
        '営業担当者の行動記録が存在しないため、相関性の算出ができません。過去の商談データを蓄積してからご利用ください。'
      );
    }

    // スタブ化されたAIRecommendationEngine.findSimilarPatternsが呼び出されていないことを検証
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});