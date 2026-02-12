'use client'
import {useEffect, useState} from 'react';
import '../styles/globals.css';
import {MessageManager} from './messages/MessageManager';
import type {Template} from './templates/TemplateManager';
import {TemplateManager} from './templates/TemplateManager';
import {BrandingManager} from '@/components/EndUserComm/components/branding/BrandingManager';
import {FileText, LayoutDashboard, MessageSquare, Palette, Plus} from 'lucide-react';
import type {UiMessageInfo, UiBrandingInfo} from '@/components/EndUserComm/http-services-sdk/be-types';
import {endUserCommSdk} from '@/components/EndUserComm/http-services-sdk/http-sdk';
import {type TabItem, Tabs} from './ui/navigation/tabs';
import {usePrivileges, PrivilegesProvider} from '@/components/EndUserComm/hooks/usePrivileges';

export type NavigationView = 'messages' | 'templates' | 'branding';

function EndUserCommContent() {
  // Messages, templates, and branding are managed here and fetched once on mount.
  // They persist during tab navigation but reset on page reload.
  const { canManageMessages } = usePrivileges();
  const [currentView, setCurrentView] = useState<NavigationView>('messages');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [messages, setMessages] = useState<UiMessageInfo[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [branding, setBranding] = useState<UiBrandingInfo | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await endUserCommSdk.uiMgmtMessage.getTemplates();
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates from API:', error);
        setTemplates([]);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await endUserCommSdk.uiMgmtMessage.getMsgDefinitions();
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages from API:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await endUserCommSdk.uiMgmtMessage.getDefaultBranding();
        setBranding(response.data);
      } catch (error) {
        console.error('Error fetching branding from API:', error);
        setBranding(null);
      }
    };

    fetchBranding();
  }, []);
  const renderView = () => {
    switch (currentView) {
      case 'messages':
        return (
          <MessageManager
            templates={templates}
            messages={messages}
            onMessagesChange={setMessages}
            showCreateDialog={showCreateDialog}
            setShowCreateDialog={setShowCreateDialog}/>
        );
      case 'templates':
        return (
          <TemplateManager
            templates={templates}
            onTemplatesChange={setTemplates}/>
        );
      case 'branding':
        return (
          <BrandingManager
            branding={branding}
            onBrandingChange={setBranding}/>
        );
      default:
        return (
          <MessageManager
            templates={templates}
            messages={messages}
            onMessagesChange={setMessages}/>
        );
    }
  };

  const tabs: TabItem<NavigationView>[] = [
    {id: 'messages', label: 'Messages', icon: LayoutDashboard},
    {id: 'templates', label: 'Templates', icon: FileText},
    {id: 'branding', label: 'Branding', icon: Palette},
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Header with branding */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-900 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white"/>
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl">End-user Communication</h1>
              <p className="text-purple-700 text-sm">Create and manage branded message & templates for end-user communications</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={currentView}
            onTabChange={setCurrentView}>
            {currentView === 'messages' && canManageMessages && (
              <button
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center gap-2 bg-purple-900 text-white px-4 py-2 rounded-lg hover:bg-purple-950 transition-colors mb-2">
                <Plus className="w-5 h-5"/>
                Create Message
              </button>
            )}
          </Tabs>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default function EndUserComm() {
  return (
    <PrivilegesProvider>
      <EndUserCommContent />
    </PrivilegesProvider>
  );
}
