import classNames from '#/utils/classNames'
import { Options } from '@/content'
import {
  FaLinkedin,
  FaSignalMessenger,
  FaSquareEnvelope,
  FaSquareGithub,
  FaSquareWhatsapp,
  FaSquareXTwitter
} from 'react-icons/fa6'
import { IconType } from 'react-icons/lib'

const socialIcons: Record<Options['socials'][0]['icon'], IconType> = {
  linkedin: FaLinkedin,
  github: FaSquareGithub,
  x: FaSquareXTwitter,
  signal: FaSignalMessenger,
  whatsapp: FaSquareWhatsapp,
  email: FaSquareEnvelope
}

export type SiteFooterProps = {
  showListeningTo?: boolean
  repoUrl?: Options['repoUrl']
  socials?: Options['socials']
}

export function SiteFooter({ repoUrl, socials }: SiteFooterProps) {
  return (
    <>
      <footer className="w-full">
        <hr className="z-30" />
        {/* <div>{showListeningTo && <ListeningTo />}</div> */}

        <div className="flex flex-row items-center content-between py-1 text-slate-600 ">
          <div className="flex-1 flex flex-row text-2xl relative">
            {socials?.map((social, idx) => {
              const Icon = socialIcons[social.icon]
              return (
                <div
                  key={social.name}
                  className={classNames(
                    idx !== 0 ? 'ml-2' : '',
                    'group py-5 overflow-visible'
                  )}
                >
                  <a
                    href={social.link}
                    title={social.name}
                    className="group-hover:bg-white group-hover:text-blue-700"
                  >
                    <Icon className="text-2xl" />{' '}
                  </a>
                  <span className="hidden group-hover:block text-xs absolute top-0 left-0 text-white bg-blue-700">
                    &gt; {social.description ?? social.name} &lt;
                  </span>
                </div>
              )
            }) ?? null}
          </div>
          {repoUrl ? (
            <div className="text-right">
              <a
                href={repoUrl}
                className="hover:bg-blue-700 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                &lt;src&gt;
              </a>
            </div>
          ) : null}
        </div>
      </footer>
    </>
  )
}
