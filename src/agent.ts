/**
 * Notion Agent
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

import { Notion, Page, Config as NotionConfig } from './notion'
import { Slack } from './slack'

/**
 * Agent
 */
export class Agent {
  private config: Config

  constructor(c: Config) {
    this.config = c
  }

  private get defaultSlackParams() {
    return {
      channel: this.config.slack.channel,
      username: this.config.slack.username,
      icon_url: this.config.slack.iconUrl,
      link_names: 1,
      text: this.config.slack.text,
    }
  }

  private get notionWorkspaceUrl(): string {
    return `https://www.notion.so/${this.config.notion.workspace}`
  }

  private makeSlackAttachments(pages: Page[]) {
    const publics = pages.filter(el => {
      return el.isPublic
    })

    const fields = publics.map(page => {
      return `• <${this.notionWorkspaceUrl}/${page.id.replace(/-/g, '')}|${
        page.title
      }> `
    })

    return [
      {
        color: '#444',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${publics.length}* public pages out of *${pages.length}* were found.`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: fields.join('\n'),
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'image',
                image_url: this.config.slack.contextIconUrl,
                alt_text: 'Notion Icon',
              },
              {
                type: 'mrkdwn',
                text: ` *Notion* | ${Utilities.formatDate(
                  new Date(),
                  'GMT',
                  'MMM d, yyyy'
                )}`,
              },
            ],
          },
        ],
      },
    ]
  }

  public run(): void {
    const notion = new Notion(this.config.notion)
    const pages = notion.getAllPages()
    const attachments = this.makeSlackAttachments(pages)

    const slack = new Slack(this.config.slack.token)
    slack.postMessage({
      ...this.defaultSlackParams,
      ...{ attachments: JSON.stringify(attachments) },
    })
  }
}

type SlackConfig = {
  token: string
  channel: string
  username: string
  text: string
  iconUrl: string
  contextIconUrl: string
}

export type Config = {
  notion: NotionConfig
  slack: SlackConfig
}
