import {MessageType} from '@/components/EndUserComm/http-services-sdk/be-types';
import type {MessageChannel} from '@/components/EndUserComm/http-services-sdk/be-types';
import {Badge} from '../ui/display/badge';

// ============================================================================
// Type Badge
// ============================================================================

interface TypeBadgeProps {
  type: MessageType;
}

// Single source of truth for type colors
const TYPE_COLORS: Record<MessageType, { bg: string; text: string }> = {
  [MessageType.Notification]: { bg: 'bg-blue-100', text: 'text-blue-800' },
};

function getTypeColor(type: MessageType): string {
  const colors = TYPE_COLORS[type];
  return `${colors.bg} ${colors.text}`;
}

// Get background color class for filter dots
export function getTypeBgColor(type: MessageType): string {
  return TYPE_COLORS[type].bg;
}

export function TypeBadge({type}: TypeBadgeProps) {
  return (
    <Badge
      className={`${getTypeColor(type)} capitalize border-transparent px-2.5 py-1 text-sm`}>
      {type}
    </Badge>
  );
}

// ============================================================================
// Channel Badges
// ============================================================================

interface ChannelBadgesProps {
  channels: MessageChannel;
}

interface ChannelBadgeProps {
  channel: string;
}

// Single source of truth for channel colors
const CHANNEL_COLORS: Record<string, { bg: string; text: string }> = {
  riverbed: { bg: 'bg-orange-100', text: 'text-orange-800' },
};

function getChannelColor(channel: string): string {
  const colors = CHANNEL_COLORS[channel.toLowerCase()];
  if (!colors) {
    return 'bg-gray-100 text-gray-800';
  }
  return `${colors.bg} ${colors.text}`;
}

// Get background color class for filter dots
export function getChannelBgColor(channel: string): string {
  return CHANNEL_COLORS[channel.toLowerCase()]?.bg || 'bg-gray-100';
}

// Single channel badge component
export function ChannelBadge({channel}: ChannelBadgeProps) {
  return (
    <Badge
      className={`${getChannelColor(channel)} capitalize border-transparent px-2.5 py-1 text-sm`}>
      {channel}
    </Badge>
  );
}

export function ChannelBadges({channels}: ChannelBadgesProps) {
  // Extract channel names where the value is true (e.g., {riverbed: true, teams: false} → ['riverbed'])
  const activeChannels = Object.keys(channels).filter(key => channels[key as keyof MessageChannel]);

  return (
    <>
      {activeChannels.map((channel) => (
        <ChannelBadge
          key={channel}
          channel={channel}/>
      ))}
    </>
  );
}

