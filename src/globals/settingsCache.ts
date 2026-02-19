import type { Setting as SettingType } from '../payload-types'

let cachedSettings: SettingType['brandDefaults'] | null = null

export const getCachedSettings = async (payload: any): Promise<SettingType['brandDefaults'] | null> => {
    if (cachedSettings) {
        return cachedSettings
    }

    try {
        const settings = await payload.findGlobal({
            slug: 'setting',
        })
        cachedSettings = settings.brandDefaults || null
        return cachedSettings
    } catch (error) {
        console.error('Failed to fetch settings global:', error)
        return null
    }
}

export const invalidateSettingsCache = () => {
    cachedSettings = null
}
