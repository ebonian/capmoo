'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import Modal from '~/_components/modal'

type BannerSize = 'sm' | 'md' | 'lg'

interface BannerProps {
  header?: string
  content: React.ReactNode
  size?: BannerSize
}

interface UseBannerReturn {
  showBanner: (props: BannerProps) => void
  hideBanner: () => void
  Banner: React.FC
}

const useBanner = (): UseBannerReturn => {
  const [isVisible, setIsVisible] = useState(false)
  const [header, setHeader] = useState('')
  const [content, setContent] = useState<React.ReactNode>(null)
  const [size, setSize] = useState<BannerSize>('md')

  // Show banner with specific content and size
  const showBanner = ({ header = '', content, size = 'md' }: BannerProps) => {
    setHeader(header)
    setContent(content)
    setSize(size)
    setIsVisible(true)
  }

  // Hide banner
  const hideBanner = () => {
    setIsVisible(false)
    setContent(null)
  }

  // Banner component to render
  const Banner: React.FC = () => {
    if (!isVisible) {
      return null
    }

    const sizeClasses = {
      sm: 'w-32',
      md: 'w-64',
      lg: 'w-96',
    }

    return (
      <Modal isOpen={isVisible} onClose={hideBanner}>
        <div
          className={`fixed left-1/2 top-12 flex -translate-x-1/2 transform flex-col gap-5 rounded-[8px] border-2 border-black bg-white p-[8px] ${sizeClasses[size]} z-50`}
        >
          <div className='relative flex items-center justify-between'>
            <h2 className='text-orange'>{header}</h2>
            <X
              color='orange'
              strokeWidth={4}
              onClick={hideBanner}
              className='cursor-pointer'
            />
          </div>

          <div>{content}</div>
        </div>
      </Modal>
    )
  }

  return {
    showBanner,
    hideBanner,
    Banner,
  }
}

export default useBanner
