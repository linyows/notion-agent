/**
 * Notion Agent
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

const hasProp = (obj, key: string): boolean => {
  return !!obj && Object.hasOwnProperty.call(obj, key)
}

/**
 * Notion Client
 */
export class Notion {
  private token: string
  private spaceName: string
  private spaceId: string
  private count: number
  private stackedPages: Page[]

  public constructor(c: Config) {
    this.token = c.token
    this.spaceName = c.workspace
    this.count = 0
  }

  public request<T>({ endpoint, body }): T {
    const url = 'https://www.notion.so/api/v3/'

    const options = {
      headers: {
        accept: '*/*',
        'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        cookie: `token_v2=${this.token};`,
      },
      method: 'post' as const,
      muteHttpExceptions: true,
      payload: JSON.stringify(body),
    }
    const res = UrlFetchApp.fetch(`${url}${endpoint}`, options)
    this.count++
    if (res.getResponseCode() !== 200) {
      console.log(endpoint, this.count, res.getResponseCode(), res)
      return JSON.parse('{}')
    }

    return JSON.parse(res.getContentText())
  }

  public getTopLevelPages(): Page[] {
    const res = this.request<LoadUserContentResponse>({
      endpoint: 'loadUserContent',
      body: {},
    })

    if (!(hasProp(res.recordMap, 'space') && hasProp(res.recordMap, 'block'))) {
      return []
    }

    Object.values(res.recordMap.space).map((v: Space) => {
      if (v.value.name === this.spaceName) {
        this.spaceId = v.value.id
        return
      }
    })

    return Object.values(res.recordMap.block)
      .map(
        (v: Block): Page => {
          const { id, parent_id, properties, permissions } = v.value
          if (parent_id === this.spaceId && hasProp(properties, 'title')) {
            return {
              id,
              title: properties.title.join(','),
              isPublic: this.isPublic(permissions),
            }
          }
        }
      )
      .filter(el => {
        return el !== undefined
      })
      .filter((el, i, arr) => {
        return arr.findIndex(ell => el.id === ell.id) === i
      })
  }

  public isPublic(permissions: Permission[] | undefined): boolean {
    if (permissions === undefined) {
      return false
    }
    for (const o of permissions) {
      if (o.type && o.type === 'public_permission') {
        return true
      }
    }
    return false
  }

  public loadPageChunk(pageId: string): Block[] {
    const body = {
      pageId,
      limit: 1000,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false,
    }
    const res = this.request<LoadPageChunkResponse>({
      endpoint: 'loadPageChunk',
      body,
    })

    if (res && hasProp(res.recordMap, 'block')) {
      return Object.values(res.recordMap.block)
    }

    return []
  }

  public getChildPages(pageId: string): Page[] {
    const res = this.loadPageChunk(pageId)
    if (res.length === 0) {
      return []
    }

    const columns = res.filter(el => {
      return el.value.type === 'column'
    })

    const pages = res.map(
      (v: Block): Page => {
        const { id, parent_id, properties, type, permissions } = v.value
        if (type == 'page' && hasProp(properties, 'title')) {
          if (parent_id === pageId) {
            return {
              id,
              title: properties.title.join(','),
              isPublic: this.isPublic(permissions),
            } as Page
          } else {
            if (columns.some(el => el.value.id === parent_id)) {
              return {
                id,
                title: properties.title.join(','),
                isPublic: this.isPublic(permissions),
              } as Page
            }
          }
        }
      }
    )

    return pages
      .filter(el => {
        return el !== undefined
      })
      .filter((el, i, arr) => {
        return arr.findIndex(ell => el.id === ell.id) === i
      })
  }

  public getPagesRecursively(pages: Page[]): void {
    if (pages.length === 0) {
      return
    }

    const foundPages = []
    for (const page of pages) {
      //console.log(page)
      Utilities.sleep(Math.floor(Math.random() * Math.floor(10)) + 100)
      const gotPages = this.getChildPages(page.id)
      for (const gotPage of gotPages) {
        if (this.stackedPages.some(el => el.id === gotPage.id)) {
          continue
        }
        foundPages.push(gotPage)
      }
    }

    this.stackedPages = this.stackedPages
      .concat(...foundPages)
      .filter((el, i, arr) => {
        return arr.findIndex(ell => el.id === ell.id) === i
      })

    this.getPagesRecursively(foundPages)
  }

  public getAllPages(): Page[] {
    this.stackedPages = []
    const topLevelPages: Page[] = this.getTopLevelPages()
    this.getPagesRecursively(topLevelPages)
    return this.stackedPages
  }
}

export type Config = {
  token: string
  workspace: string
}

export type Page = {
  id: string
  title: string
  isPublic: boolean
}

type Properties = {
  title: string[]
}

type Format = {
  page_icon?: string
  page_cover?: string
  block_locked?: boolean
  block_locked_by?: string
  page_full_width?: boolean
  page_small_text?: boolean
  page_cover_position?: number
}

type Permission = {
  role?: string
  type?: string
  allow_duplicate?: boolean
  allow_search_engine_indexing?: boolean
}

type NotionUser = {
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

type UserSettings = {
  role: string
  value: {
    id: string
    version: number
    //settings: any[]
  }
}

type SpaceView = {
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

type Space = {
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

type Block = {
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

type Collection = {
  role: string
  value: {
    id: string
    version: number
    //name: any[]
    //schema: any
    icon: string
    content?: string[]
    discussions?: string[]
    //format?: any
    permissions?: Permission[]
    last_edited_by: string
    last_edited_time: number
    parent_id: string
    parent_table: string
    alive: boolean
  }
}

type LoadUserContentResponse = {
  recordMap?: {
    notion_user: { [index: string]: NotionUser }
    //user_root?: { [index: string]: any }
    user_settings: { [index: string]: UserSettings }
    space_view: { [index: string]: SpaceView }
    space: { [index: string]: Space }
    block: { [index: string]: Block }
    collection: { [index: string]: Collection }
  }
}

type LoadPageChunkResponse = {
  recordMap?: {
    block?: { [index: string]: Block }
  }
}
