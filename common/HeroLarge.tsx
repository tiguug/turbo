// import { css } from '@emotion/react'
import { shortPubKey } from '@cardinal/namespaces-components'
import { css } from '@emotion/react'
import { StakePoolConfig } from 'components/StakePoolConfig'
import { useStakePoolId } from 'hooks/useStakePoolId'
// import { StakePoolInfo } from 'components/StakePoolInfo'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

import { HeroStats } from '../components/HeroStats'
import { ButtonSmall } from './ButtonSmall'
// import { SocialIcon } from './Socials'

export const HeroLarge: React.FC = () => {
  const stakePoolId = useStakePoolId()
  const { data: config } = useStakePoolMetadata()
  // if (!config?.description) return <StakePoolInfo />
  return (
    <div className="relative -z-10 flex w-full flex-wrap items-stretch justify-center gap-8 py-8 lg:flex-nowrap lg:justify-between lg:gap-24">
      <div
        className="blur-4xl absolute left-8 top-52 -z-10 h-[120px] w-[400px] -rotate-[60deg] blur-[100px]"
        css={css`
          background-color: ${config?.colors?.accent};
        `}
      />
      <div
        className="blur-4xl absolute -right-20 top-72 -z-10 h-[100px] w-[550px] -rotate-[60deg] blur-[120px]"
        css={css`
          background-color: ${config?.colors?.accent};
        `}
      />
      {config?.imageUrl ? (
        <div className="relative flex w-1/4 grow items-center justify-center">
          <img
            className={`max-h-[200px] w-auto ${
              config?.logoPadding && 'p-8'
            }`}
            src={config?.imageUrl}
            alt={config?.displayName}
          />
        </div>
      ) : (
        <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl bg-white bg-opacity-5 md:w-1/4 md:grow">
          <a
            target={'_blank'}
            rel="noreferrer"
            href={`https://github.com/cardinal-labs/cardinal-staking-ui#customizing-your-stake-pool`}
          >
            <ButtonSmall onClick={() => {}}>Add image</ButtonSmall>
          </a>
        </div>
      )}
      <div className="flex w-3/4 grow-[2] flex-col py-4">
        <div className="mb-6 flex flex-col gap-6">
          <div className="text-4xl text-light-0">
            {config?.displayName ?? shortPubKey(stakePoolId)}
          </div>
          <div className="text-lg text-medium-3">
            {config?.description ??
              `Stake your token(s) to earn rewards from various reward mechanisms including tokens, merchandise, redeemable rewards by the ${
                config?.displayName ?? shortPubKey(stakePoolId)
              } pool.`}
          </div>
          <StakePoolConfig />
          {/* <div className="flex gap-4 text-light-0">
            {config.socialLinks?.map(({ icon, link }, i) => {
              return (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className={`cursor-pointer text-xl text-light-0 transition-all duration-300 hover:text-primary`}
                  css={css`
                    &:hover {
                      color: ${config.colors.accent} !important;
                    }
                  `}
                >
                  <SocialIcon iconKey={icon} />
                </a>
              )
            })}
          </div> */}
        </div>
        <HeroStats />
      </div>
    </div>
  )
}
