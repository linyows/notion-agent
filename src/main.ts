/**
 * Notion Agent
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

import { Agent, Config, SlackConfig, NotionConfig } from './agent'

const props = PropertiesService.getScriptProperties()
const repo = 'linyows/notion-agent'
const num = Math.floor(Math.random() * Math.floor(10))

const notion: NotionConfig = {
  token: props.getProperty('NOTION_ACCESS_TOKEN'),
  workspace: props.getProperty('NOTION_WORKSPACE')
}

const slack: SlackConfig = {
  token: props.getProperty('SLACK_ACCESS_TOKEN'),
  channel: props.getProperty('SLACK_CHANNEL'),
  username: 'Notion Agent',
  text: `Hey, See this in your workspace report :point_down: -- <https://github.com/${repo}|What's this?>`,
  iconUrl: `https://raw.githubusercontent.com/${repo}/master/misc/agent-${num}.png`,
  contextIconUrl: `https://raw.githubusercontent.com/${repo}/master/misc/notion-agent-icon.png`
}

/**
 * Main
 */
function main() {
  const agent = new Agent({ notion, slack })
  agent.run()
}
