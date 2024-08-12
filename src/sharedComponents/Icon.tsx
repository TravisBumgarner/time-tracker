import { createSvgIcon } from '@mui/material'

const OneThirdsCircle = createSvgIcon(
  <svg
    viewBox="0 0 248 248"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      d="M124.155,0.001 L124,0 C192.483309,0 248,55.516691 248,124 C248,147.578963 241.418824,169.620809 229.993154,188.388858 L203.131238,172.883953 C211.924336,158.680274 217,141.93280 217,124 C217,72.7173858 175.491872,31.1295143 124.239532,31.0003019 L124.155,0.001 Z"
    ></path>
  </svg>,
  'OneThirdsCircle'
)

export const TwoThirdsCircle = createSvgIcon(
  <svg
    viewBox="0 0 248 248"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      d="M121,8 L121.155,8.001 L121.239532,39.0003019 C121.159711,39.0001007 121.079867,39 121,39 C69.6375183,39 28,80.6375183 28,132 C28,183.362482 69.6375183,225 121,225 C154.429602,225 183.739573,207.36176 200.131238,180.883953 L226.993154,196.388858 C205.233832,232.131185 165.904346,256 121,256 C52.516691,256 -3,200.483309 -3,132 C-3,63.516691 52.516691,8 121,8 Z"
      transform="translate(111.996577, 132.000000) rotate(240.000000) translate(-111.996577, -132.000000)"
    ></path>
  </svg>,
  'TwoThirdsCircle'
)

export const ThreeThirdsCircle = createSvgIcon(
  <svg
    viewBox="0 0 248 248"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      d="M124,0.447390842 C192.483309,0.447390842 248,55.9640819 248,124.447391 C248,192.9307 192.483309,248.447391 124,248.447391 C55.516691,248.447391 0,192.9307 0,124.447391 C0,55.9640819 55.516691,0.447390842 124,0.447390842 Z M124,31.4473908 C72.6375183,31.4473908 31,73.0849091 31,124.447391 C31,175.809873 72.6375183,217.447391 124,217.447391 C175.362482,217.447391 217,175.809873 217,124.447391 C217,73.0849091 175.362482,31.4473908 124,31.4473908 Z"
    ></path>
  </svg>,
  'ThreeThirdsCircle'
)

export const CanceledIcon = () => <ThreeThirdsCircle css={{ fill: 'var(--mui-palette-error-main)' }} />
export const BlockedIcon = () => <OneThirdsCircle css={{ fill: 'var(--mui-palette-warning-main)' }} />
export const CompletedIcon = () => <ThreeThirdsCircle css={{ fill: 'var(--mui-palette-secondary-main)' }} />
export const InProgressIcon = () => <TwoThirdsCircle css={{ fill: 'var(--mui-palette-secondary-main)' }} />
export const NewIcon = () => <OneThirdsCircle css={{ fill: 'var(--mui-palette-secondary-main)' }} />
