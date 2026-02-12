'use client'
import {useState} from "react";
import {useLastModifiedSort} from "@/components/EndUserComm/hooks/useLastModifiedSort";
import {Copy, Edit, Eye, Trash2} from "lucide-react";
import {PreviewTemplateDialog} from "./PreviewTemplateDialog";
import {type MessageChannel, type UiMessageTemplate, type UiMessageTemplateInfo} from "@/components/EndUserComm/http-services-sdk/be-types";
import {endUserCommSdk} from "@/components/EndUserComm/http-services-sdk/http-sdk";
import {ChannelBadges, getChannelBgColor, getTypeBgColor, TypeBadge} from "../shared/MessageBadges";
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
    CardDescription,
    CardFooter,
    CardHeader,
    CardIconButton,
    CardTitle,
} from "../ui/display/card";
import {ViewToggle} from "../ui/controls/view-toggle";
import {FilterToggle} from "../ui/filters/filter-toggle";
import {FilterButtons} from "../ui/filters/filter-buttons";
import {SearchInput} from "../ui/controls/search-input";
import {FilterPanel} from "../ui/filters/filter-panel";
import {type ActiveFilter, ActiveFiltersDisplay} from "../ui/filters/active-filters-display";

export type Template = UiMessageTemplateInfo;

interface TemplateManagerProps {
    templates: Template[];
    onTemplatesChange: (templates: Template[]) => void;
}

