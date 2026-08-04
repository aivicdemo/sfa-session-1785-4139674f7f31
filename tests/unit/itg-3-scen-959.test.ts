import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能 - AIRecommendationEngine タイムアウト再試行', () => {
  test('SCEN-959: generateRecommendation がタイムアウト（30秒超）したとき、最大3回の再試行が実行され、内部パターンマスタが返却される', async () => {
    // Arrange: スタブ呼び出し回数を追跡するカウンター
    let callCount = 0;
    const timeoutSimulationMs = 31000; // 30秒超のタイムアウト

    // AIRecommendationEngine スタブ: タイムアウトをシミュレート
    const mockAIEngine = {
      generateRecommendation: jest.fn(async () => {
        callCount++;
        // 30秒超のタイムアウトをシミュレート
        await new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('API timeout exceeded 30s')),
            timeoutSimulationMs
          )
        );
      }),
    };

    // 新規案件の顧客・商談条件を入力
    const newCaseInput = {
      customerName: 'XYZ Corporation',
      industry: 'Manufacturing',
      budgetRange: 5000000,
      dealStage: 'Discovery',
      salesPersonExperience: 'Mid-level',
    };

    // Act: generateRecommendation を呼び出し
    // 最大3回の再試行（初回1秒、2回目2秒の指数バックオフ）を含む
    const result = await generateRecommendation(
      newCaseInput,
      mockAIEngine
    );

    // Assert: スタブ呼び出し回数が3回であることを確認（初回1回 + 再試行2回）
    expect(callCount).toBe(3);

    // Assert: 4回目の呼び出しが実行されていないことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // Assert: 最終的なエラーハンドリングにより、内部の推奨パターンマスタから
    // 統計的に上位の成功パターンが返却されることを確認
    expect(result).toBeDefined();
    expect(result.proposalApproach).toBeDefined();
    expect(result.proposalApproach.source).toBe('fallback_pattern_master');
    
    // Assert: 推奨パターンが統計的に上位のパターンであることを確認
    // （成功頻度スコアが高いこと）
    expect(result.proposalApproach.successFrequencyScore).toBeGreaterThanOrEqual(80);

    // Assert: 根拠説明が簡略版で表示されることを確認
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.length).toBeLessThanOrEqual(200);
    expect(result.reasoning).toContain('マスタから');

    // Assert: 再試行タイミングが指数バックオフで実行されたことを確認するため、
    // 呼び出しの時間差が期待値に近いことを確認（概略）
    // （実装側で指数バックオフ 1s → 2s が正確に実装されているか）
    expect(result.retryAttempts).toBe(3);
    expect(result.backoffDelays).toEqual([1000, 2000]);
  });
});