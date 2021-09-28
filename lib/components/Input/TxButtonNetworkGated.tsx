import { useIsWalletOnNetwork } from '@pooltogether/hooks'
import {
  SquareButton,
  SquareButtonProps,
  overrideToolTipPosition
} from '.yalc/@pooltogether/react-components/dist'
import ReactTooltip from 'react-tooltip'
import React, { useRef } from 'react'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'

export interface TxButtonNetworkGatedProps extends SquareButtonProps {
  chainId: number
  toolTipId: string
}

export const TxButtonNetworkGated = (props: TxButtonNetworkGatedProps) => {
  const { chainId, disabled, toolTipId, children, ...squareButtonProps } = props
  const isWalletOnProperNetwork = useIsWalletOnNetwork(chainId)

  const ref = useRef(null)

  return (
    <>
      <SquareButton
        {...squareButtonProps}
        data-tip
        data-for={`${toolTipId}-tooltip`}
        disabled={!isWalletOnProperNetwork || disabled}
        children={
          isWalletOnProperNetwork ? children : `Connect to ${getNetworkNiceNameByChainId(chainId)}`
        }
      />
      {!isWalletOnProperNetwork && (
        <ReactTooltip
          id={`${toolTipId}-tooltip`}
          backgroundColor='#111'
          place='top'
          effect='solid'
          overridePosition={overrideToolTipPosition}
          clickable
        >
          Please switch to chain {chainId}
        </ReactTooltip>
      )}
    </>
  )
}