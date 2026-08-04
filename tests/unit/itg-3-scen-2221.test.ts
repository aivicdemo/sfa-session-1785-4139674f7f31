import { generateRecommendationWithPatternAnalysis } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2221
  test('提案内容と顧客対応パターン分析機能 - 顧客対応記録が複数件のとき全件が標準プロセスと比較される', () => {
    // テストデータ: 同一顧客に対する3件の異なる対応記録
    const customerResponseLogs = [
      {
        logId: 'log-001',
        customerId: 'cust-123',
        logType: 'initial_contact',
        timestamp: '2024-01-10T09:00:00Z',
        actionDescription: '初回接触: 顧客の課題ヒアリング実施',
        duration_minutes: 30,
      },
      {
        logId: 'log-002',
        customerId: 'cust-123',
        logType: 'proposal_presentation',
        timestamp: '2024-01-15T14:30:00Z',
        actionDescription: '提案説明: 営業資料を用いた詳細説明',
        duration_minutes: 60,
      },
      {
        logId: 'log-003',
        customerId: 'cust-123',
        logType: 'follow_up',
        timestamp: '2024-01-20T11:15:00Z',
        actionDescription: 'フォローアップ: 質問対応と追加資料提供',
        duration_minutes: 20,
      },
    ];

    const dealInfo = {
      dealId: 'deal-456',
      customerId: 'cust-123',
      proposedSolution: 'クラウドERPシステム導入',
      proposedBudget: 5000000,
      proposedTimeline: '6ヶ月',
    };

    // AIRecommendationEngineのスタブを設定
    let findSimilarPatternsCallCount = 0;
    let findSimilarPatternsReceivedLogs: typeof customerResponseLogs | null = null;
    let evaluatePatternRelevanceCallCount = 0;
    const evaluatePatternRelevanceInputs: Array<typeof customerResponseLogs[0]> = [];

    const mockAIEngine = {
      findSimilarPatterns: (logs: typeof customerResponseLogs) => {
        findSimilarPatternsCallCount++;
        findSimilarPatternsReceivedLogs = logs;
        return [
          {
            patternId: 'pattern-001',
            similarity: 0.92,
            historicalDealId: 'hist-deal-001',
            description: '初回接触後の提案が決定打となったパターン',
          },
          {
            patternId: 'pattern-002',
            similarity: 0.88,
            historicalDealId: 'hist-deal-002',
            description: 'フォローアップで疑問解消後の成約パターン',
          },
        ];
      },
      evaluatePatternRelevance: (log: typeof customerResponseLogs[0]) => {
        evaluatePatternRelevanceCallCount++;
        evaluatePatternRelevanceInputs.push(log);
        if (log.logType === 'initial_contact') {
          return { relevanceScore: 85, assessment: '標準プロセス準拠' };
        } else if (log.logType === 'proposal_presentation') {
          return { relevanceScore: 92, assessment: '標準プロセス準拠' };
        } else if (log.logType === 'follow_up') {
          return { relevanceScore: 88, assessment: '標準プロセス準拠' };
        }
        return { relevanceScore: 0, assessment: '未評価' };
      },
      explainRecommendationReasoning: (
        recommendation: string,
        patterns: typeof mockAIEngine['findSimilarPatterns'] extends (
          ...args: any[]
        ) => infer R
          ? R
          : never
      ) => {
        return `推奨内容「${recommendation}」は、過去の${patterns.length}件の成功パターンに基づいており、顧客の段階的なコミュニケーションプロセスと高度に合致しています。`;
      },
    };

    // 推奨生成メイン処理を実行
    const result = generateRecommendationWithPatternAnalysis(
      dealInfo,
      customerResponseLogs,
      mockAIEngine
    );

    // 検証1: findSimilarPatternsが1回呼び出され、3件すべてのログを受け取ったこと
    expect(findSimilarPatternsCallCount).toBe(1);
    expect(findSimilarPatternsReceivedLogs).not.toBeNull();
    expect(findSimilarPatternsReceivedLogs!.length).toBe(3);
    expect(findSimilarPatternsReceivedLogs![0].logId).toBe('log-001');
    expect(findSimilarPatternsReceivedLogs![1].logId).toBe('log-002');
    expect(findSimilarPatternsReceivedLogs![2].logId).toBe('log-003');

    // 検証2: evaluatePatternRelevanceが3回呼び出されたこと（各ログに対して1回ずつ）
    expect(evaluatePatternRelevanceCallCount).toBe(3);
    expect(evaluatePatternRelevanceInputs.length).toBe(3);
    expect(evaluatePatternRelevanceInputs[0].logId).toBe('log-001');
    expect(evaluatePatternRelevanceInputs[1].logId).toBe('log-002');
    expect(evaluatePatternRelevanceInputs[2].logId).toBe('log-003');

    // 検証3: 生成された推奨結果が複数対応パターンの統合分析結果を含むこと
    expect(result).toBeDefined();
    expect(result.recommendationId).toBeDefined();
    expect(result.dealId).toBe('deal-456');
    expect(result.customerId).toBe('cust-123');

    // 検証4: 推奨根拠に3件すべての対応記録が参照されていること
    expect(result.rationale).toBeDefined();
    expect(result.rationale.includedLogs).toHaveLength(3);
    expect(result.rationale.includedLogs[0].logId).toBe('log-001');
    expect(result.rationale.includedLogs[1].logId).toBe('log-002');
    expect(result.rationale.includedLogs[2].logId).toBe('log-003');

    // 検証5: 各ログの評価スコアが推奨根拠に含まれていること
    expect(result.rationale.logEvaluations).toHaveLength(3);
    expect(result.rationale.logEvaluations[0].relevanceScore).toBe(85);
    expect(result.rationale.logEvaluations[1].relevanceScore).toBe(92);
    expect(result.rationale.logEvaluations[2].relevanceScore).toBe(88);

    // 検証6: 統合分析結果として複数の成功パターンが推奨に含まれていること
    expect(result.suggestedApproaches).toBeDefined();
    expect(result.suggestedApproaches.length).toBeGreaterThanOrEqual(2);

    // 検証7: 推奨内容が複数対応パターンの統合分析に基づいていることが説明に含まれること
    expect(result.explanation).toContain('段階的なコミュニケーションプロセス');
    expect(result.explanation).toContain('複数');
  });
});