import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1410: 提案内容と顧客制約条件の自動照合機能 - スケジュール制約が月末と月初をまたぐとき、実装可能性が正しく判定される', () => {
    // Arrange: テスト対象の提案スケジュール制約を設定
    const proposalSchedule = {
      startDate: '2024-01-28',
      endDate: '2024-02-02',
    };

    // 顧客の制約条件を設定
    const customerConstraints = {
      unavailablePeriods: [
        { startDate: '2024-01-25', endDate: '2024-01-31', reason: '月末業務多忙' },
        { startDate: '2024-02-01', endDate: '2024-02-05', reason: '月初決算処理中' },
      ],
    };

    // AIRecommendationEngineのスタブを作成
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.0,
        reason: 'スケジュール制約により実装不可',
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          scheduleStartDate: '2024-02-06',
          scheduleEndDate: '2024-02-10',
          successRate: 0.95,
        },
      ]),
    };

    // Act: 提案内容と顧客制約条件の自動照合機能を実行
    const evaluationResult = evaluatePatternRelevance(
      proposalSchedule,
      customerConstraints,
      mockAIEngine
    );

    // Assert: 判定結果のステータスコードと詳細メッセージを確認
    expect(evaluationResult.status).toBe('実装不可');
    expect(evaluationResult.detailedMessage).toContain(
      '提案されたスケジュール（2024-01-28～2024-02-02）は顧客制約条件（月末2024-01-25～2024-01-31、月初2024-02-01～2024-02-05の作業不可）と抵触するため実装不可'
    );

    // 推奨パターンマスタから代替スケジュール案が提示されることを確認
    expect(evaluationResult.alternativeSchedules).toBeDefined();
    expect(evaluationResult.alternativeSchedules).toHaveLength(1);
    expect(evaluationResult.alternativeSchedules[0].startDate).toBe('2024-02-06');
    expect(evaluationResult.alternativeSchedules[0].endDate).toBe('2024-02-10');
    expect(evaluationResult.alternativeSchedules[0].successRate).toBe(0.95);

    // AIエンジンが正しく呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalSchedule,
      customerConstraints
    );
  });
});