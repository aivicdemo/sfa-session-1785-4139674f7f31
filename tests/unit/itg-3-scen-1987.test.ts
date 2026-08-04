import { generateExecutiveDocument } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料生成', () => {
  // SCEN-1987
  test('経営層向け説得資料の自動生成機能 - 推奨根拠情報から経営層向けの説得要素が正確に抽出・変換されて資料に含まれる', async () => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    // テスト用の顧客情報と推奨根拠情報を準備
    const customerInfo = {
      industry: '製造業',
      employeeCount: 500,
      currentChallenge: '生産効率化'
    };

    const recommendationReasoning = {
      successPattern: {
        similarIndustry: '過去同業種で導入後ROI 35%達成'
      },
      executivePersuasionElements: {
        investmentRecoveryPeriod: '3ヶ月',
        annualOperatingCostReduction: 0.28,
        competitiveAdvantage: '競合他社比較での優位性'
      },
      riskMitigationElements: [
        '段階的導入オプション',
        '24ヶ月の技術サポート'
      ]
    };

    const proposalContent = {
      solution: 'AI導入による自動化'
    };

    // AIRecommendationEngine をスタブとして提供
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'AI自動化導入',
        reasoning: recommendationReasoning
      })
    };

    // generateExecutiveDocument を呼び出し
    const generatedDocument = await generateExecutiveDocument(
      {
        customerInfo,
        proposalContent,
        recommendationReasoning
      },
      mockAIEngine
    );

    // 生成された資料のセクション構成を検証
    expect(generatedDocument).toHaveProperty('sections');
    expect(Array.isArray(generatedDocument.sections)).toBe(true);

    // セクションが経営層の意思決定プロセス順に編成されていることを確認
    const sectionTitles = generatedDocument.sections.map((s: any) => s.title);
    expect(sectionTitles).toEqual(
      expect.arrayContaining([
        expect.stringContaining('事業課題'),
        expect.stringContaining('ソリューション効果'),
        expect.stringContaining('実装計画'),
        expect.stringContaining('リスク対策')
      ])
    );

    // セクション順序の確認（事業課題 → ソリューション効果 → 実装計画 → リスク対策）
    const businessChallengeIndex = sectionTitles.findIndex((t: string) =>
      t.includes('事業課題')
    );
    const solutionEffectIndex = sectionTitles.findIndex((t: string) =>
      t.includes('ソリューション効果')
    );
    const implementationIndex = sectionTitles.findIndex((t: string) =>
      t.includes('実装計画')
    );
    const riskMitigationIndex = sectionTitles.findIndex((t: string) =>
      t.includes('リスク対策')
    );

    expect(businessChallengeIndex).toBeLessThan(solutionEffectIndex);
    expect(solutionEffectIndex).toBeLessThan(implementationIndex);
    expect(implementationIndex).toBeLessThan(riskMitigationIndex);

    // 数値根拠の検証（ROI 35%、コスト削減率 28%、投資回収期間3ヶ月）
    const solutionEffectSection = generatedDocument.sections.find(
      (s: any) => s.title.includes('ソリューション効果')
    );
    expect(solutionEffectSection).toBeDefined();

    const solutionContent = solutionEffectSection.content;
    expect(solutionContent).toMatch(/35%/);
    expect(solutionContent).toMatch(/28%/);
    expect(solutionContent).toMatch(/3ヶ月/);

    // 経営層向け表現の検証（投資回収期間が意思決定層向けのメッセージとして配置）
    expect(solutionContent).toMatch(/投資回収期間.*3ヶ月/);

    // 競合他社との優位性が可視化されていることを確認
    expect(generatedDocument).toHaveProperty('competitiveAnalysis');
    expect(generatedDocument.competitiveAnalysis).toBeDefined();
    expect(generatedDocument.competitiveAnalysis.format).toMatch(
      /表形式|チャート|比較表/
    );
    expect(generatedDocument.competitiveAnalysis.content).toMatch(/競合他社|優位性/);

    // リスク対策セクションの検証
    const riskMitigationSection = generatedDocument.sections.find(
      (s: any) => s.title.includes('リスク対策')
    );
    expect(riskMitigationSection).toBeDefined();

    const riskContent = riskMitigationSection.content;
    expect(riskContent).toMatch(/段階的導入/);
    expect(riskContent).toMatch(/24ヶ月|技術サポート/);

    // 実装計画セクションの検証（段階的導入オプションが記載）
    const implementationSection = generatedDocument.sections.find(
      (s: any) => s.title.includes('実装計画')
    );
    expect(implementationSection).toBeDefined();
    expect(implementationSection.content).toMatch(/段階的導入/);

    // 数値・統計情報の一貫性をチェック
    const allDocumentContent =
      generatedDocument.sections.map((s: any) => s.content).join(' ') +
      (generatedDocument.competitiveAnalysis?.content || '');

    const roi35Matches = (allDocumentContent.match(/35%/g) || []).length;
    const costReduction28Matches = (allDocumentContent.match(/28%/g) || []).length;

    // ROI 35%とコスト削減28%が重複なく（複数回出現していても矛盾なく）統合されていることを確認
    expect(roi35Matches).toBeGreaterThanOrEqual(1);
    expect(costReduction28Matches).toBeGreaterThanOrEqual(1);

    // 生成資料の構造が完全であることを確認
    expect(generatedDocument).toHaveProperty('title');
    expect(generatedDocument).toHaveProperty('executiveSummary');
    expect(generatedDocument).toHaveProperty('sections');
    expect(generatedDocument).toHaveProperty('competitiveAnalysis');
    expect(generatedDocument).toHaveProperty('implementationRoadmap');
    expect(generatedDocument).toHaveProperty('riskAssessment');

    // 実装ロードマップにリスク軽減要素が記載されていることを確認
    expect(generatedDocument.implementationRoadmap).toMatch(
      /段階的導入|24ヶ月|技術サポート/
    );

    fetchMock.disableMocks();
  });
});