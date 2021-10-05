import classnames from 'classnames'
import { NetworkIcon } from '@pooltogether/react-components'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'

import { useSelectedNetwork } from 'lib/hooks/useSelectedNetwork'
import { useSupportedNetworks } from 'lib/hooks/useSupportedNetworks'

interface SelectedNetworkToggleProps {
  className?: string
}

export const SelectedNetworkToggle = (props: SelectedNetworkToggleProps) => {
  const { className } = props
  const supportedNetworks = useSupportedNetworks()
  const [selectedChainId, setSelectedNetwork] = useSelectedNetwork()

  return (
    <div
      className={classnames(
        className,
        'flex flex-row rounded-xl bg-pt-purple-bright p-1 max-w-max'
      )}
    >
      {supportedNetworks.map((chainId) => (
        <NetworkToggle
          key={chainId}
          chainId={chainId}
          isSelected={chainId === selectedChainId}
          setSelectedNetwork={setSelectedNetwork}
        />
      ))}
    </div>
  )
}

interface NetworkToggleProps {
  chainId: number
  isSelected: boolean
  setSelectedNetwork: (chainId: number) => void
}

const NetworkToggle = (props: NetworkToggleProps) => {
  const { chainId, setSelectedNetwork, isSelected } = props

  return (
    <button
      className={classnames(
        'transition mx-1 first:ml-0 last:mr-0 rounded-lg px-3 flex flex-row',
        'text-xs hover:text-white active:bg-purple',
        { 'bg-purple text-white': isSelected },
        { 'text-accent-4 hover:bg-light-purple-10': !isSelected }
      )}
      onClick={() => setSelectedNetwork(chainId)}
    >
      <NetworkIcon chainId={chainId} className='my-auto mr-1' sizeClassName='w-4 h-4' />
      <span>{getNetworkNiceNameByChainId(chainId)}</span>
    </button>
  )
}
