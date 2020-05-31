/**
 * Notion Agent
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

export type Properties = {
  title: string[]
}

export type Format= {
  page_icon?: string
  page_cover?: string
  block_locked?: boolean
  block_locked_by?: string
  page_full_width?: boolean
  page_small_text?: boolean
  page_cover_position?: number
}

export type Permission = {
  role?: string
  type?: string
  allow_duplicate?: boolean
  allow_search_engine_indexing?: boolean
}

export type NotionUser = {
  role: string
  value: {
    id: string
    version: number
    email: string
    given_name: string
    family_name: string
    profile_photo: string
    onboarding_completed: boolean
    mobile_onboarding_completed: boolean
    clipper_onboarding_completed: boolean
  }
}

export type UserSettings = {
  role: string
  value: {
    id: string
    version: number
    settings: object[]
  }
}

export type SpaceView = {
  role: string
  value: {
    id: string
    version: number
    space_id: string
    bookmarked_pages: string[]
    parent_id: string
    parent_table: string
    alive: boolean
    notify_mobile: boolean
    notify_desktop: boolean
    notify_email: boolean
    visited_templates: string[]
    sidebar_hidden_templates: string[]
    created_getting_started: boolean
  }
}

export type Space = {
  role: string
  value: {
    id: string
    version: number
    name: string
    domain: string
    permissions: Permission[]
    icon: string
    beta_enabled: boolean
    pages: string[]
    disable_public_access: boolean
    disable_guests: boolean
    disable_move_to_space: boolean
    disable_export: boolean
    created_by: string
    created_time: number
    last_edited_by: string
    created_by_table: string
    created_by_id: string
    last_edited_by_table: string
    last_edited_by_id: string
    shared_id: number
    plan_type: string
    invite_link_code: string
    invite_link_enabled: boolean
  }
}

export type Block = {
  role: string
  value: {
    id: string
    version: number
    type: string
    properties: Properties
    content?: string[]
    discussions?: string[]
    format?: Format
    permissions?: Permission[]
    created_by: string
    created_time: number
    last_edited_by: string
    last_edited_time: number
    parent_id: string
    parent_table: string
    alive: boolean
    copied_from?: string
    file_ids?: string[]
    created_by_table: string
    created_by_id: string
    last_edited_by_table: string
    last_edited_by_id: string
  }
}

export type Collection = {
  role: string
  value: {
    id: string
    version: number
    name: any[]
    schema: any
    icon: string
    content?: string[]
    discussions?: string[]
    format?: any
    permissions?: Permission[]
    last_edited_by: string
    last_edited_time: number
    parent_id: string
    parent_table: string
    alive: boolean
  }
}

export type LoadUserContentResponse = {
  recordMap: {
    notion_user: { [index: string]: NotionUser }
    user_root?: { [index: string]: object }
    user_settings: { [index: string]: UserSettings }
    space_view: { [index: string]: SpaceView }
    space: { [index: string]: Space }
    block: { [index: string]: Block }
    collection: { [index: string]: Collection }
  }
}

export type LoadPageChunkResponse = {
  recordMap?: {
    block?: { [index: string]: Block }
  }
}
