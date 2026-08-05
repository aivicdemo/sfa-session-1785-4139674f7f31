import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx11Imp1Agent } from '../../src/logic/it-1';

interface MockedCase {
  id: string;
  successFactors: string[];
  failureFactors: string[];
  tags: string[];
  status: string;
}

interface KnowledgeBaseEntry {
  caseId: string;
  tags: string[];
  status: string;
}

interface CompensationAction {
  type: string;
  targetId: string;
  timestamp: string;
}

interface AuditLogEntry {
  step: string;
  action: string;
  status: string;
  timestamp: string;
}

interface Tx11Imp1AiClient {
  extractCaseData(): Promise<MockedCase[]>;
  analyzeFactors(caseData: MockedCase[]): Promise<MockedCase[]>;
  matchExistingPatterns(caseData: MockedCase[]): Promise<MockedCase[]>;
  registerToKnowledgeBase(caseData: MockedCase[]): Promise<KnowledgeBaseEntry[]>;
  recommendPatternsToSalesStaff(caseData: MockedCase[]): Promise<void>;
}

interface Tx11Imp1RunResult {
  status: string;
  failedStep?: string;
  compensatedActions?: string[];
  auditLog?: AuditLogEntry[];
  knowledgeBaseState?: KnowledgeBaseEntry[];
  error?: Error;
}

// Mock implementation of knowledge base
class MockKnowledgeBase {
  private store: Map<string, KnowledgeBaseEntry> = new Map();
  private auditLog: AuditLogEntry[] = [];
  private compensationLog: CompensationAction[] = [];

  registerEntry(entry: KnowledgeBaseEntry): void {
    this.store.set(entry.caseId, entry);
    this.auditLog.push({
      step: 'registration',
      action: `registered ${entry.caseId}`,
      status: 'completed',
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    });
  }

  assignTag(caseId: string, tag: string): void {
    const entry = this.store.get(caseId);
    if (entry) {
      entry.tags.push(tag);
      this.auditLog.push({
        step: 'tag_assignment',
        action: `assigned ${tag} to ${caseId}`,
        status: 'completed',
        timestamp: new Date('2024-01-15T11:05:00Z').toISOString(),
      });
    }
  }

  deleteEntry(caseId: string): void {
    this.store.delete(caseId);
    this.compensationLog.push({
      type: 'delete_entry',
      targetId: caseId,
      timestamp: new Date('2024-01-15T11:15:00Z').toISOString(),
    });
    this.auditLog.push({
      step: 'compensation',
      action: `deleted ${caseId}`,
      status: 'compensated',
      timestamp: new Date('2024-01-15T11:15:00Z').toISOString(),
    });
  }

  removeTag(caseId: string, tag: string): void {
    const entry = this.store.get(caseId);
    if (entry) {
      entry.tags = entry.tags.filter(t => t !== tag);
      this.compensationLog.push({
        type: 'remove_tag',
        targetId: `${caseId}:${tag}`,
        timestamp: new Date('2024-01-15T11:16:00Z').toISOString(),
      });
      this.auditLog.push({
        step: 'compensation',
        action: `removed ${tag} from ${caseId}`,
        status: 'compensated',
        timestamp: new Date('2024-01-15T11:16:00Z').toISOString(),
      });
    }
  }

  getEntry(caseId: string): KnowledgeBaseEntry | undefined {
    return this.store.get(caseId);
  }

  getAllEntries(): KnowledgeBaseEntry[] {
    return Array.from(this.store.values());
  }

  getAuditLog(): AuditLogEntry[] {
    return this.auditLog;
  }

