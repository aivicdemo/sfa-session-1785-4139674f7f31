import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠説明文生成機能', () => {
  test('SCEN-161: AIエージェント呼び出し失敗時に簡略版説明文が代替生成される', async () => {
    // モック化されたAIRecommendationEngineスタブ
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn()
        .mockRejectedValueOnce(new Error('API Timeout'))
        .mockRejectedValueOnce(new Error('API Timeout'))
        .mockRejectedValueOnce(new Error('API Timeout')),
    };

    // 推奨パターンマスタの統計的に上位のパターン3件
    const recommendationPatternMaster = [
      {
        patternId: 'P001',
        applicableIndustry: '製造業',
        successRate: 87,
        implementationContent: '初期提案資料の提出→2週間以内のフォローアップ→技術仕様ヒアリング',
        sortOrder: 1,
      },
      {
        patternId: 'P002',
        applicableIndustry: '流通業',
        successRate: 82,
        implementationContent: '営業方針説明→導入効果シミュレーション→導入スケジュール提案',
        sortOrder: 2,
      },
      {
        patternId: 'P003',
        applicableIndustry: '金融業',
        successRate: 79,
        implementationContent: 'コンプライアンス確認→運用体制構築→段階的導入計画',
        sortOrder: 3,
      },
    ];

    // 推奨対象の商談条件
    const dealConditions = {
      customerScale: '中堅企業',
      industry: '製造業',
      budget: 5000000,
    };

    // 推奨根拠説明文生成機能を呼び出す
    const result = await explainRecommendationReasoning(
      dealConditions,
      mockAIEngine,
      recommendationPatternMaster
    );

    // AIエージェント呼び出しが3回の指数バックオフ再試行を実行したことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);

    // 代替動作として内部の推奨パターンマスタから統計的に上位のパターンが選定されたことを確認
    expect(result.selectedPatternId).toBe('P001');
    expect(result.applicableIndustry).toBe('製造業');
    expect(result.successRate).toBe(87);

    // 生成された説明文が簡略版形式であることを検証
    expect(result.explanationText).toMatch(/P001/);
    expect(result.explanationText).toMatch(/製造業/);
    expect(result.explanationText).toMatch(/87%/);
    expect(result.explanationText).toMatch(/初期提案資料の提出→2週間以内のフォローアップ→技術仕様ヒアリング/);

    // 簡略版説明文に固定テキストが含まれていることを確認
    expect(result.explanationText).toBe(
      '過去成功パターンに基づいた標準的な推奨です。当パターンは製造業向けで、87%の成功率を持ちます。実施内容：初期提案資料の提出→2週間以内のフォローアップ→技術仕様ヒアリング'
    );

    // 説明文が簡略版であることを確認（根拠データの詳細情報は含まない）
    expect(result.isSimplified).toBe(true);
  });
});