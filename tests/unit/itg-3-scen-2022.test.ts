import { generatePersuasionMaterialForExecutives } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2022: 経営層向け説得資料の自動生成機能 - 改善提案が複数件のとき、全件が改善提案列に記載される', () => {
    // テスト用顧客情報のセットアップ
    const customerInfo = {
      customerId: 'CUST-20240115-001',
      companyName: '日本テクノロジー株式会社',
      industry: 'IT・通信',
      annualRevenue: 5000000000,
      numberOfEmployees: 500,
      businessChallenge: 'デジタル化の推進と営業プロセスの標準化',
      budget: 50000000,
      decisionTimeframe: '2024年Q2以内',
    };

    // テスト用の改善提案データ（3件以上）
    const improvementProposals = [
      {
        proposalId: 'IMP-001',
        title: '営業プロセス標準化による効率化',
        description: '現在の属人的な営業プロセスを標準化し、全営業担当者が統一されたアプローチを採用することで、提案品質のばらつきを20%削減できます。',
        expectedEffect: 'ROI 150%、実装期間3ヶ月',
        priority: 'high',
      },
      {
        proposalId: 'IMP-002',
        title: 'AI推奨エンジンによる提案精度向上',
        description: '過去の成功事例データをAIが学習し、顧客属性に基づいて最適な提案アプローチを自動推奨します。経験浅い営業担当者でも成功パターンに沿った提案が可能になります。',
        expectedEffect: '提案採用率 45% → 60%、成約率ばらつき 25% → 15%',
        priority: 'high',
      },
      {
        proposalId: 'IMP-003',
        title: 'データ品質管理の自動化',
        description: '顧客情報の重複排除と正規化を自動実行し、営業データの信頼性を向上させます。データクレンジングに要していた手作業時間を他の営業活動に充当できます。',
        expectedEffect: '営業データ品質スコア 85% → 95%、顧客重複率 5% → 1%',
        priority: 'medium',
      },
      {
        proposalId: 'IMP-004',
        title: '購買タイミング最適化提案の自動生成',
        description: '顧客の購買履歴パターンと市場動向を分析し、最適な購買タイミングと推奨数量を自動提示します。在庫効率と購買効率が同時に向上します。',
        expectedEffect: '購買タイミング精度 80%以上、平均注文量 15%増加',
        priority: 'medium',
      },
    ];

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20240115-001',
        proposalApproaches: [
          {
            approachId: 'APP-001',
            title: 'エンタープライズ向け総合営業支援ソリューション',
            rationale: '顧客の規模（年売上50億円以上）と課題（営業プロセス標準化と効率化）に基づき推奨',
          },
        ],
        improvementProposals: improvementProposals,
        successProbability: 0.78,
        riskFactors: ['実装期間中の業務影響', '既存システムとの統合'],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        summary: '当社のAIエージェント推奨支援システムにより、営業プロセス標準化と提案品質向上を同時に実現できます',
        details: [
          '顧客規模（年売上50億円、従業員500名）に対して、ホールセール営業体制が適切',
          '現在のデジタル化推進意向が強く、システム導入への抵抗が低い',
          'Q2までの導入実現は可能なタイムスケジュール',
        ],
      }),
    };

    // 経営層向け説得資料の自動生成機能を実行
    const persuasionMaterial = generatePersuasionMaterialForExecutives(
      customerInfo,
      mockAIEngine,
    );

    // 生成された説得資料の改善提案列を取得
    expect(persuasionMaterial).toBeDefined();
    expect(persuasionMaterial.proposalList).toBeDefined();
    expect(Array.isArray(persuasionMaterial.proposalList)).toBe(true);

    // 改善提案列の要素数をカウントし、入力時の改善提案件数と一致することを確認
    const generatedProposalCount = persuasionMaterial.proposalList.length;
    const inputProposalCount = improvementProposals.length;
    expect(generatedProposalCount).toBe(inputProposalCount);
    expect(generatedProposalCount).toBe(4);

    // 改善提案列の各要素について、元のテストデータに含まれるすべての改善提案IDが存在することをループで検証
    const inputProposalIds = improvementProposals.map((p) => p.proposalId);
    const generatedProposalIds = persuasionMaterial.proposalList.map(
      (p: { proposalId: string }) => p.proposalId,
    );

    inputProposalIds.forEach((inputId) => {
      expect(generatedProposalIds).toContain(inputId);
    });

    // 各改善提案のID・内容・根拠が正確に保持されていることを確認
    improvementProposals.forEach((inputProposal) => {
      const matchedProposal = persuasionMaterial.proposalList.find(
        (p: { proposalId: string }) => p.proposalId === inputProposal.proposalId,
      );

      expect(matchedProposal).toBeDefined();
      expect(matchedProposal.proposalId).toBe(inputProposal.proposalId);
      expect(matchedProposal.title).toBe(inputProposal.title);
      expect(matchedProposal.description).toBe(inputProposal.description);
      expect(matchedProposal.expectedEffect).toBe(inputProposal.expectedEffect);
      expect(matchedProposal.priority).toBe(inputProposal.priority);
    });

    // 資料全体のメタデータを確認
    expect(persuasionMaterial.generatedDate).toBeDefined();
    expect(persuasionMaterial.targetAudience).toBe('executives');
    expect(persuasionMaterial.customerName).toBe('日本テクノロジー株式会社');
    expect(persuasionMaterial.roi).toBe('150%以上');
  });
});