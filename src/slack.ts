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

  public channelList(c: string): ListConversationResponse {
    return this.request<ListConversationResponse>({
      endpoint: 'conversations.list',
      body: {
        exclude_archived: true,
        limit: 1000,
        cursor: c,
      },
    })
  }

  public channelListAll(): Channel[] {
    let channels: Channel[] = []
    let cursor: string = ''
    while (true) {
      const c = this.channelList(cursor)
      channels = [...channels, ...c.channels]
      cursor = c.response_metadata.next_cursor
      if (cursor === '') {
        break
      }
    }
    return channels
  }

  public joinConversation(channel: string): Channel {
    return this.request<JoinConversationResponse>({
      endpoint: 'conversations.join',
      body: { channel },
    }).channel
  }

  public joinChannel(channel: string): Channel {
    const c = this.channelListAll().find(v => v.name === channel)
    return this.joinConversation(c.id)
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
}

type JoinConversationResponse = {
  ok: boolean
  channel: Channel
}

type ListConversationResponse = {
  ok: boolean
  channels: Channel[]
  response_metadata: {
    next_cursor: string
  }
}
