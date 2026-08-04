import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-962: 推奨根拠情報が空オブジェクト{}のとき、根拠表示処理が開始されず警告が返される', () => {
    const emptyReasoningData = {};

    const result = visualizeRecommendationReasoning(emptyReasoningData);

    expect(result).toEqual({
      code: 'EMPTY_REASONING_DATA',
      message: '推奨根拠情報が不足しています。根拠の詳細表示ができません。',
      severity: 'warning',
      displayMessage: '推奨根拠が利用できません',
      isProcessed: false,
    });
  });
});