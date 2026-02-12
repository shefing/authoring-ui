'use client'
import {useState} from "react";
import {useLastModifiedSort} from "@/components/EndUserComm/hooks/useLastModifiedSort";
import {Copy, Edit, Eye, FileText, Send, Trash2} from "lucide-react";
import {CreateMessageDialog} from "./CreateMessageDialog";
import {PreviewMessageDialog} from "./PreviewMessageDialog";
import type {Template} from "../templates/TemplateManager";
import {TriggerMessageDialog, TriggerType} from "./TriggerMessageDialog";
import {AlertDialog} from "../ui/display/alert";
import {convertExpirationToSeconds} from "@/components/EndUserComm/lib/messageUtils";
import type {
    MessageType as BeMessageType,
    UiMessageInfo,
    UiMessageDefinition,
    UiMessageTemplate,
    UiNewMessageDefinitionRequest,
} from "@/components/EndUserComm/http-services-sdk/be-types";
import {MessageType} from "@/components/EndUserComm/http-services-sdk/be-types";
import {endUserCommSdk} from "@/components/EndUserComm/http-services-sdk/http-sdk";
import {ChannelBadge, getChannelBgColor, getTypeBgColor, TypeBadge} from "../shared/MessageBadges";
import {
    Table,
    TableActionButton,
    TableActions,
    TableBody,
    TableCell,
    TableHead,
    TableHeadSortable,
    TableHeader,
    TableRow,
} from "../ui/display/table";
import {
    Card,
    CardActionButton,
    CardActions,
    CardBody,
    CardFooter,
    CardHeader,
    CardIconButton,
    CardTitle,
} from "../ui/display/card";
import {ViewToggle} from "../ui/controls/view-toggle";
import {FilterToggle} from "../ui/filters/filter-toggle";
import {FilterButtons, type FilterOption} from "../ui/filters/filter-buttons";
import {SearchInput} from "../ui/controls/search-input";
import {FilterPanel} from "../ui/filters/filter-panel";
import {type ActiveFilter, ActiveFiltersDisplay} from "../ui/filters/active-filters-display";
import type {MessageChannel} from "@/components/EndUserComm/http-services-sdk/be-types";
import { usePrivileges } from "@/components/EndUserComm/hooks/usePrivileges";

interface MessageManagerProps {
    templates: Template[];
    messages: UiMessageInfo[];
    onMessagesChange: (messages: UiMessageInfo[]) => void;
    showCreateDialog?: boolean;
    setShowCreateDialog?: (show: boolean) => void;
}

