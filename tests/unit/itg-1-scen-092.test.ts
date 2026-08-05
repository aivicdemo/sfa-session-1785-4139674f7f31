import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { generateSalesRepAnalysisReports } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  const TEST_OUTPUT_DIR = path.join(__dirname, 'test-output-reports');
  const MOCK_MONTHLY_MEETING_ID = 'MTG-2024-01';
  const MOCK_COMPLETION_DATETIME = new Date('2024-01-31T18:00:00Z');
  const MOCK_SALES_REPS = [
    { id: 'REP-001', name: '田中太郎' },
    { id: 'REP-002', name: '佐藤花子' },
    { id: 'REP-003', name: '鈴木次郎' },
  ];

  beforeEach(() => {
    if (!fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(TEST_OUTPUT_DIR)) {
      const files = fs.readdirSync(TEST_OUTPUT_DIR);
      files.forEach((file) => {
        fs.unlinkSync(path.join(TEST_OUTPUT_DIR, file));
      });
      fs.rmdirSync(TEST_OUTPUT_DIR);
    }
  });

  // SCEN-092
  test('[normal] 営業担当者行動パターン分析レポート生成機能 - 月次営業会議完了後に営業担当者複数人の分析レポートが正常に生成される', async () => {
    const mockMonthlyMeetingData = {
      meetingId: MOCK_MONTHLY_MEETING_ID,
      completionDatetime: MOCK_COMPLETION_DATETIME,
      participatingSalesReps: MOCK_SALES_REPS,
    };

    const mockBehaviorPatternData = {
      'REP-001': {
        proposalCount: 12,
        meetingActuals: 8,
        contractCount: 3,
      },
      'REP-002': {
        proposalCount: 15,
        meetingActuals: 10,
        contractCount: 4,
      },
      'REP-003': {
        proposalCount: 10,
        meetingActuals: 6,
        contractCount: 2,
      },
    };

    const analysisReportPeriodStart = new Date('2024-01-01T00:00:00Z');
    const analysisReportPeriodEnd = new Date('2024-01-31T23:59:59Z');

    const result = await generateSalesRepAnalysisReports({
      monthlyMeetingId: mockMonthlyMeetingData.meetingId,
      meetingCompletionDatetime: mockMonthlyMeetingData.completionDatetime,
      salesRepList: mockMonthlyMeetingData.participatingSalesReps,
      behaviorPatternData: mockBehaviorPatternData,
      analysisPeriodStart: analysisReportPeriodStart,
      analysisPeriodEnd: analysisReportPeriodEnd,
      outputDirectory: TEST_OUTPUT_DIR,
    });

    expect(result.generatedReports).toHaveLength(3);

    result.generatedReports.forEach((report, index) => {
      const expectedRepId = MOCK_SALES_REPS[index].id;
      const expectedRepName = MOCK_SALES_REPS[index].name;
      const expectedBehaviorData = mockBehaviorPatternData[expectedRepId];

      expect(report.salesRepId).toBe(expectedRepId);
      expect(report.salesRepName).toBe(expectedRepName);

      const reportGenerationDate = new Date(report.generatedDatetime);
      expect(reportGenerationDate.getTime()).toBeGreaterThanOrEqual(
        new Date('2024-01-31T00:00:00Z').getTime()
      );

      expect(report.analysisPeriodStart).toBe('2024-01-01');
      expect(report.analysisPeriodEnd).toBe('2024-01-31');

      expect(report.behaviorPatternAnalysis).toBeDefined();
      expect(report.behaviorPatternAnalysis.proposalCount).toBe(
        expectedBehaviorData.proposalCount
      );
      expect(report.behaviorPatternAnalysis.meetingActuals).toBe(
        expectedBehaviorData.meetingActuals
      );
      expect(report.behaviorPatternAnalysis.contractCount).toBe(
        expectedBehaviorData.contractCount
      );

      expect(report.generationStatus).toBe('完了');

      const reportFilePath = path.join(
        TEST_OUTPUT_DIR,
        `${report.reportId}.json`
      );
      expect(fs.existsSync(reportFilePath)).toBe(true);

      const fileContent = fs.readFileSync(reportFilePath, 'utf-8');
      const parsedFileContent = JSON.parse(fileContent);
      expect(parsedFileContent.salesRepName).toBe(expectedRepName);
      expect(parsedFileContent.behaviorPatternAnalysis.proposalCount).toBe(
        expectedBehaviorData.proposalCount
      );
    });

    expect(result.totalReportsGenerated).toBe(3);
    expect(result.generationCompletionStatus).toBe('完了');
  });
});