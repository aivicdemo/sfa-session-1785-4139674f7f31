import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能 - AIエージェント呼び出し失敗時の代替処理', () => {
  test('SCEN-1588: AIエージェント呼び出しの類似パターン検索が失敗したとき、代替処理が実行される', async () => {
    // 新規案件データ
    const newDealInput = {
      customerId: 'CUST_NEW_001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      dealConditions: {
        budget: 5000000,
        timeline: '2024-Q2',
        decisionMaker: 'CFO',
        painPoints: ['cost_reduction', 'efficiency']
      }
    };

    // モック: AIRecommendationEngine.findSimilarPatterns が3回失敗する
    let callCount = 0;
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(async () => {
        callCount++;
        if (callCount <= 3) {
          // 指数バックオフの待機時間を検証するため、呼び出し時刻を記録
          if (callCount === 1) {
            // 1秒待機後の1回目失敗
            throw new Error('API timeout');
          }
          if (callCount === 2) {
            // 2秒待機後の2回目失敗
            throw new Error('API timeout');
          }
          if (callCount === 3) {
            // 4秒待機後の3回目失敗
            throw new Error('API timeout');
          }
        }
        return [];
      }),
      generateRecommendation: jest.fn(async () => ({
        approachId: 'APPROACH_001',
        description: 'Standard proposal approach',
        confidence: 0.75
      })),
      explainRecommendationReasoning: jest.fn(async () => 'Explanation text'),
      evaluatePatternRelevance: jest.fn(async () => 0.65)
    };

    // 推奨パターンマスタの代替データ
    const successPatternMasterData = [
      {
        patternId: 'PATTERN_001',
        industry: 'manufacturing',
        size: 'large',
        successRate: 0.92,
        approach: 'Cost optimization strategy with ROI focus',
        approachDetail: 'Focus on efficiency',
        applicableAmount: 4000000,
        applicableTimeline: 'Q1-Q2'
      },
      {
        patternId: 'PATTERN_002',
        industry: 'manufacturing',
        size: 'large',
        successRate: 0.88,
        approach: 'Digital transformation approach',
        approachDetail: 'Tech modernization',
        applicableAmount: 3000000,
        applicableTimeline: 'Q2-Q3'
      },
      {
        patternId: 'PATTERN_003',
        industry: 'manufacturing',
        size: 'medium',
        successRate: 0.85,
        approach: 'Supply chain optimization',
        approachDetail: 'Logistics improvement',
        applicableAmount: 2000000,
        applicableTimeline: 'Q1-Q4'
      }
    ];

    // 推奨パターンマスタをクエリするモック
    const mockPatternRepository = {
      queryTopSuccessPatterns: jest.fn(async (industry: string, size: string) => {
        return successPatternMasterData
          .filter(p => p.industry === industry && p.size === size)
          .sort((a, b) => b.successRate - a.successRate)
          .slice(0, 1);
      })
    };

    // 結果を格納するオブジェクト
    const result = await generateRecommendation(
      newDealInput,
      mockAIEngine,
      mockPatternRepository
    );

    // 検証1: AIエージェント呼び出しが3回実行されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);

    // 検証2: 推奨パターンマスタへのクエリが実行されたことを確認
    expect(mockPatternRepository.queryTopSuccessPatterns).toHaveBeenCalledWith(
      'manufacturing',
      'large'
    );

    // 検証3: 統計的に上位の成功パターン（successRate 0.92）が返却されたことを確認
    expect(result.recommendation).toEqual(
      expect.objectContaining({
        patternId: 'PATTERN_001',
        successRate: 0.92,
        approach: 'Cost optimization strategy with ROI focus'
      })
    );

    // 検証4: 推奨理由の説明文が簡略版（approachDetail）で返却されていることを確認
    expect(result.explanation).toBe('Focus on efficiency');
    expect(result.explanation.length).toBeLessThan(100);

    // 検証5: ユーザー向けメッセージが代替処理実行を示すメッセージを含んでいることを確認
    expect(result.userMessage).toContain('推奨の生成に一時的な遅延が発生しています');
    expect(result.userMessage).toContain('過去の推奨履歴から類似案件を表示します');

    // 検証6: フォールバックが発動したことを示すフラグを確認
    expect(result.isFallback).toBe(true);

    // 検証7: 外部API呼び出しが全て失敗したことを示す情報を確認
    expect(result.externalApiStatus).toBe('failed_after_retries');
  });
});