export function TemplateManager({
    templates,
    onTemplatesChange,
}: TemplateManagerProps) {
    const setTemplates = onTemplatesChange;

    const [previewTemplate, setPreviewTemplate] = useState<UiMessageTemplate | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ type?: string[]; channel?: string[] }>({});

    // Format date helper
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Filter templates based on selected filters and search term
    const filteredTemplates = templates.filter((template) => {
        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                template.name.toLowerCase().includes(searchLower) ||
                (template.description?.toLowerCase().includes(searchLower) ?? false);
            if (!matchesSearch) return false;
        }

        // Type filters
        if (selectedFilters.type && selectedFilters.type.length > 0) {
            if (!selectedFilters.type.includes(template.type)) return false;
        }

        // Channel filters
        if (selectedFilters.channel && selectedFilters.channel.length > 0) {
            const hasMatchingChannel = selectedFilters.channel.some(
                channel => template.channels[channel as keyof typeof template.channels]
            );
            if (!hasMatchingChannel) return false;
        }

        return true;
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

    const clearFilters = () => {
        setSelectedFilters({});
    };

    // Delete template handler
    const handleDeleteTemplate = (templateId: string) => {
        if (confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
            const updatedTemplates = templates.filter((t) => t.id !== templateId);
            setTemplates(updatedTemplates);
        }
    };

    // Duplicate template handler
    const handleDuplicateTemplate = (templateId: string) => {
        const templateToDuplicate = templates.find((t) => t.id === templateId);
        if (templateToDuplicate) {
            const duplicatedTemplate: Template = {
                ...templateToDuplicate,
                id: Date.now().toString(),
                name: `${templateToDuplicate.name} (Copy)`,
            };
            setTemplates([...templates, duplicatedTemplate]);
        }
    };

    // Preview template handler - fetches full template data
    const handlePreviewTemplate = async (templateId: string) => {
        setIsLoadingPreview(true);
        try {
            const response = await endUserCommSdk.uiMgmtMessage.getTemplate(templateId);
            setPreviewTemplate(response.data);
        } catch (error) {
            console.error('Error fetching template for preview:', error);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    // Calculate filter data dynamically from templates
    // Get unique types from templates
    const uniqueTypes = Array.from(new Set(templates.map(t => t.type)));
    const typeData = uniqueTypes.map(type => ({
        name: type,
        key: type,
        value: templates.filter((t) => t.type === type).length,
        colorClass: getTypeBgColor(type),
    })).filter((item) => item.value > 0);

    // Get unique channels from templates
    const allChannelKeys = templates.flatMap(t =>
        Object.keys(t.channels).filter(key => t.channels[key as keyof MessageChannel])
    );
    const uniqueChannels = Array.from(new Set(allChannelKeys));
    const channelData = uniqueChannels.map(channel => ({
        name: channel.charAt(0).toUpperCase() + channel.slice(1), // Capitalize first letter
        key: channel,
        value: templates.filter((t) => t.channels[channel as keyof MessageChannel]).length,
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

    const {sortDirection, handleSort, sortedItems: sortedTemplates} = useLastModifiedSort(filteredTemplates);

    return (
        <div className="twp p-8">
            {/* Search and View Mode Toggle */}
            <div className="mb-4 flex gap-3 items-center">
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search templates..."/>

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
                    onClearAll={clearFilters}
                    className="mb-4"/>
            )}

            {/* Filter Panel */}
            {showFilterPanel && (
                <FilterPanel
                    title="Templates filtered by active criteria"
                    hasActiveFilters={
                        (selectedFilters.type !== undefined && selectedFilters.type.length > 0) ||
                        (selectedFilters.channel !== undefined && selectedFilters.channel.length > 0)
                    }
                    onClearFilters={clearFilters}
                    className="mb-8">
                    <FilterButtons
                        label="Type"
                        options={typeData}
                        selectedValues={selectedFilters.type}
                        totalCount={templates.length}
                        onFilterChange={(key) => handleFilterChange("type", key)}
                        onClearFilter={() => setSelectedFilters((prev) => ({ ...prev, type: undefined }))}/>
                    <FilterButtons
                        label="Channel"
                        options={channelData}
                        selectedValues={selectedFilters.channel}
                        totalCount={templates.length}
                        onFilterChange={(key) => handleFilterChange("channel", key)}
                        onClearFilter={() => setSelectedFilters((prev) => ({ ...prev, channel: undefined }))}/>
                </FilterPanel>
            )}

            {/* Templates Grid/Table */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card key={template.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <CardTitle>{template.name}</CardTitle>
                                    </div>
                                    <TypeBadge type={template.type}/>
                                </div>
                            </CardHeader>

                            <CardBody>
                                {template.description && (
                                    <CardDescription>{template.description}</CardDescription>
                                )}
                                <div>
                                    <p className="text-gray-500 text-xs mb-2">Supported Channels</p>
                                    <div className="flex flex-wrap gap-2">
                                        <ChannelBadges channels={template.channels}/>
                                    </div>
                                </div>
                            </CardBody>

                            <CardFooter>
                                <CardActionButton
                                    onClick={() => handlePreviewTemplate(template.id)}
                                    disabled={isLoadingPreview}
                                    icon={Eye}
                                    variant="secondary">
                                    {isLoadingPreview ? 'Loading...' : 'Preview'}
                                </CardActionButton>
                                <CardActions>
                                    <CardIconButton
                                        disabled
                                        title="Edit"
                                        icon={Edit}/>
                                    <CardIconButton
                                        disabled
                                        title="Copy"
                                        icon={Copy}/>
                                    <CardIconButton
                                        disabled
                                        title="Delete"
                                        icon={Trash2}/>
                                </CardActions>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Channels</TableHead>
                            <TableHeadSortable
                                sortDirection={sortDirection}
                                onSort={handleSort}>
                                Last Modified
                            </TableHeadSortable>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTemplates.map((template) => (
                            <TableRow key={template.id}>
                                <TableCell variant="primary">
                                    {template.name}
                                </TableCell>
                                <TableCell variant="secondary">
                                    {template.description}
                                </TableCell>
                                <TableCell>
                                    <TypeBadge type={template.type}/>
                                </TableCell>
                                <TableCell>
                                    <ChannelBadges channels={template.channels}/>
                                </TableCell>
                                <TableCell variant="secondary">
                                    {formatDate(template.updatedAt)}
                                </TableCell>
                                <TableCell>
                                    <TableActions>
                                        <TableActionButton
                                            onClick={() => handlePreviewTemplate(template.id)}
                                            disabled={isLoadingPreview}
                                            title="Preview"
                                            icon={Eye}/>
                                        <TableActionButton
                                            disabled
                                            title="Edit"
                                            icon={Edit}/>
                                        <TableActionButton
                                            disabled
                                            title="Copy"
                                            icon={Copy}/>
                                        <TableActionButton
                                            disabled
                                            title="Delete"
                                            icon={Trash2}/>
                                    </TableActions>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Preview Template Dialog */}
            {previewTemplate && (
                <PreviewTemplateDialog
                    open={true}
                    onClose={() => setPreviewTemplate(null)}
                    template={previewTemplate}/>
            )}
        </div>
    );
}
