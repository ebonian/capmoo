'use client'
import React from 'react'
import { LucideIcon } from 'lucide-react'
import Progressbar from '~/_components/progress-bar'

interface SubHeaderPaymentProps {
  currentStep: number
  title: string
  icon: LucideIcon
  text: string
  closingIcon?: boolean
}

export default function SubHeaderPayment({
  currentStep,
  title,
  icon: Icon,
  text,
  closingIcon = false,
}: SubHeaderPaymentProps) {
  return (
    <>
      <Progressbar totalSteps={3} currentStep={currentStep} />
      <div className='flex flex-col items-center gap-2'>
        <div className='text-xl font-medium'>{title}</div>
        <div className='flex items-center gap-2 text-xl font-bold'>
          <Icon />
          <span>{text}</span>
          {closingIcon && <Icon />}
        </div>
      </div>
    </>
  )
}
