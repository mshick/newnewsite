import isString from 'lodash-es/isString.js'
import git from 'simple-git'
import logger from '../logger'
import type { GitConfig, GitFileInfo } from '../types'

export async function getGitFileInfo(
  repoFolder: string,
  filePath: string
): Promise<GitFileInfo> {
  const gitRepo = git(repoFolder)

  const logOptions = {
    file: filePath,
    n: 1,
    format: {
      date: `%ai`,
      authorName: `%an`,
      authorEmail: '%ae'
    }
  }

  try {
    const { latest } = await gitRepo.log(logOptions)

    return {
      latestAuthorName: latest?.authorName ?? '',
      latestAuthorEmail: latest?.authorEmail ?? '',
      latestDate: latest?.date ?? ''
    }
  } catch (e) {
    logger.debug(e, `${filePath} not found in repo`)
    return {
      latestAuthorName: '',
      latestAuthorEmail: '',
      latestDate: ''
    }
  }
}

export async function getGitConfig(repoDir: string): Promise<GitConfig> {
  const gitRepo = git(repoDir)

  const config = await gitRepo.getConfig('remote.origin.url')
  const remotes = await gitRepo.remote(['show', 'origin'])
  const defaultBranch = isString(remotes)
    ? remotes.replace('\n', '').match(/HEAD branch: (.+)/)[1]
    : 'main'

  return {
    originUrl: config.value,
    defaultBranch
  }
}
