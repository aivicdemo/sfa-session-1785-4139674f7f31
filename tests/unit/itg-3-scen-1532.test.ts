import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを推奨する機能', () => {
  test('SCEN-1532: 提案内容データが欠けている場合、マッチング処理は継続され該当顧客群は返却されない', () => {
    // Setup: 提案内容の必須フィールドを欠落させたテストデータ
    const incomplete_proposal_content = {
      proposalAmount: null, // 必須フィールド欠落
      proposalDeadline: '2024-12-31',
      customerNeedsSummary: 'システム導入支援',
      productCategory: 'クラウドサービス',
      customerIndustry: '金融',
      customerSize: 'large',
    };

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        matched_customers: [],
        processing_continued: true,
        message: '提案データ不完全のため顧客マッチング結果は返却されませんでした',
      }),
    };

    // Execute: 欠落したデータを含む提案内容オブジェクトで処理実行
    const result = findSimilarPatterns(
      incomplete_proposal_content,
      mock_ai_engine
    );

    // Verify: AIRecommendationEngineのfindSimilarPatternsが呼び出されたか確認
    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledWith(
      incomplete_proposal_content
    );

    // Verify: マッチング処理が中断されず継続されていることを確認
    expect(result.processing_continued).toBe(true);

    // Verify: 顧客群配列が空配列として返却されたことを確認
    expect(result.matched_customers).toEqual([]);
    expect(Array.isArray(result.matched_customers)).toBe(true);
    expect(result.matched_customers.length).toBe(0);

    // Verify: 処理ログに期待されるメッセージが記録されたか確認
    expect(result.message).toBe(
      '提案データ不完全のため顧客マッチング結果は返却されませんでした'
    );
  });
});