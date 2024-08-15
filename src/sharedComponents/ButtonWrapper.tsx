import { Stack } from '@mui/material'

const ButtonWrapper = ({ children, isHorizontal }: { children: React.ReactNode, isHorizontal?: boolean }) => {
  return (
    <Stack mt={2} spacing={1} direction='row' css={isHorizontal}>{children}</Stack>
  )
}

export default ButtonWrapper
