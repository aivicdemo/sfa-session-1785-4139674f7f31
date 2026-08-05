import { runTx2Imp2Agent } from '../../src/logic/it-1';

// Mock types for Tx2Imp2AiClient
interface MockAiClientConfig {
  complianceScores: Record<string, number>;
  improvementSuggestions: string[];
  overallAverageCompliance: number;
}

interface SalesActivityData {
  salesRepId: string;
  salesRepName: string;
  contactsCount: number;
  proposalsCount: number;
  closedDealsCount: number;
  lostDealsCount: number;
  processStepsCompleted: Record<string, number>;
}

interface ProcessDefinition {
  stepName: string;
  expectedCompletionRate: number;
  sequenceOrder: number;
}

interface ComplianceAnalysisResult {
  salesRepId: string;
  complianceScore: number;
  isLowCompliance: boolean;
}

interface ImprovementOpportunity {
  salesRepId: string;
  stepName: string;
  currentCompletionRate: number;
  expectedCompletionRate: number;
  suggestion: string;
}

interface DashboardOutput {
  complianceScoresBySalesRep: Record<string, number>;
  overallAverageCompliance: number;
  improvementTargetCount: number;
  detectedOpportunitiesCount: number;
}

interface AuditEvent {
  eventType: string;
  timestamp: string;
  details: string;
}

interface Tx2Imp2AgentResult {
  dashboardOutput: DashboardOutput;
  auditEvents: AuditEvent[];
  improvementProposals: Array<{
    salesRepId: string;
    proposal: string;
    status: string;
  }>;
  complianceAnalysis: ComplianceAnalysisResult[];
}

