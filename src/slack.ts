/**
 * Notion Agent
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

/**
 * Slack Client
 */
export class Slack {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  public request<T>({ endpoint, body }): T {
    const res = UrlFetchApp.fetch(`https://slack.com/api/${endpoint}`, {
      method: 'post',
      payload: {
        token: this.token,
        ...body,
      },
    })
    console.log(body, res.getContentText())
    return JSON.parse(res.getContentText())
  }

  public joinChannel(channel: string): Channel {
    return this.request<JoinChannelResponse>({
      endpoint: 'channels.join',
      body: { name: channel },
    }).channel
  }

  public postMessage(body: PostMessage): boolean {
    this.joinChannel(body.channel)
    return this.request<PostMessageResponse>({
      endpoint: 'chat.postMessage',
      body,
    }).ok
  }
}

type PostMessage = {
  channel: string
  username: string
  icon_emoji?: string
  link_names: number
  text: string
  attachments?: string
}

type PostMessageResponse = {
  ok: boolean
  channel: string
  ts: string
  message: {
    type: string
    subtype: string
    text: string
    ts: string
    username: string
    //icon_emoji?: any
    bot_id?: string
    //attachments?: any
  }
}

type Channel = {
  id: string
  name: string
  members: string[]
}

type JoinChannelResponse = {
  ok: boolean
  channel: Channel
}