export function MessageManager({
    templates,
    messages,
    onMessagesChange,
    showCreateDialog: externalShowCreate,
    setShowCreateDialog: externalSetShowCreate,
}: MessageManagerProps) {
    const { canManageMessages, canSendMessages } = usePrivileges();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{
        type?: string[];
        channel?: string[];
    }>({});
    const [previewMessage, setPreviewMessage] = useState<UiMessageDefinition | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<UiMessageTemplate | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [editMessage, setEditMessage] = useState<UiMessageInfo | null>(null);
    const [broadcastMessage, setBroadcastMessage] = useState<UiMessageInfo | null>(null);
    const [deleteMessage, setDeleteMessage] = useState<UiMessageInfo | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<{messageName: string; recipientText: string} | null>(null);
    const [internalShowCreateDialog, setInternalShowCreateDialog] =
        useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    // Format date helper
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getMessageMetadata = (message: UiMessageInfo) => {
        const template = templates.find((t) => t.id === message.templateId);
        const messageType = template?.type;
        const messageChannel = template?.channels
            ? Object.keys(template.channels).find(
                  (key) =>
                      template.channels[
                          key as keyof typeof template.channels
                      ],
              )
            : null;

        return { template, messageType, messageChannel };
    };

    // Use external state if provided, otherwise use internal state
    const showCreateDialog =
        externalShowCreate !== undefined
            ? externalShowCreate
            : internalShowCreateDialog;
    const setShowCreateDialog = externalSetShowCreate || setInternalShowCreateDialog;

    const filteredMessages = messages.filter((msg) => {
        const matchesSearch = msg.definitionName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const template = templates.find((t) => t.id === msg.templateId);
        const matchesType =
            !selectedFilters.type ||
            selectedFilters.type.length === 0 ||
            !template ||
            selectedFilters.type.includes(template.type);
        // Find which channel is true in the template
        const templateChannel = template?.channels
            ? Object.keys(template.channels).find(
                (key) =>
                    template.channels[key as keyof typeof template.channels],
            )
            : null;
        const matchesChannel =
            !selectedFilters.channel ||
            selectedFilters.channel.length === 0 ||
            !templateChannel ||
            selectedFilters.channel.includes(templateChannel);

        return matchesSearch && matchesType && matchesChannel;
    });

    const handleFilterChange = (filterType: string, value: string) => {
        setSelectedFilters((prev) => {
            const currentFilters = prev[filterType as keyof typeof prev] || [];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter((v) => v !== value)
                : [...currentFilters, value];

            return {
                ...prev,
                [filterType]: newFilters.length > 0 ? newFilters : undefined,
            };
        });
    };

    const handleClearFilters = () => {
        setSelectedFilters({});
    };


    // Calculate filter data dynamically from messages
    const uniqueTypes = Array.from(new Set(
        messages
            .map(msg => templates.find(t => t.id === msg.templateId)?.type)
            .filter((type): type is MessageType => !!type)
    ));
    const typeData: FilterOption[] = uniqueTypes.map(type => ({
        name: type,
        key: type,
        value: messages.filter(msg => {
            const template = templates.find(t => t.id === msg.templateId);
            return template?.type === type;
        }).length,
        colorClass: getTypeBgColor(type),
    })).filter((item) => item.value > 0);

    // Get unique channels from messages
    const allChannelKeys = messages.flatMap(msg => {
        const template = templates.find(t => t.id === msg.templateId);
        return template?.channels
            ? Object.keys(template.channels).filter(key => template.channels[key as keyof MessageChannel])
            : [];
    });
    const uniqueChannels = Array.from(new Set(allChannelKeys));
    const channelData: FilterOption[] = uniqueChannels.map(channel => ({
        name: channel.charAt(0).toUpperCase() + channel.slice(1),
        key: channel,
        value: messages.filter(msg => {
            const template = templates.find(t => t.id === msg.templateId);
            return template?.channels?.[channel as keyof MessageChannel];
        }).length,
        colorClass: getChannelBgColor(channel),
    })).filter((item) => item.value > 0);

    // Build active filters list
    const activeFilters: ActiveFilter[] = [];
    if (selectedFilters.type) {
        selectedFilters.type.forEach(typeKey => {
            const typeInfo = typeData.find(t => t.key === typeKey);
            if (typeInfo) {
                activeFilters.push({
                    category: 'Type',
                    label: typeInfo.name,
                    value: typeKey,
                    colorClass: typeInfo.colorClass,
                });
            }
        });
    }
    if (selectedFilters.channel) {
        selectedFilters.channel.forEach(channelKey => {
            const channelInfo = channelData.find(c => c.key === channelKey);
            if (channelInfo) {
                activeFilters.push({
                    category: 'Channel',
                    label: channelInfo.name,
                    value: channelKey,
                    colorClass: channelInfo.colorClass,
                });
            }
        });
    }

    const handleRemoveFilter = (category: string, value: string) => {
        if (category === 'Type') {
            handleFilterChange('type', value);
        } else if (category === 'Channel') {
            handleFilterChange('channel', value);
        }
    };

    const {sortDirection, handleSort, sortedItems: sortedMessages} = useLastModifiedSort(filteredMessages);

    const handleBroadcast = async (data: {
        triggerType: TriggerType;
        deviceName?: string;
        entityGroup?: number;
        expirationValue: number;
        expirationUnit: "minutes" | "hours" | "days";
        recipientText: string;
    }) => {
        if (!broadcastMessage) return;

        try {
            // Calculate expiration time in seconds
            const expirationTimeSeconds = convertExpirationToSeconds(
                data.expirationValue,
                data.expirationUnit
            );

            let response;
            if (data.triggerType === TriggerType.Device) {
                if (!data.deviceName) {
                    setErrorMessage('Device name is required');
                    return;
                }
                response = await endUserCommSdk.uiMgmtMessage.triggerMsgForDevice({
                    definitionId: broadcastMessage.definitionId,
                    expirationTimeSeconds,
                    deviceName: data.deviceName
                });
            } else {
                if (!data.entityGroup) {
                    setErrorMessage('Entity group is required');
                    return;
                }
                response = await endUserCommSdk.uiMgmtMessage.triggerMsgForGroup({
                    definitionId: broadcastMessage.definitionId,
                    expirationTimeSeconds,
                    entityGroup: data.entityGroup
                });
            }

            // Check for errors in response
            if (response.data.errorMessage) {
                setErrorMessage(response.data.errorMessage);
                return;
            }

            // Update message with broadcast history
            onMessagesChange(
                messages.map((msg) =>
                    msg.definitionId === broadcastMessage.definitionId
                        ? {
                            ...msg,
                            broadcastHistory: null, // todo get from backend  [...(msg.broadcastHistory || []), broadcastRecord]
                        }
                        : msg,
                ),
            );

            // Store message name before closing dialog
            const messageName = broadcastMessage.definitionName;

            // Close the trigger dialog first
            setBroadcastMessage(null);

            // Show success alert after dialog closes
            setTimeout(() => {
                setSuccessMessage({
                    messageName,
                    recipientText: data.recipientText
                });
            }, 100);
        } catch (error) {
            console.error("Error triggering message:", error);
            const errorMsg = error instanceof Error
                ? error.message
                : "Failed to trigger message. Please try again.";
            setErrorMessage(errorMsg);
        }
    };

    const handleDeleteMessage = async () => {
        if (!deleteMessage) return;

        try {
            // Call API to delete message definition
            const response = await endUserCommSdk.uiMgmtMessage.deleteMsgDefinition(deleteMessage.definitionId);

            // Update messages list with the response from server
            onMessagesChange(response.data);
            setDeleteMessage(null);
        } catch (error) {
            console.error("Error deleting message definition:", error);
            const errorMsg = error instanceof Error
                ? error.message
                : "Failed to delete message. Please try again.";
            setErrorMessage(errorMsg);
            setDeleteMessage(null);
        }
    };

    const handleCopyMessage = async (message: UiMessageInfo) => {
        try {
            // Fetch the full message definition to get title, body, and button text
            const messageDefResponse = await endUserCommSdk.uiMgmtMessage.getMsgDefinition(message.definitionId);
            const messageDef = messageDefResponse.data;

            // Extract button text from buttonsText array (use first button or empty string)
            const buttonText = messageDef.buttonsText?.buttonText?.[0] || "";

            // Prepare request body for API with copied data
            const requestBody: UiNewMessageDefinitionRequest = {
                name: `${message.definitionName} (Copy)`,
                templateId: message.templateId,
                titleText: messageDef.titleLexical || "",
                bodyText: messageDef.bodyLexical || "",
                buttonText: buttonText,
            };

            // Call API to create new message definition
            const response = await endUserCommSdk.uiMgmtMessage.createMsgDefinition(requestBody);

            // Convert response to UiMessageInfo format
            const newMessage: UiMessageInfo = {
                definitionId: response.data.definitionId,
                definitionName: response.data.definitionName,
                templateId: response.data.templateId,
                updatedAt: response.data.updatedAt,
            };

            // Add to messages list
            onMessagesChange([newMessage, ...messages]);
        } catch (error) {
            console.error("Error copying message definition:", error);
            const errorMsg = error instanceof Error
                ? error.message
                : "Failed to copy message. Please try again.";
            setErrorMessage(errorMsg);
        }
    };

    // Preview message handler - fetches full definition and template data
    const handlePreviewMessage = async (messageInfo: UiMessageInfo) => {
        setIsLoadingPreview(true);

        try {
            // Fetch both definition and template in parallel
            const [definitionResponse, templateResponse] = await Promise.all([
                endUserCommSdk.uiMgmtMessage.getMsgDefinition(messageInfo.definitionId),
                endUserCommSdk.uiMgmtMessage.getTemplate(messageInfo.templateId)
            ]);

            setPreviewMessage(definitionResponse.data);
            setPreviewTemplate(templateResponse.data);
        } catch (error) {
            console.error('Error fetching message data for preview:', error);
            setErrorMessage('Failed to load message preview. Please try again.');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleClosePreview = () => {
        setPreviewMessage(null);
        setPreviewTemplate(null);
    };

    return (
        <div className="p-8">
            {/* Search and View Mode Toggle */}
            <div className="mb-4 flex gap-3 items-center">
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search messages..."/>

                {/* Filter View Mode Toggle */}
                <FilterToggle
                    isActive={showFilterPanel}
                    onToggle={() => setShowFilterPanel(!showFilterPanel)}/>

                {/* View Mode Toggle */}
                <ViewToggle
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}/>
            </div>

            {/* Active Filters Display - Show when filter panel is hidden and filters are active */}
            {!showFilterPanel && activeFilters.length > 0 && (
                <ActiveFiltersDisplay
                    filters={activeFilters}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearFilters}
                    className="mb-4"/>
            )}

            {/* Filter Panel */}
            {showFilterPanel && (
                <FilterPanel
                    title="Messages filtered by active criteria"
                    hasActiveFilters={
                        (selectedFilters.type !== undefined && selectedFilters.type.length > 0) ||
                        (selectedFilters.channel !== undefined && selectedFilters.channel.length > 0)
                    }
                    onClearFilters={handleClearFilters}
                    className="mb-8">
                    <FilterButtons
                        label="Type"
                        options={typeData}
                        selectedValues={selectedFilters.type}
                        totalCount={messages.length}
                        onFilterChange={(key) => handleFilterChange("type", key)}
                        onClearFilter={() => setSelectedFilters((prev) => ({ ...prev, type: undefined }))}/>
                    <FilterButtons
                        label="Channel"
                        options={channelData}
                        selectedValues={selectedFilters.channel}
                        totalCount={messages.length}
                        onFilterChange={(key) => handleFilterChange("channel", key)}
                        onClearFilter={() => setSelectedFilters((prev) => ({ ...prev, channel: undefined }))}/>
                </FilterPanel>
            )}

            {/* Messages Grid/Table */}
            {viewMode === "table" ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Channels</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHeadSortable
                                sortDirection={sortDirection}
                                onSort={handleSort}>
                                Last Modified
                            </TableHeadSortable>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMessages.map((message) => {
                            const { template, messageType, messageChannel } = getMessageMetadata(message);

                            return (
                                <TableRow key={message.definitionId}>
                                    <TableCell variant="primary">
                                        {message.definitionName}
                                    </TableCell>
                                    <TableCell>
                                        {messageType && (
                                            <TypeBadge
                                                type={messageType as BeMessageType}/>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {messageChannel && (
                                            <ChannelBadge channel={messageChannel}/>
                                        )}
                                    </TableCell>
                                    <TableCell variant="secondary">
                                        {template?.name}
                                    </TableCell>
                                    <TableCell variant="secondary">
                                        {formatDate(message.updatedAt)}
                                    </TableCell>
                                    <TableCell>
                                        <TableActions>
                                            <TableActionButton
                                                onClick={() => handlePreviewMessage(message)}
                                                title="Preview message"
                                                icon={Eye}/>
                                            <TableActionButton
                                                onClick={() => setEditMessage(message)}
                                                title={canManageMessages ? "Edit message" : "View message"}
                                                icon={canManageMessages ? Edit : FileText}/>
                                            {canManageMessages && (
                                                <TableActionButton
                                                    onClick={() => handleCopyMessage(message)}
                                                    title="Copy message"
                                                    icon={Copy}/>
                                            )}
                                            {canSendMessages && (
                                                <TableActionButton
                                                    onClick={() => setBroadcastMessage(message)}
                                                    title="Send message"
                                                    icon={Send}/>
                                            )}
                                            {canManageMessages && (
                                                <TableActionButton
                                                    onClick={() => setDeleteMessage(message)}
                                                    title="Delete message"
                                                    icon={Trash2}/>
                                            )}
                                        </TableActions>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMessages.map((message) => {
                            const { template, messageType, messageChannel } = getMessageMetadata(message);

                        return (
                            <Card key={message.definitionId}>
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <CardTitle>{message.definitionName}</CardTitle>
                                        </div>
                                        {messageType && (
                                                <TypeBadge type={messageType as BeMessageType}/>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardBody>
                                    {/* Channel */}
                                    <div>
                                        <p className="text-gray-500 text-xs mb-2">Channel</p>
                                        <div className="flex flex-wrap gap-2">
                                            {messageChannel && (
                                                    <ChannelBadge channel={messageChannel}/>
                                            )}
                                        </div>
                                    </div>

                                    {/* Template */}
                                    <div>
                                        <p className="text-gray-500 text-xs mb-2">Template</p>
                                        <p className="text-gray-900 text-sm">
                                            {template?.name || 'N/A'}
                                        </p>
                                    </div>
                                </CardBody>

                                <CardFooter>
                                    <CardActionButton
                                        onClick={() => handlePreviewMessage(message)}
                                        icon={Eye}
                                        variant="secondary">
                                        Preview
                                    </CardActionButton>
                                    <CardActions>
                                        <CardIconButton
                                            onClick={() => setEditMessage(message)}
                                            title={canManageMessages ? "Edit message" : "View message"}
                                            icon={canManageMessages ? Edit : FileText}/>
                                        {canManageMessages && (
                                            <CardIconButton
                                                onClick={() => handleCopyMessage(message)}
                                                title="Copy message"
                                                icon={Copy}/>
                                        )}
                                        {canSendMessages && (
                                            <CardIconButton
                                                onClick={() => setBroadcastMessage(message)}
                                                title="Send message"
                                                icon={Send}/>
                                        )}
                                        {canManageMessages && (
                                            <CardIconButton
                                                onClick={() => setDeleteMessage(message)}
                                                title="Delete message"
                                                icon={Trash2}/>
                                        )}
                                    </CardActions>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Preview Message Dialog */}
            {previewMessage && previewTemplate && (
                <PreviewMessageDialog
                    message={previewMessage}
                    template={previewTemplate}
                    open={!isLoadingPreview}
                    onClose={handleClosePreview}/>
            )}

            {/* Create Message Dialog */}
            <CreateMessageDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                templates={templates}
                messages={messages}
                onSubmit={(messageDefinition: UiMessageDefinition) => {
                    // Convert UiMessageDefinition to UiMessageInfo format
                    const newMessage: UiMessageInfo = {
                        definitionId: messageDefinition.definitionId,
                        definitionName: messageDefinition.definitionName,
                        templateId: messageDefinition.templateId,
                        updatedAt: messageDefinition.updatedAt,
                    };

                    // Add to messages list
                    onMessagesChange([newMessage, ...messages]);
                }}/>

            {/* Edit Message Dialog */}
            {editMessage && (
                <CreateMessageDialog
                    open={!!editMessage}
                    onClose={() => setEditMessage(null)}
                    editMessage={editMessage}
                    templates={templates}
                    messages={messages}
                    onSubmit={(messageDefinition: UiMessageDefinition) => {
                        // Convert UiMessageDefinition to UiMessageInfo format
                        const updatedMessage: UiMessageInfo = {
                            definitionId: messageDefinition.definitionId,
                            definitionName: messageDefinition.definitionName,
                            templateId: messageDefinition.templateId,
                            updatedAt: messageDefinition.updatedAt,
                        };

                        // Update messages list
                        onMessagesChange(
                            messages.map((msg) =>
                                msg.definitionId === editMessage.definitionId
                                    ? updatedMessage
                                    : msg,
                            ),
                        );
                        setEditMessage(null);
                    }}/>
            )}

            {/* Broadcast Dialog */}
            {broadcastMessage && (
                <TriggerMessageDialog
                    open={!!broadcastMessage}
                    onClose={() => setBroadcastMessage(null)}
                    messageName={broadcastMessage.definitionName}
                    definitionId={broadcastMessage.definitionId}
                    onTrigger={handleBroadcast}/>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteMessage && (
                <AlertDialog
                    open={!!deleteMessage}
                    onClose={() => setDeleteMessage(null)}
                    onConfirm={handleDeleteMessage}
                    title="Delete Message"
                    description={
                        <>
                            Are you sure you want to delete <strong>{deleteMessage.definitionName}</strong>? This action cannot be reverted.
                        </>
                    }
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    confirmVariant="destructive"
                    status="warning"/>
            )}

            {/* Error Alert Dialog */}
            {errorMessage && (
                <AlertDialog
                    open={!!errorMessage}
                    onClose={() => setErrorMessage(null)}
                    title="Error"
                    description={errorMessage}
                    confirmLabel="OK"
                    type="alert"
                    status="error"/>
            )}

            {/* Success Alert Dialog */}
            {successMessage && (
                <AlertDialog
                    open={!!successMessage}
                    onClose={() => setSuccessMessage(null)}
                    title="Message Sent"
                    description={
                        <>
                            Message <strong>{successMessage.messageName}</strong> has been sent to {successMessage.recipientText} successfully.
                        </>
                    }
                    confirmLabel="OK"
                    type="alert"
                    status="success"/>
            )}
        </div>
    );
}