describe('営業プロセス遵守状況の自動監視と改善提案の実行 AIエージェント', () => {
  test('SCEN-1241: [normal] 営業プロセス遵守状況の自動監視と改善提案の実行 - プロセス遵守率計算と改善提案の自動生成', async () => {
    // Arrange: テスト用の営業活動データセットを準備
    const salesActivityData: SalesActivityData[] = [
      {
        salesRepId: 'REP-A',
        salesRepName: 'Sales Rep A',
        contactsCount: 45,
        proposalsCount: 38,
        closedDealsCount: 32,
        lostDealsCount: 6,
        processStepsCompleted: {
          'initial_contact': 45,
          'needs_analysis': 43,
          'proposal': 38,
          'closing': 33,
          'follow_up': 32
        }
      },
      {
        salesRepId: 'REP-B',
        salesRepName: 'Sales Rep B',
        contactsCount: 40,
        proposalsCount: 18,
        closedDealsCount: 12,
        lostDealsCount: 6,
        processStepsCompleted: {
          'initial_contact': 40,
          'needs_analysis': 36,
          'proposal': 18,
          'closing': 14,
          'follow_up': 12
        }
      },
      {
        salesRepId: 'REP-C',
        salesRepName: 'Sales Rep C',
        contactsCount: 42,
        proposalsCount: 33,
        closedDealsCount: 28,
        lostDealsCount: 5,
        processStepsCompleted: {
          'initial_contact': 42,
          'needs_analysis': 40,
          'proposal': 33,
          'closing': 30,
          'follow_up': 28
        }
      }
    ];

    // プロセス定義を登録（標準営業プロセス）
    const processDefinition: ProcessDefinition[] = [
      { stepName: 'initial_contact', expectedCompletionRate: 100, sequenceOrder: 1 },
      { stepName: 'needs_analysis', expectedCompletionRate: 95, sequenceOrder: 2 },
      { stepName: 'proposal', expectedCompletionRate: 90, sequenceOrder: 3 },
      { stepName: 'closing', expectedCompletionRate: 85, sequenceOrder: 4 },
      { stepName: 'follow_up', expectedCompletionRate: 80, sequenceOrder: 5 }
    ];

    // 成功事例データ（プロセス完全遵守者の成約率80%、平均売上高1,500万円）
    const successPatternData = {
      complianceRateThreshold: 90,
      averageContractRate: 0.80,
      averageRevenuePerDeal: 15000000
    };

    // モックAIクライアントの構成
    const mockAiClientConfig: MockAiClientConfig = {
      complianceScores: {
        'REP-A': 95,
        'REP-B': 65,
        'REP-C': 78
      },
      improvementSuggestions: [
        'テンプレートライブラリを活用し、初回提案までの日数を3日短縮'
      ],
      overallAverageCompliance: 79.3
    };

    const mockAiClient = {
      analyzeComplianceScores: jest.fn().mockResolvedValue(mockAiClientConfig.complianceScores),
      generateImprovementProposals: jest.fn().mockResolvedValue({
        'REP-B': {
          stepName: 'proposal',
          currentCompletionRate: 45,
          expectedCompletionRate: 90,
          suggestion: mockAiClientConfig.improvementSuggestions[0]
        }
      }),
      calculateOverallAverageCompliance: jest.fn().mockResolvedValue(mockAiClientConfig.overallAverageCompliance)
    };

    // Act: runTx2Imp2Agent 関数を実行
    const result: Tx2Imp2AgentResult = await runTx2Imp2Agent(
      salesActivityData,
      processDefinition,
      successPatternData,
      mockAiClient
    );

    // Assert: AIエージェントが営業活動データを収集するステップの検証
    expect(mockAiClient.analyzeComplianceScores).toHaveBeenCalledWith(
      expect.objectContaining({
        salesActivityData: expect.any(Array),
        processDefinition: expect.any(Array)
      })
    );

    // 各営業担当者に対して遵守率スコアが計算されたことを確認
    expect(result.complianceAnalysis).toHaveLength(3);
    
    // 営業担当者A（遵守率95%）の検証
    const repAAnalysis = result.complianceAnalysis.find(a => a.salesRepId === 'REP-A');
    expect(repAAnalysis).toBeDefined();
    expect(repAAnalysis?.complianceScore).toBe(95);
    expect(repAAnalysis?.isLowCompliance).toBe(false);

    // 営業担当者B（遵守率65%）が『低遵守グループ』として抽出されたことを確認
    const repBAnalysis = result.complianceAnalysis.find(a => a.salesRepId === 'REP-B');
    expect(repBAnalysis).toBeDefined();
    expect(repBAnalysis?.complianceScore).toBe(65);
    expect(repBAnalysis?.isLowCompliance).toBe(true);

    // 営業担当者C（遵守率78%）の検証
    const repCAnalysis = result.complianceAnalysis.find(a => a.salesRepId === 'REP-C');
    expect(repCAnalysis).toBeDefined();
    expect(repCAnalysis?.complianceScore).toBe(78);
    expect(repCAnalysis?.isLowCompliance).toBe(false);

    // AIエージェントが営業担当者Bの改善機会を検出したことを確認
    expect(mockAiClient.generateImprovementProposals).toHaveBeenCalled();
    
    // 『提案ステップの完了率が45%（標準：90%）』として特定されたことを確認
    const repBProposals = result.improvementProposals.filter(p => p.salesRepId === 'REP-B');
    expect(repBProposals).toHaveLength(1);
    expect(repBProposals[0].proposal).toContain('テンプレートライブラリを活用し、初回提案までの日数を3日短縮');

    // 生成された改善提案がマネージャーレビュー対象として一時保管されたことを確認
    // （自動通知は実行されない）
    expect(repBProposals[0].status).toBe('pending_manager_review');

    // ダッシュボード出力の検証
    expect(result.dashboardOutput.complianceScoresBySalesRep['REP-A']).toBe(95);
    expect(result.dashboardOutput.complianceScoresBySalesRep['REP-B']).toBe(65);
    expect(result.dashboardOutput.complianceScoresBySalesRep['REP-C']).toBe(78);

    // 全体平均遵守率が79.3%であることを確認
    expect(result.dashboardOutput.overallAverageCompliance).toBe(79.3);

    // 改善対象者数が1名であることを確認
    expect(result.dashboardOutput.improvementTargetCount).toBe(1);

    // 検出された改善機会数が1件であることを確認
    expect(result.dashboardOutput.detectedOpportunitiesCount).toBe(1);

    // イベントログの検証
    expect(result.auditEvents).toContainEqual(
      expect.objectContaining({
        eventType: 'プロセス遵守状況の判定完了'
      })
    );
    expect(result.auditEvents).toContainEqual(
      expect.objectContaining({
        eventType: '営業担当者B：低遵守検出'
      })
    );
    expect(result.auditEvents).toContainEqual(
      expect.objectContaining({
        eventType: '改善提案生成完了'
      })
    );
    expect(result.auditEvents).toContainEqual(
      expect.objectContaining({
        eventType: 'マネージャーレビュー待機状態に遷移'
      })
    );

    // 監査ログの各イベントのタイムスタンプが有効であることを確認
    result.auditEvents.forEach(event => {
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    });
  });
});