<p align="center">
  <img width="60" src="https://raw.githubusercontent.com/linyows/notion-agent/master/misc/notion-icon.png"> <br><br>
  <strong>Notion Agent</strong> notifies public pages to Slack channel from GAS.
</p>

<p align="center">
<a href="https://github.com/linyows/notion-agent/actions" title="actions"><img src="https://img.shields.io/github/workflow/status/linyows/notion-agent/Build?style=for-the-badge"></a>
<a href="https://github.com/google/clasp" title="clasp"><img src="https://img.shields.io/badge/built%20with-clasp-4285f4.svg?style=for-the-badge"></a>
<a href="https://github.com/linyows/notion-agent/blob/master/LICENSE" title="MIT License"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge"></a>
</p>

Usage
-----

1. Deploy this
    ```sh
    $ npm i
    $ npx clasp login
    $ npx clasp create 'Notion Agent' --rootDir ./src
    $ npx clasp push
    ```
1. Set script properties as ENV(File > Project properties > Script properties)
    - NOTION_ACCESS_TOKEN
    - NOTION_WORKSPACE
    - SLACK_ACCESS_TOKEN
    - SLACK_CHANNEL
1. Add project trigger(Edit > Current project's triggers > Add trigger)
    - Choose which function to run: `main`
    - Which run at deployment: `head`
    - Select event source: `Time-driven`
    - Select type of time based trigger: `Minute timer`
    - Select hour interval: `Every 10 minutes`

Contribution
------------

1. Fork (https://github.com/linyows/notion-agent/fork)
1. Create a feature branch
1. Commit your changes
1. Rebase your local changes against the master branch
1. Run test suite with the `npm ci` command and confirm that it passes
1. Create a new Pull Request

Author
------

[linyows](https://github.com/linyows)

