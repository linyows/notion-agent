/**
 * Notion Public Detctor
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

interface SlackField {
  title: string
  value: string
}

interface SlackAttachment {
  title: string
  title_link: string
  color: string
  text: string
  fields?: SlackField[]
}

interface SlackPostMessageOpts {
  username: string
  icon_emoji: string
  link_names: number
  text: string
  attachments?: string
}

interface SlackChannel {
  id: string
  name: string
  members: string[]
}

/**
 * Slack Client
 */
export class Slack {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  public joinChannel(channel: string): SlackChannel {
    const res = UrlFetchApp.fetch('https://slack.com/api/channels.join', {
      method: 'post',
      payload: {
        token: this.token,
        name: channel
      }
    })

    return JSON.parse(res.getContentText()).channel
  }

  public postMessage(channel: string, opts: SlackPostMessageOpts) {
    this.joinChannel(channel)

    const res = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
      method: 'post',
      payload: { ...{ token: this.token, channel: channel }, ...opts }
    })

    return JSON.parse(res.getContentText()).ok
  }
}
