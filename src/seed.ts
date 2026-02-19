// src/seed.ts - Seed data for Broadcast Capability Development

import {Payload} from 'payload';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

export const seed = async (payload: Payload): Promise<void> => {
  // Clear existing data
  console.log('  Clearing existing data...');
  await Promise.all([
    payload.delete({ collection: 'divisions', where: { id: { exists: true } } }),
    payload.delete({ collection: 'user-groups', where: { id: { exists: true } } }),
    payload.delete({ collection: 'channels', where: { id: { exists: true } } }),
    payload.delete({ collection: 'branding', where: { id: { exists: true } } }),
    payload.delete({ collection: 'templates', where: { id: { exists: true } } }),
    payload.delete({ collection: 'delivery-rules', where: { id: { exists: true } } }),
    payload.delete({ collection: 'messages', where: { id: { exists: true } } }),
  ]);

  // 1. Divisions
  const divisions = await Promise.all([
    payload.create({
      collection: 'divisions',
      data: {
        name: 'Corporate',
        code: 'CORP',
        description: 'Corporate-wide division for all employees',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'divisions',
      data: {
        name: 'IT Operations',
        code: 'IT_OPS',
        description: 'IT Operations and Infrastructure',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'divisions',
      data: {
        name: 'Engineering',
        code: 'ENG',
        description: 'Engineering Department',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'divisions',
      data: {
        name: 'Support',
        code: 'SUPPORT',
        description: 'Customer and Technical Support',
        isActive: true,
      },
    }),
  ]);

  // 2. User Groups/Audiences
  const userGroups = await Promise.all([
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'All Employees',
        description: 'All company employees',
        estimatedSize: 2450,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Engineering Department',
        description: 'Engineering team members',
        estimatedSize: 87,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Remote Workers',
        description: 'Employees working remotely',
        estimatedSize: 234,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'VIP Users',
        description: 'Executive and VIP users',
        estimatedSize: 34,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'IT Security Team',
        description: 'IT Security personnel',
        estimatedSize: 45,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Sales Department',
        description: 'Sales team members',
        estimatedSize: 120,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Finance Department',
        description: 'Finance team members',
        estimatedSize: 120,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Marketing Department',
        description: 'Marketing team members',
        estimatedSize: 89,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'New Hires',
        description: 'Recently hired employees',
        estimatedSize: 23,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Development Team',
        description: 'Software development team',
        estimatedSize: 67,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'IT Managers',
        description: 'IT Management personnel',
        estimatedSize: 12,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Data Owners',
        description: 'Data ownership stakeholders',
        estimatedSize: 50,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'All Users',
        description: 'All system users',
        estimatedSize: 4500,
        isActive: true,
      },
    }),
  ]);

  // 3. Channels
  const channels = await Promise.all([
    payload.create({
      collection: 'channels',
      data: {
        name: 'Riverbed Agent',
        channelId: 'riverbed',
        description: 'Native Riverbed agent communication via IOT. Primary channel for intrusive messages.',
        isEnabled: true,
        isConfigured: true,
        capabilities: ['client-side'],
        supportedMessageTypes: ['survey', 'confirmation', 'notification', 'reminder'],
        requiresAuth: false,
      },
    }),
    payload.create({
      collection: 'channels',
      data: {
        name: 'Microsoft Teams',
        channelId: 'teams',
        description: 'Teams integration for non-intrusive messages and self-service chat. Supports server-only flows.',
        isEnabled: true,
        isConfigured: true,
        capabilities: ['server-side', 'oauth'],
        supportedMessageTypes: ['notification', 'self-service', 'reminder'],
        requiresAuth: true,
        authProvider: 'OAuth',
      },
    }),
    payload.create({
      collection: 'channels',
      data: {
        name: 'Slack',
        channelId: 'slack',
        description: 'Slack workspace integration for collaborative notifications and support.',
        isEnabled: false,
        isConfigured: false,
        capabilities: ['server-side', 'oauth'],
        supportedMessageTypes: ['notification', 'self-service'],
        requiresAuth: true,
        authProvider: 'OAuth',
      },
    }),
    payload.create({
      collection: 'channels',
      data: {
        name: 'Email',
        channelId: 'email',
        description: 'Email delivery for non-urgent notifications and reminders.',
        isEnabled: false,
        isConfigured: false,
        capabilities: ['server-side'],
        supportedMessageTypes: ['notification', 'reminder'],
        requiresAuth: false,
      },
    }),
  ]);

  // 4. Branding Themes
  const brandingThemes = await Promise.all([
    payload.create({
      collection: 'branding', draft: false,
      data: {
        name: 'Corporate Default',
        scope: 'all',
        scopeType: 'global',
        general: { messageBackgroundColor: '#ffffff' },
        message: { textColor: '#1e293b' },
        actions: {
          primaryBackground: '#581c87',
          secondaryBackground: '#c084fc',
        },
        isActive: true,
      },
    }),
    payload.create({
      collection: 'branding', draft: false,
      data: {
        name: 'Security Alert Theme',
        scope: 'urgent',
        scopeType: 'urgency',
        general: { messageBackgroundColor: '#ffffff' },
        message: { textColor: '#7f1d1d' },
        actions: {
          primaryBackground: '#dc2626',
          secondaryBackground: '#f59e0b',
        },
        isActive: true,
      },
    }),
    payload.create({
      collection: 'branding', draft: false,
      data: {
        name: 'Engineering Division',
        scope: 'division',
        scopeType: 'division',
        general: { messageBackgroundColor: '#ffffff' },
        message: { textColor: '#1e293b' },
        actions: {
          primaryBackground: '#7c3aed',
          secondaryBackground: '#a78bfa',
        },
        isActive: true,
      },
    }),
    payload.create({
      collection: 'branding', draft: false,
      data: {
        name: 'Remediation Confirmation',
        scope: 'message-type',
        scopeType: 'message-type',
        messageType: 'confirmation',
        general: { messageBackgroundColor: '#ffffff' },
        message: { textColor: '#1e293b' },
        actions: {
          primaryBackground: '#16a34a',
          secondaryBackground: '#86efac',
        },
        isActive: true,
      },
    }),
    payload.create({
      collection: 'branding', draft: false,
      data: {
        name: 'Executive VIP Theme',
        scope: 'division',
        scopeType: 'division',
        general: { messageBackgroundColor: '#ffffff' },
        message: { textColor: '#1e293b' },
        actions: {
          primaryBackground: '#0f172a',
          secondaryBackground: '#475569',
        },
        isActive: true,
      },
    }),
  ]);

  // 5. Templates
  const templates = await Promise.all([
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Multi-step Survey',
        description: 'Interactive multi-step survey template for comprehensive feedback collection',
        messageType: 'survey',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Remediation Confirmation',
        description: 'Confirmation template for IT remediation actions',
        messageType: 'confirmation',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Success Notification',
        description: 'Generic success notification template',
        messageType: 'notification',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Remediation Reminder',
        description: 'Reminder template for pending remediation actions',
        messageType: 'reminder',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Chat Interface',
        description: 'Interactive chat interface for self-service support',
        messageType: 'self-service',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Security Alert - Engineering',
        description: 'Security alert template for Engineering division',
        messageType: 'notification',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Annual Survey',
        description: 'Annual employee satisfaction survey',
        messageType: 'survey',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Urgent Confirmation',
        description: 'Urgent action confirmation template',
        messageType: 'confirmation',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'System Notification',
        description: 'Generic system notification template',
        messageType: 'notification',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'templates', draft: false,
      data: {
        name: 'Scheduled Reminder',
        description: 'Scheduled reminder template for recurring notifications',
        messageType: 'reminder',
        templateType: 'pre-defined',
        isActive: true,
      },
    }),
  ]);

  // 6. Delivery Rules
  const deliveryRules = await Promise.all([
    payload.create({
      collection: 'delivery-rules',
      data: {
        name: 'Urgent Message Override',
        ruleType: 'urgency',
        isEnabled: true,
        configuration: {
          bypassFatigueRules: true,
          allowParallelUrgent: true,
        },
        targetUserRole: 'all',
        priority: 10,
        description: 'Urgent security alerts and critical issues bypass normal delivery restrictions',
      },
    }),
  ]);

  // 7. Messages
  const messages = await Promise.all([
    payload.create({
      collection: 'messages',
      data: {
        name: 'Win11 Migration Survey',
        description: 'Survey for Windows 11 migration readiness',
        messageType: 'survey',
        template: templates[0].id, // Multi-step Survey
        targetGroup: userGroups[0].id, // All Employees
        channels: [channels[0].id],
        deliveryMode: 'intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 74,
        totalRecipients: 2450,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Please complete this survey to help us understand your Windows 11 migration readiness.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Network Issue Auto-Fix Confirmation',
        description: 'Confirmation for automated network issue remediation',
        messageType: 'confirmation',
        template: templates[1].id, // Remediation Confirmation
        targetGroup: userGroups[1].id, // Engineering Department
        channels: [channels[0].id],
        deliveryMode: 'intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 83,
        totalRecipients: 87,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'A network issue has been detected and an automatic fix is ready to apply.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Issue Resolved Notification',
        description: 'Notification that an issue has been resolved',
        messageType: 'notification',
        template: templates[2].id, // Success Notification
        targetGroup: userGroups[2].id, // Remote Workers
        channels: [channels[1].id],
        deliveryMode: 'non-intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 92,
        totalRecipients: 156,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'The network connectivity issue you reported has been successfully resolved.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Snoozed Remediation Reminder',
        description: 'Reminder for snoozed remediation action',
        messageType: 'reminder',
        template: templates[3].id, // Remediation Reminder
        targetGroup: userGroups[5].id, // Sales Department
        channels: [channels[0].id],
        deliveryMode: 'intrusive',
        status: 'Triggered',
        priority: 'normal',
        deliverySchedule: 'scheduled',
        scheduledDate: new Date().toISOString(),
        responseRate: 0,
        totalRecipients: 0,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'You have a pending remediation action that requires your attention.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Device Health Self-Service',
        description: 'Self-service device health portal for VIP users',
        messageType: 'self-service',
        template: templates[4].id, // Chat Interface
        targetGroup: userGroups[3].id, // VIP Users
        channels: [channels[1].id],
        deliveryMode: 'non-intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 100,
        totalRecipients: 34,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Use this self-service portal to check device health and get support.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Employee Satisfaction Survey',
        description: 'Annual employee satisfaction survey',
        messageType: 'survey',
        template: templates[6].id, // Annual Survey
        targetGroup: userGroups[0].id, // All Employees
        channels: [channels[3].id],
        deliveryMode: 'non-intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 67,
        totalRecipients: 3200,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Please take a few minutes to complete our annual employee satisfaction survey.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Security Patch Confirmation',
        description: 'Confirmation for security patch installation',
        messageType: 'confirmation',
        template: templates[7].id, // Urgent Confirmation
        targetGroup: userGroups[4].id, // IT Security Team
        channels: [channels[2].id],
        deliveryMode: 'intrusive',
        status: 'Active',
        priority: 'high',
        deliverySchedule: 'immediate',
        responseRate: 100,
        totalRecipients: 45,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'A critical security patch needs to be installed. Please confirm to proceed.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Maintenance Window Notification',
        description: 'Scheduled maintenance window notification',
        messageType: 'notification',
        template: templates[8].id, // System Notification
        targetGroup: userGroups[12].id, // All Users
        channels: [channels[0].id],
        deliveryMode: 'non-intrusive',
        status: 'Triggered',
        priority: 'normal',
        deliverySchedule: 'scheduled',
        scheduledDate: new Date().toISOString(),
        responseRate: 0,
        totalRecipients: 0,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'A scheduled maintenance window will occur this weekend.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Password Expiry Reminder',
        description: 'Password expiration reminder',
        messageType: 'reminder',
        template: templates[9].id, // Scheduled Reminder
        targetGroup: userGroups[6].id, // Finance Department
        channels: [channels[3].id],
        deliveryMode: 'non-intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 82,
        totalRecipients: 120,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Your password will expire soon. Please change it before it expires.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Help Desk Self-Service Portal',
        description: 'Self-service help desk portal access',
        messageType: 'self-service',
        template: templates[4].id, // Chat Interface
        targetGroup: userGroups[0].id, // All Employees
        channels: [channels[0].id],
        deliveryMode: 'non-intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 75,
        totalRecipients: 567,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Use the help desk self-service portal for quick support and troubleshooting.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'IT Equipment Feedback Survey',
        description: 'IT equipment satisfaction survey',
        messageType: 'survey',
        template: templates[0].id, // Multi-step Survey
        targetGroup: userGroups[7].id, // Marketing Department
        channels: [channels[1].id],
        deliveryMode: 'intrusive',
        status: 'Acknowledged',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 85,
        totalRecipients: 89,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Please provide feedback about your IT equipment and tools.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Policy Acceptance Confirmation',
        description: 'New employee policy acceptance',
        messageType: 'confirmation',
        template: templates[1].id, // Remediation Confirmation
        targetGroup: userGroups[8].id, // New Hires
        channels: [channels[3].id],
        deliveryMode: 'intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 78,
        totalRecipients: 23,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Please review and accept the company policies as part of your onboarding.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'System Update Complete',
        description: 'System update completion notification',
        messageType: 'notification',
        template: templates[2].id, // Success Notification
        targetGroup: userGroups[9].id, // Development Team
        channels: [channels[2].id],
        deliveryMode: 'non-intrusive',
        status: 'Acknowledged',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 100,
        totalRecipients: 67,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'The development environment update has been completed successfully.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Software License Renewal Reminder',
        description: 'Software license renewal reminder',
        messageType: 'reminder',
        template: templates[9].id, // Scheduled Reminder
        targetGroup: userGroups[10].id, // IT Managers
        channels: [channels[1].id],
        deliveryMode: 'intrusive',
        status: 'Active',
        priority: 'high',
        deliverySchedule: 'immediate',
        responseRate: 83,
        totalRecipients: 12,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Several software licenses are expiring soon. Please review and renew.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Troubleshooting Assistant',
        description: 'Interactive troubleshooting assistant',
        messageType: 'self-service',
        template: templates[4].id, // Chat Interface
        targetGroup: userGroups[2].id, // Remote Workers
        channels: [channels[2].id],
        deliveryMode: 'non-intrusive',
        status: 'Active',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 81,
        totalRecipients: 234,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Use our AI-powered troubleshooting assistant for quick problem resolution.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Quarterly IT Training Survey',
        description: 'Quarterly IT training needs survey',
        messageType: 'survey',
        template: templates[6].id, // Annual Survey
        targetGroup: userGroups[0].id, // All Employees
        channels: [channels[2].id],
        deliveryMode: 'non-intrusive',
        status: 'Draft',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 0,
        totalRecipients: 0,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Help us understand your IT training needs for the next quarter.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Data Backup Confirmation',
        description: 'Data backup completion confirmation',
        messageType: 'confirmation',
        template: templates[1].id, // Remediation Confirmation
        targetGroup: userGroups[11].id, // Data Owners
        channels: [channels[1].id],
        deliveryMode: 'non-intrusive',
        status: 'Triggered',
        priority: 'normal',
        deliverySchedule: 'scheduled',
        scheduledDate: new Date().toISOString(),
        responseRate: 0,
        totalRecipients: 0,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Please confirm that your data backup has been completed successfully.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Critical Security Alert',
        description: 'Critical security alert for all users',
        messageType: 'notification',
        template: templates[5].id, // Security Alert - Engineering
        targetGroup: userGroups[12].id, // All Users
        channels: [channels[0].id],
        deliveryMode: 'intrusive',
        status: 'Active',
        priority: 'urgent',
        deliverySchedule: 'immediate',
        responseRate: 96,
        totalRecipients: 4500,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'A critical security vulnerability has been detected. Immediate action required.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Training Session Reminder',
        description: 'Training session reminder for engineering team',
        messageType: 'reminder',
        template: templates[3].id, // Remediation Reminder
        targetGroup: userGroups[1].id, // Engineering Department
        channels: [channels[2].id],
        deliveryMode: 'non-intrusive',
        status: 'Acknowledged',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 92,
        totalRecipients: 78,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Reminder: Your scheduled training session is coming up soon.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
    payload.create({
      collection: 'messages',
      data: {
        name: 'Quick Fix Wizard',
        description: 'Step-by-step troubleshooting wizard',
        messageType: 'self-service',
        template: templates[4].id, // Chat Interface
        targetGroup: userGroups[5].id, // Sales Department
        channels: [channels[3].id],
        deliveryMode: 'non-intrusive',
        status: 'Draft',
        priority: 'normal',
        deliverySchedule: 'immediate',
        responseRate: 0,
        totalRecipients: 0,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1, direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1, direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'Follow our step-by-step wizard to resolve common issues quickly.',
                    version: 1, direction: 'ltr',
                  }
                ],
              }
            ],
          }
        },
      },
    }),
  ]);

  console.log('✅ Seed data created successfully!');
  await payload.updateGlobal({
    slug: 'setting',
    data: {
      name: 'Default Brand Settings',
      brandDefaults: {
        general: {
          borderColor: '#E2E8F0',
          messageBackgroundColor: '#FFFFFF',
        },
        title: {
          textColor: '#1E293B',
          fontFamily: 'Inter',
          fontWeight: '600',
          fontSize: '18px',
        },
        message: {
          textColor: '#475569',
          fontFamily: 'Inter',
          fontWeight: '400',
          fontSize: '14px',
        },
        actions: {
          primaryBackground: '#2563EB',
          primaryText: '#FFFFFF',
          secondaryBackground: '#F1F5F9',
          secondaryText: '#475569',
        },
      },
    },
  });
  console.log(`
  📊 Summary:
  - ${divisions.length} Divisions
  - ${userGroups.length} User Groups
  - ${channels.length} Channels
  - ${brandingThemes.length} Branding Themes
  - ${templates.length} Templates
  - ${deliveryRules.length} Delivery Rules
  - ${messages.length} Messages
  `);
};
