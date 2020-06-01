/**
 * Notion Agent
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
  icon_emoji?: string
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

  public request(endpoint: string, body) {
    const res = UrlFetchApp.fetch(`https://slack.com/api/${endpoint}`, {
        method: 'post',
        payload: {
          token: this.token,
          ... body
        }
      })
    console.log(body, res.getContentText())
    return JSON.parse(res.getContentText())
  }

  public joinChannel(channel: string): SlackChannel {
    return this.request('channels.join', { name: channel }).channel
  }

  public postMessage(channel: string, opts: SlackPostMessageOpts) {
    this.joinChannel(channel)
    return this.request('chat.postMessage', { channel, ...opts }).ok
  }
}
