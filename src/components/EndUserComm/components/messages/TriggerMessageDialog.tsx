'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {StandardDialog} from '../ui/overlay/dialog';
import {Button} from '../ui/controls/button';
import { Send } from 'lucide-react';
import { endUserCommSdk } from '@/components/EndUserComm/http-services-sdk/http-sdk';
import type { UiEntityGroup } from '@/components/EndUserComm/http-services-sdk/be-types';

const MAX_EXPIRATION_DAYS = 30;
const SECONDS_PER_DAY = 86400;

function getMaxValueForUnit(unit: 'minutes' | 'hours' | 'days'): number {
  switch (unit) {
    case 'minutes': return MAX_EXPIRATION_DAYS * 24 * 60;
    case 'hours': return MAX_EXPIRATION_DAYS * 24;
    case 'days': return MAX_EXPIRATION_DAYS;
    default: return MAX_EXPIRATION_DAYS;
  }
}

function expirationToSeconds(value: number, unit: 'minutes' | 'hours' | 'days'): number {
  switch (unit) {
    case 'minutes': return value * 60;
    case 'hours': return value * 3600;
    case 'days': return value * SECONDS_PER_DAY;
    default: return 0;
  }
}

interface TriggerMessageDialogProps {
  open: boolean;
  onClose: () => void;
  messageName: string;
  definitionId: string;
  onTrigger: (data: {
    triggerType: TriggerType;
    deviceName?: string;
    entityGroup?: number;
    expirationValue: number;
    expirationUnit: 'minutes' | 'hours' | 'days';
    recipientText: string;
  }) => void;
}

export enum TriggerType {
  Device = 'device',
  Group = 'group'
}

