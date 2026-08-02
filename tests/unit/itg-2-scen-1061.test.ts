import { initializeDataCollectionEngine, updateEventDecisionStatus, getDataDefinition } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1061
  test('営業部長による開催決定時に、必須データ項目が明確に設定される', async () => {
    const engine = initializeDataCollectionEngine();
    
    const userContext = {
      userId: 'user_001',
      role: 'sales_manager',
      department: 'sales',
    };
    
    engine.setUserContext(userContext);
    
    const eventId = 'event_2024_001';
    const decisionPayload = {
      eventId: eventId,
      status: 'decided',
      decidedAt: '2024-01-15T09:00:00Z',
    };
    
    await updateEventDecisionStatus(decisionPayload);
    
    const dataDefinition = getDataDefinition(eventId);
    
    const requiredFields = [
      'customerCompanyName',
      'customerContactPersonName',
      'eventDateTime',
      'eventLocation',
      'participatingSalesStaffList',
      'caseOverview',
      'expectedEffect',
      'riskFactors',
    ];
    
    requiredFields.forEach((fieldName) => {
      const fieldDef = dataDefinition.requiredItems.find(
        (item: { fieldName: string; required: boolean }) => item.fieldName === fieldName
      );
      expect(fieldDef).toBeDefined();
      expect(fieldDef.required).toBe(true);
    });
    
    expect(dataDefinition.requiredItems.length).toBe(8);
  });
});