/**
 * Notion Public Detctor
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

import { Config as NotionConfig } from './notion'
import { Detector, Config, SlackConfig } from './detector'

const projectUrl = 'https://github.com/linyows/notion-public-detector'

const notion: NotionConfig = {
  token: PropertiesService.getScriptProperties().getProperty('NOTION_ACCESS_TOKEN'),
  workspace: PropertiesService.getScriptProperties().getProperty('NOTION_WORKSPACE')
}

const slack: SlackConfig = {
  token: PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN'),
  username: 'Notion Agent',
  text: `Hey, Found public pages! :point_down: -- <${projectUrl}|About>`,
  iconUrl: 'https://raw.githubusercontent.com/linyows/notion-public-detector/master/misc/notion-agent-icon.png'
}

const config: Config = { notion, slack }
const detector = new Detector(config)

/**
 * Main
 */
function main() {
  detector.run()
}