export function TriggerMessageDialog({ open, onClose, messageName, onTrigger }: TriggerMessageDialogProps) {
  const [triggerType, setTriggerType] = useState<TriggerType>(TriggerType.Device);
  const [deviceSearchTerm, setDeviceSearchTerm] = useState('');
  const [deviceSearchResults, setDeviceSearchResults] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [showDeviceResults, setShowDeviceResults] = useState(false);
  const [entityGroups, setEntityGroups] = useState<UiEntityGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | ''>('');
  const [expirationValue, setExpirationValue] = useState(24);
  const [expirationUnit, setExpirationUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [entityGroupDropdownOpen, setEntityGroupDropdownOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const entityGroupDropdownRef = useRef<HTMLDivElement>(null);
  const unitDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (entityGroupDropdownRef.current && !entityGroupDropdownRef.current.contains(target)) {
        setEntityGroupDropdownOpen(false);
      }
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(target)) {
        setUnitDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxExpirationValue = useMemo(() => getMaxValueForUnit(expirationUnit), [expirationUnit]);
  const expirationSeconds = useMemo(
    () => expirationToSeconds(expirationValue, expirationUnit),
    [expirationValue, expirationUnit]
  );
  const maxExpirationSeconds = MAX_EXPIRATION_DAYS * SECONDS_PER_DAY;
  const expirationError = expirationSeconds > maxExpirationSeconds
    ? `Expiration cannot exceed ${MAX_EXPIRATION_DAYS} days.`
    : null;

  const loadEntityGroups = useCallback(async () => {
    try {
      setIsLoadingGroups(true);
      const response = await endUserCommSdk.uiMgmtGroups.getEntityGroups();
      setEntityGroups(response.data);
    } catch (error) {
      console.error('Error loading entity groups:', error);
      alert('Failed to load entity groups. Please try again.');
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  // Load entity groups when dialog opens
  useEffect(() => {
    if (open) {
      loadEntityGroups();
    }
  }, [open, loadEntityGroups]);

  // Search devices when search term changes
  useEffect(() => {
    // Immediately hide results when switching away from device type
    if (triggerType !== TriggerType.Device) {
      setDeviceSearchResults([]);
      setShowDeviceResults(false);
      return;
    }

    // Don't search if the search term matches the selected device (user already selected)
    if (selectedDevice && deviceSearchTerm.trim() === selectedDevice.trim()) {
      return;
    }

    if (deviceSearchTerm.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        searchDevices(deviceSearchTerm.trim());
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      setDeviceSearchResults([]);
      setShowDeviceResults(false);
    }
  }, [deviceSearchTerm, triggerType, selectedDevice]);

  const searchDevices = async (hostnameStartsWith: string) => {
    try {
      setIsLoadingDevices(true);
      const response = await endUserCommSdk.uiMgmtSearch.searchDevices(hostnameStartsWith);
      setDeviceSearchResults(response.data);
      setShowDeviceResults(true);
    } catch (error) {
      console.error('Error searching devices:', error);
      setDeviceSearchResults([]);
      setShowDeviceResults(false);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const handleTrigger = () => {
    if (expirationValue <= 0) {
      alert('Please enter a valid expiration time');
      return;
    }
    if (expirationError) {
      alert(expirationError);
      return;
    }

    // Prepare recipient text for success message
    let recipientText: string;
    if (triggerType === TriggerType.Device) {
      if (!selectedDevice.trim()) {
        alert('Please select a device');
        return;
      }
      recipientText = `device "${selectedDevice.trim()}"`;
      onTrigger({
        triggerType: TriggerType.Device,
        deviceName: selectedDevice.trim(),
        expirationValue,
        expirationUnit,
        recipientText
      });
    } else {
      if (!selectedGroupId) {
        alert('Please select an entity group');
        return;
      }
      const selectedGroup = entityGroups.find(group => group.id === Number(selectedGroupId));
      recipientText = selectedGroup
        ? `group "${selectedGroup.name}"`
        : `group (ID: ${selectedGroupId})`;
      onTrigger({
        triggerType: TriggerType.Group,
        entityGroup: Number(selectedGroupId),
        expirationValue,
        expirationUnit,
        recipientText
      });
    }

    // Reset form
    setTriggerType(TriggerType.Device);
    setDeviceSearchTerm('');
    setSelectedDevice('');
    setDeviceSearchResults([]);
    setShowDeviceResults(false);
    setSelectedGroupId('');
    setExpirationValue(24);
    setExpirationUnit('hours');

    // Close the trigger dialog
    onClose();
  };

  const handleDeviceSelect = (deviceName: string) => {
    setSelectedDevice(deviceName);
    setDeviceSearchTerm(deviceName);
    setShowDeviceResults(false);
  };

  const handleTriggerTypeChange = (newType: TriggerType) => {
    setTriggerType(newType);
    // Reset all state when switching trigger types
    setSelectedDevice('');
    setDeviceSearchTerm('');
    setDeviceSearchResults([]);
    setShowDeviceResults(false);
    setSelectedGroupId('');
  };

  // Check if trigger button should be disabled
  const isTriggerDisabled = expirationValue <= 0 ||
    !!expirationError ||
    (triggerType === TriggerType.Device && !selectedDevice.trim()) ||
    (triggerType === TriggerType.Group && !selectedGroupId);

  return (
    <>
    <StandardDialog
      open={open}
      onClose={onClose}
      title="Send Message"
      description={
        <>
          Send <strong>{messageName}</strong> to the selected recipients
        </>
      }
      maxWidth="max-w-md"
      footer={
        <div className="flex justify-end items-center gap-3 w-full">
          <Button
            onClick={onClose}
            variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={handleTrigger}
            variant="purple"
            disabled={isTriggerDisabled}>
            <Send className="w-4 h-4 mr-2"/>
            Send
          </Button>
        </div>
      }>
      {/* Dialog Content */}
      <div className="flex-1 min-h-0">
        <div className="p-6">
          <div className="space-y-4">
          {/* Trigger Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Recipients *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="triggerType"
                  value={TriggerType.Device}
                  checked={triggerType === TriggerType.Device}
                  onChange={(e) => {
                    const newType = e.target.value as TriggerType;
                    handleTriggerTypeChange(newType);
                  }}
                  className="w-4 h-4 text-purple-900 focus:ring-purple-900 border-gray-300 mr-2"/>
                <span className="text-sm text-gray-700">Single Device</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="triggerType"
                  value={TriggerType.Group}
                  checked={triggerType === TriggerType.Group}
                  onChange={(e) => {
                    const newType = e.target.value as TriggerType;
                    handleTriggerTypeChange(newType);
                  }}
                  className="w-4 h-4 text-purple-900 focus:ring-purple-900 border-gray-300 mr-2"/>
                <span className="text-sm text-gray-700">Multiple Devices</span>
              </label>
            </div>
          </div>

          {/* Device Search Option */}
          {triggerType === TriggerType.Device && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Device *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deviceSearchTerm}
                  onChange={(e) => {
                    setDeviceSearchTerm(e.target.value);
                    setSelectedDevice('');
                  }}
                  placeholder="Search device name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900"/>
                {showDeviceResults && deviceSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto [background:white]">
                    {deviceSearchResults.map((device) => (
                      <div
                        key={device}
                        onClick={() => handleDeviceSelect(device)}
                        className={`px-3 py-2 cursor-pointer hover:bg-purple-50 ${
                          selectedDevice === device ? 'bg-purple-100' : ''
                        }`}>
                        {device}
                      </div>
                    ))}
                  </div>
                )}
                {showDeviceResults && deviceSearchResults.length === 0 && deviceSearchTerm.length > 0 && !isLoadingDevices && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg [background:white]">
                    <div className="px-3 py-2 text-sm text-gray-500">No devices found</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Entity Group Option */}
          {triggerType === TriggerType.Group && (
            <div ref={entityGroupDropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entity Group *
              </label>
              <button
                type="button"
                disabled={isLoadingGroups || entityGroups.length === 0}
                onClick={() => setEntityGroupDropdownOpen((v) => !v)}
                title={selectedGroupId ? entityGroups.find((g) => g.id === Number(selectedGroupId))?.name : undefined}
                className={`w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 text-left flex items-center justify-between gap-2 ${
                  isLoadingGroups || entityGroups.length === 0
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-900'
                }`}
                aria-haspopup="listbox"
                aria-expanded={entityGroupDropdownOpen}
                aria-label="Select entity group">
                <span className="truncate min-w-0">
                  {selectedGroupId
                    ? entityGroups.find((g) => g.id === Number(selectedGroupId))?.name ?? `Group ${selectedGroupId}`
                    : 'Select entity group...'}
                </span>
                <svg className="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {entityGroupDropdownOpen && (
                <ul
                  className={`absolute z-50 mt-1 left-0 right-0 w-full rounded-lg border border-gray-300 shadow-lg py-1 ${
                    entityGroups.length > 4 ? 'dropdown-list-scroll' : ''
                  }`}
                  role="listbox"
                  style={{
                    backgroundColor: '#ffffff',
                    ...(entityGroups.length > 4 ? { maxHeight: '12rem', overflowY: 'scroll' } : {}),
                  }}
                >
                  {entityGroups.map((group) => (
                    <li
                      key={group.id}
                      role="option"
                      aria-selected={selectedGroupId === group.id}
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setEntityGroupDropdownOpen(false);
                      }}
                      className={`px-3 py-2 cursor-pointer truncate ${
                        selectedGroupId === group.id ? 'bg-purple-100 text-purple-900' : 'bg-white hover:bg-purple-50 text-gray-900'
                      }`}
                      title={group.name}>
                      {group.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Expiration Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Expiration *
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={maxExpirationValue}
                value={expirationValue}
                onChange={(e) => setExpirationValue(Number(e.target.value) || 0)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  expirationError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter value"
                aria-invalid={!!expirationError}
                aria-describedby={expirationError ? 'expiration-error' : undefined}
              />
              <div ref={unitDropdownRef} className="relative min-w-[7rem]">
                <button
                  type="button"
                  onClick={() => setUnitDropdownOpen((v) => !v)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 bg-white text-gray-900 flex items-center justify-between gap-2"
                  aria-haspopup="listbox"
                  aria-expanded={unitDropdownOpen}
                  aria-label="Expiration unit">
                  <span>{expirationUnit === 'minutes' ? 'Minutes' : expirationUnit === 'hours' ? 'Hours' : 'Days'}</span>
                  <svg className="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {unitDropdownOpen && (
                  <ul
                    className="absolute z-50 mt-1 left-0 right-0 w-full rounded-lg border border-gray-300 shadow-lg overflow-hidden py-0.5"
                    role="listbox"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    {(['minutes', 'hours', 'days'] as const).map((unit) => (
                      <li
                        key={unit}
                        role="option"
                        aria-selected={expirationUnit === unit}
                        onClick={() => {
                          setExpirationUnit(unit);
                          setUnitDropdownOpen(false);
                        }}
                        className={`px-3 py-1.5 cursor-pointer text-sm ${
                          expirationUnit === unit ? 'bg-purple-100 text-purple-900' : 'bg-white hover:bg-purple-50 text-gray-900'
                        }`}>
                        {unit === 'minutes' ? 'Minutes' : unit === 'hours' ? 'Hours' : 'Days'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {expirationError && (
              <p id="expiration-error" className="text-xs text-red-600 mt-1" role="alert">
                {expirationError}
              </p>
            )}
            {!expirationError && (
              <p className="text-xs text-gray-500 mt-1">
                The message will no longer be shown after this period (max {MAX_EXPIRATION_DAYS} days)
              </p>
            )}
          </div>
          </div>
        </div>
      </div>
    </StandardDialog>
  </>
  );
}
