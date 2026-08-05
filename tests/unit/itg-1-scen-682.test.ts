import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateCustomerInteractionReferentialIntegrity } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  let mockDb: {
    customer_interactions: Array<{
      id: string;
      customer_id: string;
      interaction_datetime: string;
      sales_activity_id: string;
    }>;
    sales_activities: Array<{
      id: string;
      activity_type: string;
    }>;
  };

  beforeEach(() => {
    mockDb = {
      customer_interactions: [
        {
          id: 'CI-001',
          customer_id: 'C001',
          interaction_datetime: '2024-01-15T10:30:00Z',
          sales_activity_id: 'A999',
        },
      ],
      sales_activities: [
        {
          id: 'A001',
          activity_type: 'phone_call',
        },
        {
          id: 'A002',
          activity_type: 'email',
        },
      ],
    };
  });

  afterEach(() => {
    mockDb = {
      customer_interactions: [],
      sales_activities: [],
    };
  });

  // SCEN-682
  test('should return referential integrity error when sales_activity_id does not exist in sales_activities table', () => {
    const interaction_record = mockDb.customer_interactions[0];
    const referenced_sales_activity_id = interaction_record.sales_activity_id;

    const activity_exists = mockDb.sales_activities.some(
      (activity) => activity.id === referenced_sales_activity_id
    );
    expect(activity_exists).toBe(false);

    const result = validateCustomerInteractionReferentialIntegrity(
      {
        id: interaction_record.id,
        customer_id: interaction_record.customer_id,
        interaction_datetime: interaction_record.interaction_datetime,
        sales_activity_id: interaction_record.sales_activity_id,
      },
      mockDb.sales_activities
    );

    expect(result.error_code).toBe('REFERENTIAL_INTEGRITY_ERROR');
    expect(result.error_message).toMatch(/営業活動ID: A999/);
    expect(result.error_message).toMatch(/営業活動レコードが見つかりません/);
    expect(result.target_record_id).toBe('CI-001');
  });
});