import { evaluateImplementabilityScore } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 実装可能性スコア算出', () => {
  // SCEN-1364
  test('提案スケジュールデータが空のとき実装可能性スコアが計算できない', () => {
    const emptyScheduleData: any[] = [];
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({ score: 0 })
    };

    const result = evaluateImplementabilityScore(
      emptyScheduleData,
      mockAIEngine
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_SCHEDULE_DATA',
      errorMessage: '提案スケジュールデータが空です。スコア計算を実行できません',
      systemLog: '実装可能性スコア算出失敗: スケジュールデータが空のため処理中断',
      userMessage: 'スケジュール情報が不足しているため、実装可能性の評価ができません。提案内容を入力後、再度お試しください'
    });
  });
});