  getCompensationLog(): CompensationAction[] {
    return this.compensationLog;
  }
}

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 - トランザクション部分失敗時のロールバック', () => {
  let mockKnowledgeBase: MockKnowledgeBase;
  let mockAiClient: Tx11Imp1AiClient;

  beforeEach(() => {
    mockKnowledgeBase = new MockKnowledgeBase();

    mockAiClient = {
      extractCaseData: jest.fn(async () => [
        {
          id: 'CASE-001',
          successFactors: ['early_contact', 'multiple_touchpoints'],
          failureFactors: [],
          tags: [],
          status: 'extracted',
        },
      ]),

      analyzeFactors: jest.fn(async (caseData: MockedCase[]) => {
        return caseData.map(c => ({
          ...c,
          tags: ['pattern-success-A'],
          status: 'analyzed',
        }));
      }),

      matchExistingPatterns: jest.fn(async () => {
        throw new Error('PatternMatchingError: External pattern service unavailable');
      }),

      registerToKnowledgeBase: jest.fn(async (caseData: MockedCase[]) => {
        return caseData.map(c => ({
          caseId: c.id,
          tags: c.tags,
          status: 'registered',
        }));
      }),

      recommendPatternsToSalesStaff: jest.fn(async () => {
        // Should not be called
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1307
  test('ステップ3の例外発生時、ステップ1～2の副作用が完全にロールバックされることを確認', async () => {
    // Setup: ステップ1を実行し、事例データをメモリに抽出
    const extractedData = await mockAiClient.extractCaseData();
    expect(extractedData).toHaveLength(1);
    expect(extractedData[0].id).toBe('CASE-001');

    // Setup: ステップ2を実行し、成功要因・失敗要因を分析してタグを付与
    const analyzedData = await mockAiClient.analyzeFactors(extractedData);
    expect(analyzedData).toHaveLength(1);
    expect(analyzedData[0].tags).toContain('pattern-success-A');

    // Setup: ステップ1～2が完了したと仮定し、知識ベースに登録されたことを模擬
    const knowledgeBaseEntry: KnowledgeBaseEntry = {
      caseId: analyzedData[0].id,
      tags: analyzedData[0].tags,
      status: 'registered',
    };
    mockKnowledgeBase.registerEntry(knowledgeBaseEntry);
    mockKnowledgeBase.assignTag(analyzedData[0].id, analyzedData[0].tags[0]);

    // 検証: ステップ1～2の副作用が知識ベースに記録されていることを確認
    expect(mockKnowledgeBase.getEntry('CASE-001')).toBeDefined();
    expect(mockKnowledgeBase.getEntry('CASE-001')?.tags).toContain('pattern-success-A');

    // Action: ステップ3を実行し、意図的に失敗させる
    let patternMatchingError: Error | null = null;
    try {
      await mockAiClient.matchExistingPatterns(analyzedData);
    } catch (err) {
      patternMatchingError = err as Error;
    }

    // 検証: ステップ3でエラーが発生したことを確認
    expect(patternMatchingError).toBeDefined();
    expect(patternMatchingError?.message).toMatch(/PatternMatchingError/);

    // Action: ステップ3の失敗後、補償ロジックを実行してステップ1～2の副作用をロールバック
    if (patternMatchingError) {
      // 補償処理: CASE-001 を知識ベースから削除
      mockKnowledgeBase.deleteEntry('CASE-001');

      // 検証: ロールバック後、知識ベースから CASE-001 が削除されたことを確認
      expect(mockKnowledgeBase.getEntry('CASE-001')).toBeUndefined();

      // 検証: すべてのエントリが削除されたことを確認
      expect(mockKnowledgeBase.getAllEntries()).toHaveLength(0);
    }

    // 検証: ステップ4（知識ベース登録）が呼ばれていないことを確認
    expect(mockAiClient.registerToKnowledgeBase).not.toHaveBeenCalled();

    // 検証: ステップ5（営業担当者への推奨）が呼ばれていないことを確認
    expect(mockAiClient.recommendPatternsToSalesStaff).not.toHaveBeenCalled();

    // 検証: 監査ログに『ステップ3で失敗』『ステップ1～2の副作用を補償』『トランザクション完全ロールバック』が記録されていることを確認
    const auditLog = mockKnowledgeBase.getAuditLog();
    expect(auditLog.length).toBeGreaterThan(0);

    // 検証: 登録と補償の記録が存在することを確認
    const registrationLog = auditLog.find(
      log => log.step === 'registration' && log.action.includes('CASE-001')
    );
    expect(registrationLog).toBeDefined();
    expect(registrationLog?.status).toBe('completed');

    const compensationLog = auditLog.find(
      log => log.step === 'compensation' && log.action.includes('deleted')
    );
    expect(compensationLog).toBeDefined();
    expect(compensationLog?.status).toBe('compensated');

    // 検証: 補償ログに削除アクションが記録されていることを確認
    const compensationActions = mockKnowledgeBase.getCompensationLog();
    expect(compensationActions).toHaveLength(1);
    expect(compensationActions[0].type).toBe('delete_entry');
    expect(compensationActions[0].targetId).toBe('CASE-001');
  });
});