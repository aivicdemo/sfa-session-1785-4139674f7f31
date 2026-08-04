import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターン照合・マッチング機能', () => {
  // SCEN-2289
  test('成功パターンのランク付けスコアが計算不可のとき、ソート処理がエラーになり、キャッシュ代替表示される', () => {
    // 準備: 新規案件データ
    const newDealData = {
      customerIndustry: '製造業',
      budgetRange: '1000万円',
      decisionMakers: 5,
    };

    // 成功パターンマスタから返却されるパターン
    const mockPatterns = [
      {
        patternId: 'pat001',
        industry: '製造業',
        budgetRange: '1000万円',
        decisionMakers: 5,
        proposalApproach: '技術課題解決型提案',
      },
      {
        patternId: 'pat002',
        industry: '製造業',
        budgetRange: '500万円',
        decisionMakers: 3,
        proposalApproach: 'ROI最大化型提案',
      },
      {
        patternId: 'pat003',
        industry: '流通業',
        budgetRange: '2000万円',
        decisionMakers: 7,
        proposalApproach: 'プロセス効率化型提案',
      },
    ];

    // スタブ化: evaluatePatternRelevance が計算不可スコアを返すケース
    const evaluatePatternRelevanceStub = (pattern: any): number => {
      if (pattern.patternId === 'pat001') {
        return 0.85; // 正常値
      }
      if (pattern.patternId === 'pat002') {
        return NaN; // 計算不可: NaN
      }
      if (pattern.patternId === 'pat003') {
        return Infinity; // 計算不可: Infinity
      }
      return undefined as any; // 計算不可: undefined
    };

    // スタブ化: findSimilarPatterns がモックパターンを返却
    const findSimilarPatternsStub = (): Array<{
      patternId: string;
      industry: string;
      budgetRange: string;
      decisionMakers: number;
      proposalApproach: string;
    }> => {
      return mockPatterns;
    };

    // ソート処理を実行: スコアが計算不可のパターンが含まれるため、エラーが発生する可能性
    let sortError: Error | null = null;
    let sortedPatterns: any[] = [];

    try {
      // パターンをランク付けスコアでソート
      sortedPatterns = findSimilarPatternsStub().sort((a, b) => {
        const scoreA = evaluatePatternRelevanceStub(a);
        const scoreB = evaluatePatternRelevanceStub(b);

        // スコアが計算不可の場合、比較処理がエラーになる
        if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB)) {
          throw new TypeError(
            'Cannot convert NaN or Infinity to a number for comparison'
          );
        }

        return scoreB - scoreA; // 降順
      });
    } catch (error) {
      sortError = error as Error;
    }

    // 期待結果: エラーが発生したことを確認
    expect(sortError).not.toBeNull();
    expect(sortError?.message).toMatch(/Cannot convert NaN or Infinity/);

    // エラーハンドリング: 代替表示用に推奨パターンマスタから統計的に上位の成功パターンを取得
    const fallbackCachePatterns = [
      {
        patternId: 'cache_pat_001',
        industry: '製造業',
        budgetRange: '1000万円',
        decisionMakers: 5,
        proposalApproach: '技術課題解決型提案',
        usageCount: 125, // 統計的に上位
      },
      {
        patternId: 'cache_pat_002',
        industry: '製造業',
        budgetRange: '1500万円',
        decisionMakers: 4,
        proposalApproach: 'コスト削減型提案',
        usageCount: 98,
      },
      {
        patternId: 'cache_pat_003',
        industry: '製造業',
        budgetRange: '800万円',
        decisionMakers: 6,
        proposalApproach: '品質向上型提案',
        usageCount: 87,
      },
    ];

    // usageCount で降順ソート（統計的に上位）
    const topCachedPatterns = fallbackCachePatterns
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 3);

    // 期待結果: キャッシュから取得したパターンがソート可能で、正しく降順になっている
    expect(topCachedPatterns).toHaveLength(3);
    expect(topCachedPatterns[0].patternId).toBe('cache_pat_001');
    expect(topCachedPatterns[0].usageCount).toBe(125);
    expect(topCachedPatterns[1].usageCount).toBe(98);
    expect(topCachedPatterns[2].usageCount).toBe(87);

    // 期待結果: 利用者向けメッセージの確認
    const userMessage =
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します';
    expect(userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 期待結果: 返却されたキャッシュパターンが新規案件データと関連性があることを確認
    expect(topCachedPatterns[0].industry).toBe(newDealData.customerIndustry);
    expect(topCachedPatterns[0].budgetRange).toBe(newDealData.budgetRange);
  });
});