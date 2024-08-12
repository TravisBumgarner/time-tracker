import { Divider as MUIDivider, css } from '@mui/material'

interface Props {
  text?: string
}

const Divider = ({ text }: Props) => {
  return (
    <MUIDivider css={dividerCSS}>{text}</MUIDivider>
  )
}

const dividerCSS = css`
  margin: 1.5rem 0;
`

export default Divider
