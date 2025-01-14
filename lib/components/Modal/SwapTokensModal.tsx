import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { Modal, ModalProps } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'

import { CHAIN_ID } from 'lib/constants/constants'
import { getExchangeUrl } from 'lib/constants/config'

interface SwapTokensModalProps extends Omit<ModalProps, 'children'> {
  chainId: number
  tokenAddress: string
}

export const SwapTokensModal = (props: SwapTokensModalProps) => {
  const { chainId, tokenAddress } = props

  const { t } = useTranslation()

  const url = getExchangeUrl(chainId, tokenAddress)

  return (
    <Modal
      isOpen={Boolean(props.isOpen)}
      paddingClassName='pt-20'
      maxWidthClassName='sm:max-w-xl'
      label={t('getTokensModal', 'Get Tokens - modal')}
      closeModal={props.closeModal}
      style={{ paddingTop: 70 }}
    >
      <a
        className='absolute top-6 left-6 flex text-sm text-accent-1 transition-colors hover:text-inverse'
        href={url}
        target='_blank'
        rel='noopener noreferrer'
      >
        {t('openExchangeInNewTab', 'Open exchange in new tab')}
        <FeatherIcon icon={'external-link'} className='w-4 h-4 ml-2 my-auto' />
      </a>
      <iframe
        className='w-full h-full sm:h-75vh rounded-b-lg'
        src={url}
        title={t('decentralizedExchange', 'Decentralized exchange')}
        loading='lazy'
        referrerPolicy='no-referrer'
      />
    </Modal>
  )
}

SwapTokensModal.defaultProps = {
  chainId: CHAIN_ID.mainnet
}
