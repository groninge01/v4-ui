import React, { useContext, useState, useEffect } from 'react'
import classnames from 'classnames'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

const { getProfile } = require('3box/lib/api')

const isValidImage = (image) => {
  if (image && image[0] && image[0].contentUrl) {
    return true
  }

  return false
}

export function ProfileAvatar(props) {
  const { xl } = props

  const [profile, setProfile] = useState()

  const { usersAddress } = useContext(AuthControllerContext)

  const diameter = xl ? 40 : 20

  useEffect(() => {
    const get3BoxProfile = async () => {
      const boxProfile = await getProfile(usersAddress)
      setProfile(boxProfile)
    }

    if (usersAddress) {
      get3BoxProfile()
    }
  }, [usersAddress])

  if (!usersAddress) {
    return null
  }

  const image =
    profile && isValidImage(profile.image) ? (
      <img
        alt='profile avatar'
        src={`https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`}
        className={classnames('profile-img relative inline-block rounded-full mr-1', {
          'w-6 h-6': !xl,
          'w-12 h-12': xl,
        })}
      />
    ) : (
      <div className='profile-img profile-img--jazzicon relative inline-block ml-2 xs:ml-0 mr-2'>
        <Jazzicon diameter={diameter} seed={jsNumberForAddress(usersAddress)} />
      </div>
    )

  return image
}
