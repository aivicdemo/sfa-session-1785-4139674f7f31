import { evaluateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2173: 提案プロセス乖離度の数値化 - 1件のデータから乖離度が算出される', () => {
    // モックデータの準備
    const proposalData = {
      proposalId: 'PROP-001',
      proposalContent: '顧客A向けのクラウド導入支援',
      proposalDateTime: new Date('2026-08-01T00:00:00Z'),
      proposer: '営業太郎',
    };

    const standardProcessId = 'STD-PROC-001';

    // AIRecommendationEngine.evaluatePatternRelevance のスタブ
    const mockAiEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        deviationScore: 0.23,
        isApplicable: true,
      }),
    };

    // テスト対象関数の実行
    const result = evaluateProposalProcessDeviation(
      [proposalData],
      standardProcessId,
      mockAiEngine
    );

    // 期待結果の検証
    expect(result).toEqual({
      deviationScore: 0.23,
      proposalId: 'PROP-001',
      standardProcessId: 'STD-PROC-001',
      calculatedAt: expect.any(String),
    });

    // スコアが小数第2位までの数値であることを確認
    expect(typeof result.deviationScore).toBe('number');
    expect(result.deviationScore).toBeCloseTo(0.23, 2);

    // AIエンジンが正しく呼び出されたことを確認
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalData,
      standardProcessId
    );

    // タイムスタンプが ISO 8601 形式であることを確認
    expect(typeof result.calculatedAt).toBe('string');
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(result.calculatedAt)).toBe(
      true
    );
  });
});