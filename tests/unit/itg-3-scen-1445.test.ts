import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1445: 推奨根拠が複数件のとき、すべてが可視化される', () => {
    // 準備: モック用のAIRecommendationEngineスタブを定義
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern_001',
          customerIndustry: '製造業',
          budgetRange: '500万円',
          decisionPeriod: '3ヶ月',
          matchScore: 0.85,
        },
        {
          patternId: 'pattern_002',
          customerIndustry: '製造業',
          budgetRange: '500万円',
          decisionPeriod: '3ヶ月',
          matchScore: 0.78,
        },
        {
          patternId: 'pattern_003',
          customerIndustry: '製造業',
          budgetRange: '600万円',
          decisionPeriod: '3ヶ月',
          matchScore: 0.72,
        },
      ]),
      evaluatePatternRelevance: jest.fn((patternId) => {
        const scoreMap: { [key: string]: number } = {
          pattern_001: 0.85,
          pattern_002: 0.78,
          pattern_003: 0.72,
        };
        return scoreMap[patternId] || 0.7;
      }),
      explainRecommendationReasoning: jest.fn((patternId, reason) => {
        const explanationMap: { [key: string]: string } = {
          pattern_001: '過去の同業同規模案件で成功実績が豊富（成約率85%）。提案タイミングと顧客課題の適合度が高い',
          pattern_002: '同じ製造業で予算規模500万円の案件で複数成功事例あり。意思決定期間3ヶ月は標準パターン',
          pattern_003: '製造業向けの提案アプローチが確立。決定期間3ヶ月は経営層承認プロセス標準時間内',
        };
        return explanationMap[patternId] || 'パターンマッチング成功';
      }),
    };

    // テスト用の新規案件データを定義
    const newDealInput = {
      customerName: 'テスト製造企業A',
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      decisionPeriod: 90,
      proposalContent: 'デジタル化推進ソリューション',
    };

    // generateRecommendationメソッドを呼び出し、推奨結果を取得
    const recommendationResult = generateRecommendation(
      newDealInput,
      mockAIRecommendationEngine
    );

    // 返却されたrecommendationオブジェクト内のreasonsフィールド検証
    expect(recommendationResult.reasons).toBeDefined();
    expect(Array.isArray(recommendationResult.reasons)).toBe(true);
    expect(recommendationResult.reasons.length).toBeGreaterThanOrEqual(3);

    // reasonsフィールドに含まれる各根拠オブジェクトのプロパティ検証
    recommendationResult.reasons.forEach((reason: any, index: number) => {
      expect(reason.patternId).toBeDefined();
      expect(typeof reason.patternId).toBe('string');
      expect(reason.patternId.length).toBeGreaterThan(0);

      expect(reason.relevanceScore).toBeDefined();
      expect(typeof reason.relevanceScore).toBe('number');
      expect(reason.relevanceScore).toBeGreaterThanOrEqual(0.7);
      expect(reason.relevanceScore).toBeLessThanOrEqual(1.0);

      expect(reason.description).toBeDefined();
      expect(typeof reason.description).toBe('string');
      expect(reason.description.length).toBeGreaterThan(0);
    });

    // 期待値: reasonsフィールドに3件以上の根拠が含まれることを再度検証
    expect(recommendationResult.reasons.length).toBe(3);

    // 各根拠のスコア値が期待範囲内であることを検証
    const patternScores = recommendationResult.reasons.map((r: any) => ({
      patternId: r.patternId,
      score: r.relevanceScore,
    }));

    expect(patternScores).toEqual([
      { patternId: 'pattern_001', score: 0.85 },
      { patternId: 'pattern_002', score: 0.78 },
      { patternId: 'pattern_003', score: 0.72 },
    ]);

    // 各根拠の説明文が正しく生成されていることを検証
    expect(recommendationResult.reasons[0].description).toMatch(
      /成功実績|成約率/
    );
    expect(recommendationResult.reasons[1].description).toMatch(
      /複数成功事例|標準パターン/
    );
    expect(recommendationResult.reasons[2].description).toMatch(
      /提案アプローチ|承認プロセス/
    );

    // UI可視化検証用のDOM出力シミュレーション
    const renderRecommendationReasons = (
      reasons: Array<{
        patternId: string;
        relevanceScore: number;
        description: string;
      }>
    ): HTMLElement => {
      const container = document.createElement('div');
      container.className = 'recommendation-reasons-container';

      reasons.forEach((reason) => {
        const reasonElement = document.createElement('div');
        reasonElement.className = 'reason-item';
        reasonElement.setAttribute('data-pattern-id', reason.patternId);
        reasonElement.innerHTML = `
          <div class="pattern-id">${reason.patternId}</div>
          <div class="relevance-score">${(reason.relevanceScore * 100).toFixed(0)}%</div>
          <div class="description">${reason.description}</div>
        `;
        container.appendChild(reasonElement);
      });

      return container;
    };

    // render関数を実行してDOMを生成
    const renderedDOM = renderRecommendationReasons(
      recommendationResult.reasons
    );

    // DOM上の根拠要素の個数を確認
    const domReasonElements = renderedDOM.querySelectorAll('.reason-item');
    expect(domReasonElements.length).toBe(
      recommendationResult.reasons.length
    );
    expect(domReasonElements.length).toBe(3);

    // reasonsフィールド内のすべての根拠について、対応するDOM要素が存在し、
    // patternIdと説明文が正しく表示されていることを検証
    recommendationResult.reasons.forEach((reason: any, index: number) => {
      const domElement = domReasonElements[index];

      // DOM要素が存在することを確認
      expect(domElement).toBeDefined();

      // patternIdが正しく表示されているか確認
      const patternIdElement = domElement.querySelector('.pattern-id');
      expect(patternIdElement?.textContent).toBe(reason.patternId);

      // 説明文が正しく表示されているか確認
      const descriptionElement = domElement.querySelector('.description');
      expect(descriptionElement?.textContent).toBe(reason.description);

      // relevanceScoreがパーセンテージで表示されているか確認
      const scoreElement = domElement.querySelector('.relevance-score');
      const expectedScorePercentage = `${(reason.relevanceScore * 100).toFixed(0)}%`;
      expect(scoreElement?.textContent).toBe(expectedScorePercentage);

      // data属性でpatternIdが指定されているか確認
      expect(domElement.getAttribute('data-pattern-id')).toBe(
        reason.patternId
      );
    });

    // 最終的な期待結果: 返却オブジェクトの構造全体を検証
    expect(recommendationResult).toHaveProperty('reasons');
    expect(recommendationResult.reasons.length).toBeGreaterThanOrEqual(3);
    expect(
      recommendationResult.reasons.every(
        (r: any) =>
          r.patternId &&
          typeof r.relevanceScore === 'number' &&
          r.relevanceScore >= 0.7 &&
          r.description
      )
    ).toBe(true);
  });
});