import React, { useState } from 'react'
import classNames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { useTranslation } from 'react-i18next'
import { PrizePool } from '@pooltogether/v4-js-client'
import {
  BalanceBottomSheetButtonTheme,
  DefaultBalanceSheetViews,
  BalanceBottomSheet,
  NetworkIcon,
  TokenIcon
} from '@pooltogether/react-components'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'
import {
  useTransaction,
  useStakingPoolChainData,
  useUserLPChainData,
  useStakingPools
} from '@pooltogether/hooks'

import { UsersPrizePoolBalances } from 'lib/hooks/Tsunami/PrizePool/useUsersPrizePoolBalances'
import { useSelectedChainIdUser } from 'lib/hooks/Tsunami/User/useSelectedChainIdUser'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
// import { ManageBalanceSheet } from './ManageBalanceSheet'
import { useSelectedChainId } from 'lib/hooks/useSelectedChainId'
// import { DelegateTicketsSection } from './DelegateTicketsSection'

export interface StakingPool {
  prizePool: { chainId: number }
}

export const StakingDeposits = () => {
  const { t } = useTranslation()
  return (
    <div id='staking'>
      <h4 className='mb-2'>{t('staking')}</h4>

      <StakingDepositsList />
    </div>
  )
}

const StakingDepositsList = () => {
  const usersAddress = useUsersAddress()
  // const queryResults = useUsersStakingBalances(usersAddress)
  const stakingPools = useStakingPools()

  const { wallet, network } = useOnboard()

  // const user = useSelectedChainIdUser()
  // console.log({ user })

  // const { isTestnets } = useIsTestnets()
  // const chainId = isTestnets ? NETWORK.rinkeby : NETWORK.mainnet

  // const queryResults = useUsersV4Balances(usersAddress)
  // const isFetched = queryResults.every((queryResult) => queryResult.isFetched)

  // if (!isFetched) {
  //   return <LoadingList />
  // }

  return stakingPools.map((stakingPool) => (
    <StakingDepositItem
      wallet={wallet}
      network={network}
      key={`staking-pool-${stakingPool.prizePool.chainId}-${stakingPool.prizePool.address}`}
      stakingPool={stakingPool}
    />
  ))
}

interface StakingDepositItemsProps {
  wallet: object
  network: object
  stakingPool: StakingPool
  prizePool: PrizePool
}

const StakingDepositItem = (props) => {
  const { stakingPool, wallet, network } = props
  const { prizePool } = stakingPool

  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedView, setView] = useState(DefaultBalanceSheetViews.main)

  // console.log({ stakingPool })
  // console.log({ prizePool })

  const { setSelectedChainId } = useSelectedChainId()

  const usersAddress = useUsersAddress()

  const {
    data: stakingPoolChainData,
    refetch: stakingPoolChainDataRefetch,
    isFetched: stakingPoolChainDataIsFetched
  } = useStakingPoolChainData(stakingPool)
  const {
    data: userLPChainData,
    refetch: userLPChainDataRefetch,
    isFetched: userLPChainDataIsFetched
  } = useUserLPChainData(stakingPool, stakingPoolChainData, usersAddress)

  const isFetched = userLPChainDataIsFetched && stakingPoolChainDataIsFetched

  const [depositTxId, setDepositTxId] = useState(0)
  const depositTx = useTransaction(depositTxId)

  const [withdrawTxId, setWithdrawTxId] = useState(0)
  const withdrawTx = useTransaction(withdrawTxId)

  if (!isFetched) {
    return <LoadingList />
  }

  const refetch = () => {
    stakingPoolChainDataRefetch()
    userLPChainDataRefetch()
  }

  let balances
  if (userLPChainData) {
    balances = userLPChainData.balances
  }

  const withdrawView = <div>hi</div>

  const buttons = [
    {
      theme: BalanceBottomSheetButtonTheme.primary,
      label: t('deposit'),
      onClick: () => setView(DefaultBalanceSheetViews.deposit)
    },
    {
      theme: BalanceBottomSheetButtonTheme.secondary,
      label: t('withdraw'),
      disabled: !balances.ticket.hasBalance,
      onClick: () => setView(DefaultBalanceSheetViews.withdraw)
    },
    {
      theme: BalanceBottomSheetButtonTheme.tertiary,
      label: t('moreInfo'),
      onClick: () => setView(DefaultBalanceSheetViews.more)
    }
  ]

  return (
    <div
      className='relative rounded-lg p-2'
      style={{
        backgroundImage: 'linear-gradient(200deg, #CF4CBB 0%, #EA69D6 100%)'
      }}
    >
      <div className='absolute r-4 t-4 w-8 h-8 text-xl'>💎</div>
      <button
        className='hover:bg-white hover:bg-opacity-10 rounded-lg transition p-4 w-full flex justify-between items-center'
        onClick={() => {
          setSelectedChainId(prizePool.chainId)
          setIsOpen(true)
        }}
      >
        <NetworkLabel chainId={prizePool.chainId} />
        <StakingDepositBalance {...props} balances={balances} />
      </button>
      <div className='flex items-end justify-end w-full pb-4 pr-4'>
        <button
          className='transition uppercase font-semibold text-lg opacity-90 hover:opacity-100'
          onClick={() => {
            setSelectedChainId(prizePool.chainId)
            setIsOpen(true)
          }}
        >
          {t('manage')}
        </button>
      </div>
      <BalanceBottomSheet
        {...props}
        t={t}
        balances={balances}
        prizePool={prizePool}
        open={isOpen}
        onDismiss={() => setIsOpen(false)}
        setView={setView}
        selectedView={selectedView}
        withdrawView={withdrawView}
        withdrawTx={withdrawTx}
        network={network}
        wallet={wallet}
        label={`Staking Balance sheet`}
        className='space-y-4'
        buttons={buttons}
      />
    </div>
  )
}

const NetworkLabel = (props: { chainId: number }) => (
  <div className='flex'>
    <NetworkIcon chainId={props.chainId} className='mr-2 my-auto' />
    <span className='font-bold xs:text-lg'>{getNetworkNiceNameByChainId(props.chainId)}</span>
  </div>
)

interface StakingDepositItemsProps {
  stakingPool: StakingPool
  balances: UsersPrizePoolBalances
}

const StakingDepositBalance = (props: StakingDepositItemsProps) => {
  const { balances, stakingPool } = props

  if (!balances) {
    return null
  }

  const { ticket } = balances
  return (
    <div className='flex'>
      <TokenIcon
        chainId={stakingPool.prizePool.chainId}
        address={ticket.address}
        className='mr-2 my-auto'
      />
      <span className={classNames('font-bold text-lg mr-3', { 'opacity-50': !ticket.hasBalance })}>
        ${ticket.amountPretty}
      </span>
    </div>
  )
}

const LoadingList = () => (
  <ul className='space-y-4'>
    <li className='rounded-lg bg-white bg-opacity-20 dark:bg-actually-black dark:bg-opacity-10 animate-pulse w-full h-10' />
    <li className='rounded-lg bg-white bg-opacity-20 dark:bg-actually-black dark:bg-opacity-10 animate-pulse w-full h-10' />
  </ul>
)