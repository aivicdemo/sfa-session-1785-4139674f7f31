import { evaluateCorrelation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2894
  test('相関係数がちょうど0.7のときに妥当と判定される', () => {
    // Arrange: 相関係数がちょうど0.7となるテストデータセットを構築
    const recommendationScores = [0.5, 0.6, 0.7, 0.8, 0.9];
    const contractResults = [0.4, 0.5, 0.7, 0.8, 0.95];
    const correlationScore = 0.7;

    const input = {
      recommendationScores: recommendationScores,
      contractResults: contractResults,
      correlationScore: correlationScore,
    };

    // Act: evaluateCorrelation()メソッドを呼び出す
    const result = evaluateCorrelation(input);

    // Assert: 相関係数0.7のとき、判定結果が妥当と判定されることを検証
    expect(result.isFeasible).toBe(true);
    expect(result.status).toBe('VALID');
    expect(result.correlationScore).toBe(0.7);
    expect(result.message).toBe(
      '相関係数0.7：推奨内容と成約実績の相関が妥当と判定されました'
    );
    expect(result.registrationEligible).toBe(true);
  });
});