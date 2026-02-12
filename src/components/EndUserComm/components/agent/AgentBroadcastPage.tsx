'use client'
import {useState, useEffect, useRef} from 'react';
import {useParams} from 'next/navigation';
import {endUserCommSdk} from '@/components/EndUserComm/http-services-sdk/http-sdk';
import type {UiAgentMessageData, MessageButtons} from '@/components/EndUserComm/http-services-sdk/be-types';
import {renderMessage} from '@/components/EndUserComm/lib/contentRenderer';
import {MessageStatus, ButtonAction} from '@/components/EndUserComm/http-services-sdk/be-types';
import {MESSAGE_CARD_WIDTH, MESSAGE_CARD_HEIGHT} from '@/components/EndUserComm/lib/messageCardConstants';
import {closeWindow} from './webview';

export function AgentBroadcastPage() {
    const params = useParams();
    const triggerTargetId = params?.triggerTargetId as string;
    const [renderedHtml, setRenderedHtml] = useState<string>('');
    const [buttons, setButtons] = useState<MessageButtons | null>(null);
    const [agentAuth, setAgentAuth] = useState<string | null>(null);
    const [expirationTime, setExpirationTime] = useState<number>(0);
    const expirationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

  // Set up expiration timer
  useEffect(() => {
    if (expirationTime === 0) return;

    const now = Date.now();
    const delay = expirationTime - now;

    if (delay <= 0) {
      // Already expired, close immediately
      console.log('Message expired, closing window');
      closeWindow();
      return;
    }

    // Set up timer to close window when expiration time is reached
    expirationTimerRef.current = setTimeout(() => {
      console.log('Message expired, closing window');
      closeWindow();
    }, delay);

    // Cleanup on unmount or when expirationTime changes
    return () => {
      if (expirationTimerRef.current) {
        clearTimeout(expirationTimerRef.current);
        expirationTimerRef.current = null;
      }
    };
  }, [expirationTime]);

  useEffect(() => {
    // Get agent_auth from query params (path-based routing)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const auth = urlParams.get('agent_auth');
      setAgentAuth(auth);

      if (auth) {
        loadMessage(auth);
      } else {
        console.error('No agent authentication token provided');
        closeWindow();
      }
    }
  }, [triggerTargetId]);

  async function loadMessage(auth: string) {
    try {
      if (!triggerTargetId) {
        console.error('No trigger target ID provided');
        closeWindow();
        return;
      }

      const response = await endUserCommSdk.uiAgentMessage.getMessageData(auth, triggerTargetId);
      const messageData: UiAgentMessageData = response.data;

      if (!messageData) {
        closeWindow();
        return;
      }

      // Set expiration time from message data
      setExpirationTime(messageData.expirationTime);

      // Use contentRenderer to handle all rendering logic with overrides
      const {html, buttons: renderedButtons} = renderMessage(
        messageData.template,
        messageData.titleLexical,
        messageData.bodyLexical,
        messageData.buttonsText
      );
      
      setRenderedHtml(html);
      setButtons(renderedButtons);
    } catch (err: any) {
      console.error('Error loading message:', err);
      closeWindow();
    }
  }

  function attachButtonHandlers(agentAuth: string) {
    if (!iframeRef.current || !triggerTargetId || !buttons) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    // Find all buttons inside iframe
    const buttonElements = iframeDoc.querySelectorAll('button');

    buttonElements.forEach((buttonElement, index) => {
      const buttonConfig = buttons.buttons[index];
      if (!buttonConfig) return;

      buttonElement.addEventListener('click', async () => {
        try {
          const action = buttonConfig.action; // Get action (Acknowledge/Cancel)

          if (action === ButtonAction.Acknowledge) {
            // Send acknowledgment to server
            await endUserCommSdk.uiAgentMessage.updateMessageStatus(
              agentAuth,
              triggerTargetId,
              {messageStatus: MessageStatus.Acknowledged}
            );
          } else if (action === ButtonAction.Cancel) {
            // For cancel, just close without updating status
          }

          closeWindow();
        } catch (err) {
          closeWindow();
        }
      });
    });
  }

  return (
      <iframe
        ref={iframeRef}
        srcDoc={renderedHtml}
        className="w-full h-screen border-0"
        style={{width: MESSAGE_CARD_WIDTH, height: MESSAGE_CARD_HEIGHT}}
        title="Broadcast Message"
        sandbox="allow-same-origin allow-scripts"
        onLoad={() => {
          // Attach button handlers when iframe is loaded
          if (agentAuth && triggerTargetId) {
            attachButtonHandlers(agentAuth);
          }
        }}/>
  );
}

