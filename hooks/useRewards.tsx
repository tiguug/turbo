import { getRewardMap } from '@cardinal/staking'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@project-serum/anchor'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useQuery } from 'react-query'

import { useRewardDistributorData } from './useRewardDistributorData'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useRewardEntries } from './useRewardEntries'
import { useRewardMintInfo } from './useRewardMintInfo'
import { useStakedTokenDatas } from './useStakedTokenDatas'

export const useRewards = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardDistributorTokenAccount } =
    useRewardDistributorTokenAccount()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { data: rewardEntries } = useRewardEntries()
  const { data: rewardMintInfo } = useRewardMintInfo()
  const { UTCNow } = useUTCNow()

  return useQuery<
    | {
        rewardMap: {
          [stakeEntryId: string]: { claimableRewards: BN; nextRewardsIn: BN }
        }
        claimableRewards: BN
      }
    | undefined
  >(
    [
      'useRewards',
      rewardDistributorData?.pubkey?.toString(),
      rewardEntries?.map((r) => r.pubkey.toString()).join(','),
      stakedTokenDatas?.map((s) => s.stakeEntry?.pubkey.toString()).join(','),
      UTCNow,
    ],
    () => {
      if (
        !(
          stakedTokenDatas &&
          rewardEntries &&
          rewardDistributorData &&
          rewardMintInfo &&
          (rewardDistributorData?.parsed.kind === RewardDistributorKind.Mint ||
            !!rewardDistributorTokenAccount)
        )
      ) {
        return { rewardMap: {}, claimableRewards: new BN(0) }
      }

      const stakeEntries = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)

      return getRewardMap(
        stakeEntries,
        rewardEntries,
        rewardDistributorData,
        rewardDistributorData.parsed.kind === RewardDistributorKind.Mint
          ? rewardMintInfo?.mintInfo.supply
          : rewardDistributorTokenAccount!.amount,
        UTCNow
      )
    },
    {
      keepPreviousData: true,
      enabled:
        !!stakedTokenDatas &&
        !!rewardEntries &&
        !!rewardDistributorData &&
        (rewardDistributorData?.parsed.kind === RewardDistributorKind.Mint ||
          !!rewardDistributorTokenAccount),
    }
  )
}
