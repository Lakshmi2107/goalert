/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */

export const pathPrefix = global.pathPrefix
export const applicationName = global.applicationName
export const apiRoot = location.origin.replace(":3000", ":3030")

export const GOALERT_VERSION = global.GOALERT_VERSION

export const isCypress = Boolean(global.Cypress)
export const AD_GROUP_FREETEXT_PERMIT = ['G_Sec_glass_create_edit_delete', 'G_Sec_glass_templates_view_create']

export const axiosApiRoot = (apiRoot.indexOf(':3030') !== -1) ? 'http://localhost:8083' : apiRoot
export const GLASS_SUPER_ADMIN_EDIT_DELETE = 'G_Sec_glass_create_edit_delete'
export const GLASS_TEMPLATES_VIEW_CREATE = 'G_Sec_glass_templates_view_create'
export const GLASS_TEMPLATES_IC = 'G_Sec_glass_templates_ic'
export const GLASS_TEMPLATES_TOC = 'G_Sec_glass_templates_toc'
export const GLASS_TEMPLATES_ITSD= 'G_Sec_glass_templates_itsd'
export const GLASS_TEMPLATES_ERE= 'G_glass_templates_ere'
export const GLASS_TEMPLATES_DR= 'G_glass_templates_dr'
export const SYSTEM_INTEGRATION_PREFIX_STR = 'System'