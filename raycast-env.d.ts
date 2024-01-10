/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {
  /** Notion API Key - Your Notion API Key */
  "NOTION_API_KEY": string,
  /** Notion Database ID - Your Notion Database ID */
  "NOTION_DATABASE_ID": string,
  /** Google calendar client ID - Your Google calendar client ID */
  "GCAL_CLIENT_ID"?: string,
  /** Google calendar ID - To which calendar you want to store these sessions */
  "GCAL_CALENDAR_ID"?: string
}
  /** Preferences accessible in the `reflect` command */
  export type Reflect = ExtensionPreferences & {
  /** Notion API Key - Your Notion API Key */
  "NOTION_API_KEY": string,
  /** Notion Database ID - Your Notion Database ID */
  "NOTION_DATABASE_ID": string
}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
  /** Arguments passed to the `reflect` command */
  export type Reflect = {}
}


