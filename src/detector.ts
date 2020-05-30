/**
 * Notion Public Detctor
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

import { Notion, Config as NotionConfig } from './notion'
import { Slack } from './slack'

export type SlackConfig = {
  token: string
  username: string
  text: string
  iconUrl: string
}

export type Config = {
  notion: NotionConfig
  slack: SlackConfig
}

/**
 * Detector
 */
export class Detector {
  private pSlack: any
  private config: Config

  private get slack(): any {
    if (this.pSlack === undefined) {
      this.pSlack = new Slack(this.config.slack.token)
    }

    return this.pSlack
  }

  constructor(c: Config) {
    this.config = c
  }

  private defaultSlackParams(lang: string) {
    return {
      username: this.config.slack.username,
      icon_url: this.config.slack.iconUrl,
      link_names: 1,
      text: this.config.slack.text.replace('%s', lang)
    }
  }

  public run() {
    const notion = new Notion(this.config.notion)
    const pages = notion.getAllPages()
    const publics = pages.filter((el, i, arr) => {
      return el.isPublic
    })
    console.log(publics)
    console.log(`${pages.length} pages`)

    /*
    const attachments: any[] = []

    this.slack.postMessage(task.channel, {
      ...this.defaultSlackParams(task.lang),
      ...{ attachments: JSON.stringify(attachments) } })
    */
  }
}
