'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { endUserCommSdk } from '@/components/EndUserComm/http-services-sdk/http-sdk';
import type { UiUserPrivileges } from '@/components/EndUserComm/http-services-sdk/be-types';

interface PrivilegesContextValue {
    canManageMessages: boolean;
    canApproveMessages: boolean;
    canViewMessages: boolean;
    canSendMessages: boolean;
    canManageBrandConfiguration: boolean;
    canApproveBrandConfiguration: boolean;
}

const PrivilegesContext = createContext<PrivilegesContextValue | undefined>(undefined);

export const PrivilegesProvider = ({ children }: { children: ReactNode }) => {
    const [privileges, setPrivileges] = useState<UiUserPrivileges | null>(null);

    useEffect(() => {
        const loadPrivileges = async () => {
            try {
                const response = await endUserCommSdk.uiMgmtUser.getUserPrivileges();
                setPrivileges(response.data);
            } catch (err) {
                console.error('Failed to load user privileges:', err);
                // Set default privileges on error (view only)
                setPrivileges({
                    view: true,
                    manageBrandConfiguration: false,
                    approveBrandConfiguration: false,
                    manageMessages: false,
                    approveMessages: false,
                    sendMessages: false,
                });
            }
        };

        loadPrivileges();
    }, []);

    const value: PrivilegesContextValue = {
        canManageMessages: privileges?.manageMessages ?? false,
        canApproveMessages: privileges?.approveMessages ?? false,
        canViewMessages: privileges?.view ?? false,
        canSendMessages: privileges?.sendMessages ?? false,
        canManageBrandConfiguration: privileges?.manageBrandConfiguration ?? false,
        canApproveBrandConfiguration: privileges?.approveBrandConfiguration ?? false,
    };

    return (
        <PrivilegesContext.Provider value={value}>
            {children}
        </PrivilegesContext.Provider>
    );
};

export const usePrivileges = () => {
    const context = useContext(PrivilegesContext);
    if (context === undefined) {
        throw new Error('usePrivileges must be used within a PrivilegesProvider');
    }
    return context;
};
